const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, checkConnected } = require("../utils");

async function createProfile(parent, args, context, info) {
  const hashedPassword = await bcrypt.hash(args.Password, 10);

  const newProfile = await context.prisma.profile.create({
    data: { ...args, Password: hashedPassword },
  });

  return { ...newProfile, Password: "" };
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

  return {
    token,
    profile: { ...foundProfile, Password: "" },
  };
}

async function updateProfile(parent, args, context, info) {
  const { idProfileConnected, foundConnected } = await checkConnected(context);
  const idProfileInt = parseInt(args.idProfile);
  if (foundConnected.Is_Admin !== "Y") {
    if (idProfileConnected !== idProfileInt) {
      throw new Error("cannot update other users");
    }
  }
  const hashedPassword = await bcrypt.hash(args.Password, 10);
  const updatedProfileObj = {
    idProfile: idProfileInt,
    Username: args.Username,
    Password: hashedPassword,
    Is_Admin: args.Is_Admin,
  };

  const updatedProfile = await context.prisma.profile.update({
    where: { idProfile: idProfileInt },
    data: { ...updatedProfileObj },
  });
  return { ...updatedProfile, Password: "" };
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
  if (
    (foundProfile.client && foundProfile.client.length > 0) ||
    (foundProfile.journal && foundProfile.journal.length > 0)
  ) {
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
  return { ...deletedProfile, Password: "" };
}

module.exports = {
  createProfile,
  updateProfile,
  deleteProfile,
  login,
};
