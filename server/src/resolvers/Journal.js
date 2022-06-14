const { checkConnected } = require("../utils");
async function createJournal(parent, args, context, info) {
  await checkConnected(context);

  const idProfileInt = parseInt(args.idProfile);
  const idClientInt = parseInt(args.idClient);
  const idProjectInt = parseInt(args.idProject);
  const idSubprojectInt = parseInt(args.idSubproject);

  const createdAtToday = new Date().toISOString();
  const newJournalObj = {
    idProfile: idProfileInt,
    idClient: idClientInt,
    idProject: idProjectInt,
    idSubproject: idSubprojectInt,
    createdAt: createdAtToday,
    updatedAt: null,
    EntryDate: args.EntryDate,
    Description: args.Description,
    Todos: args.Todos,
    ThingsDone: args.ThingsDone,
    DocUploaded: args.DocUploaded,
  };
  const newJournal = await context.prisma.journal.create({
    data: { ...newJournalObj },
  });
  return newJournal;
}

async function updateJournal(parent, args, context, info) {
  await checkConnected(context);

  const idJournalInt = parseInt(args.idJournal);

  const foundJournal = await context.prisma.journal.findUnique({
    where: { idJournal: idJournalInt },
  });
  if (!foundJournal) {
    throw new Error("Journal entry not found");
  }
  const updatedAtToday = new Date().toISOString();
  const updatedJournalObj = {
    idProfile: foundJournal.idProfile,
    idClient: foundJournal.idClient,
    idProject: foundJournal.idProject,
    idSubproject: foundJournal.idSubproject,
    idJournal: idJournalInt,
    createdAt: foundJournal.createdAt,
    updatedAt: updatedAtToday,
    EntryDate: args.EntryDate,
    Description: args.Description,
    Todos: args.Todos,
    ThingsDone: args.ThingsDone,
    DocUploaded: args.DocUploaded,
  };

  const updatedJournal = await context.prisma.journal.update({
    where: { idJournal: idJournalInt },
    data: { ...updatedJournalObj },
  });

  return updatedJournal;
}

async function deleteJournal(parent, args, context, info) {
  await checkConnected(context);
  const idJournalInt = parseInt(args.idJournal);
  const foundJournal = await context.prisma.journal.findUnique({
    where: { idJournal: idJournalInt },
  });
  if (!foundJournal) {
    throw new Error("Journal entry not found");
  }

  const deletedJournal = await context.prisma.journal.delete({
    where: { idJournal: idJournalInt },
    select: {
      idProfile: true,
      idClient: true,
      idProject: true,
      idSubproject: true,
      idJournal: true,
      EntryDate: true,
      Description: true,
    },
  });

  return deletedJournal;
}

module.exports = {
  createJournal,
  updateJournal,
  deleteJournal,
};
