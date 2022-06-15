const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, checkConnected } = require("../utils");

async function createProfile(parent, args, context, info) {
  const hashedPassword = await bcrypt.hash(args.profile.Password, 10);
  const newProfileObj = {
    Username: args.profile.Username,
    Password: hashedPassword,
    Is_Admin: args.profile.Is_Admin,
  };

  const newProfile = await context.prisma.profile.create({
    data: { ...newProfileObj },
  });
  const retObject = { ...newProfile, Password: "is not displayed" };
  context.pubsub.publish("CREATE_PROFILE", retObject);
  return retObject;
}

async function login(parent, args, context, info) {
  const foundProfile = await context.prisma.profile.findUnique({
    where: { Username: args.Username },
  });
  if (!foundProfile) {
    throw new Error("No such user found");
  }

  const valid = await bcrypt.compare(args.Password, foundProfile.Password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ idProfile: foundProfile.idProfile }, APP_SECRET);

  const retObject = {
    token,
    profile: { ...foundProfile, Password: "is not displayed" },
  };
  context.pubsub.publish("LOGIN", retObject);
  return retObject;
}

async function updateProfile(parent, args, context, info) {
  const { idProfileConnected, foundConnected } = await checkConnected(context);
  const idProfileInt = parseInt(args.idProfile);
  if (foundConnected.Is_Admin !== "Y") {
    if (idProfileConnected !== idProfileInt) {
      throw new Error("cannot update other users");
    }
  }
  const hashedPassword = await bcrypt.hash(args.profile.Password, 10);
  const updatedProfileObj = {
    idProfile: idProfileInt,
    Username: args.profile.Username,
    Password: hashedPassword,
    Is_Admin: args.profile.Is_Admin,
  };

  const updatedProfile = await context.prisma.profile.update({
    where: { idProfile: idProfileInt },
    data: { ...updatedProfileObj },
  });

  const retObject = { ...updatedProfile, Password: "is not displayed" };
  context.pubsub.publish("UPDATE_PROFILE", retObject);
  return retObject;
}

async function deleteProfile(parent, args, context, info) {
  const { idProfileConnected, foundConnected } = await checkConnected(context);
  const idProfileInt = parseInt(args.idProfile);
  if (idProfileConnected === idProfileInt) {
    throw new Error("cannot delete the connected user");
  }
  if (foundConnected.Is_Admin !== "Y") {
    throw new Error("connected user must be admin to delete another users");
  }

  const foundProfile = await context.prisma.profile.findUnique({
    where: { idProfile: idProfileInt },
    include: {
      client: true,
      journal: true,
    },
  });
  if (!foundProfile) {
    throw new Error("No such user found");
  }
  if ((foundProfile.client && foundProfile.client.length > 0) || (foundProfile.journal && foundProfile.journal.length > 0)) {
    throw new Error("Cannot delete user, clients and journal entries exists");
  }
  const deletedProfile = await context.prisma.profile.delete({
    where: { idProfile: idProfileInt },
    select: {
      idProfile: true,
      Username: true,
      Password: false,
      Is_Admin: true,
    },
  });

  const retObject = { ...deletedProfile, Password: "is not displayed" };
  context.pubsub.publish("DELETE_PROFILE", retObject);
  return retObject;
}

module.exports = {
  createProfile,
  updateProfile,
  deleteProfile,
  login,
};