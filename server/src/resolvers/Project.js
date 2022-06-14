const { checkConnected } = require("../utils");
async function createProject(parent, args, context, info) {
  await checkConnected(context);
  const idClientInt = parseInt(args.idClient);
  const newProjectObj = {
    idClient: idClientInt,
    Name: args.Name,
    Description: args.Description,
    isDefault: args.isDefault,
    StartDate: args.StartDate,
    EndDate: args.EndDate,
    Finished: args.Finished,
  };
  const newProject = await context.prisma.project.create({
    data: { ...newProjectObj },
  });
  return newProject;
}

async function updateProject(parent, args, context, info) {
  await checkConnected(context);
  const idProjectInt = parseInt(args.idProject);
  const foundProject = await context.prisma.project.findUnique({
    where: { idProject: idProjectInt },
  });
  if (!foundProject) {
    throw new Error("Project not found");
  }
  const updatedProjectObj = {
    idClient: foundProject.idClient,
    idProject: idProjectInt,
    Name: args.Name,
    Description: args.Description,
    isDefault: args.isDefault,
    StartDate: args.StartDate,
    EndDate: args.EndDate,
    Finished: args.Finished,
  };

  const updatedProject = await context.prisma.project.update({
    where: { idProject: idProjectInt },
    data: { ...updatedProjectObj },
  });

  return updatedProject;
}

async function deleteProject(parent, args, context, info) {
  await checkConnected(context);
  const idProjectInt = parseInt(args.idProject);
  const foundProject = await context.prisma.project.findUnique({
    where: { idProject: idProjectInt },
    include: {
      subproject: true,
      journal: true,
    },
  });
  if (!foundProject) {
    throw new Error("Project not found");
  }
  if (
    (foundProject.journal && foundProject.journal.length > 0) ||
    (foundProject.subproject && foundProject.subproject.length > 0)
  ) {
    throw new Error(
      "Cannot delete project, subprojects and/or journal entries exists"
    );
  }

  const deletedProject = await context.prisma.project.delete({
    where: { idProject: idProjectInt },
    select: {
      idClient: true,
      idProject: true,
      Name: true,
      Description: true,
      isDefault: true,
      StartDate: true,
      EndDate: true,
      Finished: true,
    },
  });

  return deletedProject;
}

module.exports = {
  createProject,
  updateProject,
  deleteProject,
};
