const { checkConnected } = require("../utils");
async function createJournal(parent, args, context, info) {
  await checkConnected(context);

  const idProfileInt = parseInt(args.journal.idProfile);
  const idClientInt = parseInt(args.journal.idClient);
  const idProjectInt = parseInt(args.journal.idProject);
  const idSubprojectInt = parseInt(args.journal.idSubproject);

  const createdAtToday = new Date().toISOString();
  const newJournalObj = {
    idProfile: idProfileInt,
    idClient: idClientInt,
    idProject: idProjectInt,
    idSubproject: idSubprojectInt,
    createdAt: createdAtToday,
    updatedAt: null,
    EntryDate: args.journal.EntryDate,
    Description: args.journal.Description,
    Todos: args.journal.Todos,
    ThingsDone: args.journal.ThingsDone,
    DocUploaded: args.journal.DocUploaded,
  };
  const createdJournal = await context.prisma.journal.create({
    data: { ...newJournalObj },
  });
  context.pubsub.publish("CREATE_JOURNAL", createdJournal);
  return createdJournal;
}

async function updateJournal(parent, args, context, info) {
  await checkConnected(context);
  const idJournalInt = parseInt(args.idJournal);
  const idProfileInt = parseInt(args.journal.idProfile);
  const idClientInt = parseInt(args.journal.idClient);
  const idProjectInt = parseInt(args.journal.idProject);
  const idSubprojectInt = parseInt(args.journal.idSubproject);
  const foundJournal = await context.prisma.journal.findUnique({
    where: { idJournal: idJournalInt },
  });
  if (!foundJournal) {
    throw new Error("Journal entry not found");
  }
  const updatedAtToday = new Date().toISOString();
  const updatedJournalObj = {
    idProfile: idProfileInt,
    idClient: idClientInt,
    idProject: idProjectInt,
    idSubproject: idSubprojectInt,
    idJournal: idJournalInt,
    createdAt: foundJournal.createdAt,
    updatedAt: updatedAtToday,
    EntryDate: args.journal.EntryDate,
    Description: args.journal.Description,
    Todos: args.journal.Todos,
    ThingsDone: args.journal.ThingsDone,
    DocUploaded: args.journal.DocUploaded,
  };

  const updatedJournal = await context.prisma.journal.update({
    where: { idJournal: idJournalInt },
    data: { ...updatedJournalObj },
  });

  context.pubsub.publish("UPDATE_JOURNAL", updatedJournal);
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

  context.pubsub.publish("DELETE_JOURNAL", deletedJournal);
  return deletedJournal;
}

module.exports = {
  createJournal,
  updateJournal,
  deleteJournal,
};