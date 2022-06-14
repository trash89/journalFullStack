const { checkConnected } = require("../utils");
async function createClient(parent, args, context, info) {
  const { idProfileConnected, foundConnected } = await checkConnected(context);
  const newClientObj = {
    idProfile: idProfileConnected,
    Name: args.Name,
    Description: args.Description,
    StartDate: args.StartDate,
    EndDate: args.EndDate,
  };
  const newClient = await context.prisma.client.create({
    data: { ...newClientObj },
  });

  return newClient;
}

async function updateClient(parent, args, context, info) {
  const { idProfileConnected, foundConnected } = await checkConnected(context);

  const idClientInt = parseInt(args.idClient);
  const foundClient = await context.prisma.client.findUnique({
    where: {
      idClient: idClientInt,
    },
  });
  if (!foundClient) {
    throw new Error("Client not found");
  }
  const updatedClientObj = {
    idProfile: foundClient.idProfile,
    idClient: idClientInt,
    Name: args.Name,
    Description: args.Description,
    StartDate: args.StartDate,
    EndDate: args.EndDate,
  };

  const updatedClient = await context.prisma.client.update({
    where: { idClient: idClientInt },
    data: { ...updatedClientObj },
  });

  return updatedClient;
}

async function deleteClient(parent, args, context, info) {
  const { idProfileConnected, foundConnected } = await checkConnected(context);

  const idClientInt = parseInt(args.idClient);
  const foundClient = await context.prisma.client.findUnique({
    where: {
      idClient: idClientInt,
    },
    include: {
      project: true,
      subproject: true,
      journal: true,
    },
  });
  if (!foundClient) {
    throw new Error("Client not found");
  }
  if (
    (foundClient.project && foundClient.project.length > 0) ||
    (foundClient.journal && foundClient.journal.length > 0) ||
    (foundClient.subproject && foundClient.subproject.length > 0)
  ) {
    throw new Error(
      "Cannot delete client, projects, subprojects and/or journal entries exists"
    );
  }

  const deletedClient = await context.prisma.client.delete({
    where: { idClient: idClientInt },
    select: {
      idProfile: true,
      idClient: true,
      Name: true,
      Description: true,
      StartDate: true,
      EndDate: true,
    },
  });

  return deletedClient;
}

module.exports = {
  createClient,
  updateClient,
  deleteClient,
};
