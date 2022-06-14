const { checkConnected } = require("../utils");
async function createSubproject(parent, args, context, info) {
  await checkConnected(context);
  const idClientInt = parseInt(args.idClient);
  const idProjectInt = parseInt(args.idProject);
  const newSubprojectObj = {
    idClient: idClientInt,
    idProject: idProjectInt,
    Name: args.Name,
    Description: args.Description,
    isDefault: args.isDefault,
    StartDate: args.StartDate,
    EndDate: args.EndDate,
    Finished: args.Finished,
  };
  const newSubproject = await context.prisma.subproject.create({
    data: { ...newSubprojectObj },
  });
  return newSubproject;
}

async function updateSubproject(parent, args, context, info) {
  await checkConnected(context);
  const idSubprojectInt = parseInt(args.idSubproject);
  const foundSubproject = await context.prisma.subproject.findUnique({
    where: { idSubproject: idSubprojectInt },
  });
  if (!foundSubproject) {
    throw new Error("Subproject not found");
  }
  const updatedSubprojectObj = {
    idClient: foundSubproject.idClient,
    idSubproject: idSubprojectInt,
    Name: args.Name,
    Description: args.Description,
    isDefault: args.isDefault,
    StartDate: args.StartDate,
    EndDate: args.EndDate,
    Finished: args.Finished,
  };

  const updatedSubproject = await context.prisma.subproject.update({
    where: { idSubproject: idSubprojectInt },
    data: { ...updatedSubprojectObj },
  });

  return updatedSubproject;
}

async function deleteSubproject(parent, args, context, info) {
  await checkConnected(context);
  const idSubprojectInt = parseInt(args.idSubproject);
  const foundSubproject = await context.prisma.subproject.findUnique({
    where: { idSubproject: idSubprojectInt },
    include: {
      journal: true,
    },
  });
  if (!foundSubproject) {
    throw new Error("Subproject not found");
  }
  if (foundSubproject.journal && foundSubproject.journal.length > 0) {
    throw new Error("Cannot delete subproject, journal entries exists");
  }

  const deletedSubproject = await context.prisma.subproject.delete({
    where: { idSubproject: idSubprojectInt },
    select: {
      idClient: true,
      idProject: true,
      idSubproject: true,
      Name: true,
      Description: true,
      isDefault: true,
      StartDate: true,
      EndDate: true,
      Finished: true,
    },
  });

  return deletedSubproject;
}

module.exports = {
  createSubproject,
  updateSubproject,
  deleteSubproject,
};
