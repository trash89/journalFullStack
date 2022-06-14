const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET } = require("../utils");

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

  const hashedPassword = await bcrypt.hash(args.Password, 10);

  const updatedProfile = await context.prisma.profile.update({
    where: { idProfile: parseInt(foundConnected.idProfile) },
    data: { ...args, Password: hashedPassword },
  });
  return { ...updatedProfile, Password: "" };
}

async function checkConnected(context) {
  const { idProfile: idProfileConnected } = context;
  if (!idProfileConnected) {
    throw new Error("Not authenticated");
  }
  const foundConnected = await context.prisma.profile.findUnique({
    where: { idProfile: parseInt(idProfileConnected) },
  });
  if (!foundConnected) {
    throw new Error("No such user found");
  }
  return { idProfileConnected, foundConnected };
}

async function deleteProfile(parent, args, context, info) {
  const { idProfileConnected, foundConnected } = await checkConnected(context);
  if (idProfileConnected === parseInt(args.idProfile)) {
    throw new Error("cannot delete the connected user");
  }
  if (foundConnected.Is_Admin === "N") {
    throw new Error("connected user must be admin to delete another users");
  }

  const foundProfile = await context.prisma.profile.findUnique({
    where: { idProfile: parseInt(args.idProfile) },
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
    where: { idProfile: parseInt(foundProfile.idProfile) },
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
