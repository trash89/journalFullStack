async function profile(parent, args, context) {
  return await context.prisma.profile.findUnique({
    where: {
      idProfile: parseInt(args.idProfile),
    },
    include: {
      client: true,
      journal: true,
    },
  });
}

async function client(parent, args, context) {
  return await context.prisma.client.findUnique({
    where: {
      idClient: parseInt(args.idClient),
    },
    include: {
      profile: true,
      project: true,
      subproject: true,
      journal: true,
    },
  });
}

async function project(parent, args, context) {
  return await context.prisma.project.findUnique({
    where: {
      idProject: parseInt(args.idProject),
    },
    include: {
      client: true,
      subproject: true,
      journal: true,
    },
  });
}

async function subproject(parent, args, context) {
  return await context.prisma.subproject.findUnique({
    where: {
      idSubproject: parseInt(args.idSubproject),
    },
    include: {
      client: true,
      project: true,
      journal: true,
    },
  });
}

async function profiles(parent, args, context) {
  return await context.prisma.profile.findMany({
    include: {
      client: true,
      journal: true,
    },
  });
}

async function journal(parent, args, context) {
  return await context.prisma.journal.findUnique({
    where: {
      idJournal: parseInt(args.idJournal),
    },
    include: {
      profile: true,
      client: true,
      project: true,
      subproject: true,
    },
  });
}

async function clients(parent, args, context) {
  return await context.prisma.client.findMany({
    include: {
      profile: true,
      project: true,
      subproject: true,
      journal: true,
    },
  });
}

async function projects(parent, args, context) {
  return await context.prisma.project.findMany({
    include: {
      client: true,
      subproject: true,
      journal: true,
    },
  });
}

async function subprojects(parent, args, context) {
  return await context.prisma.subproject.findMany({
    include: {
      client: true,
      project: true,
      journal: true,
    },
  });
}

async function journals(parent, args, context) {
  return await context.prisma.journal.findMany({
    include: {
      profile: true,
      client: true,
      project: true,
      subproject: true,
    },
  });
}

module.exports = {
  profile,
  client,
  project,
  subproject,
  journal,

  profiles,
  clients,
  projects,
  subprojects,
  journals,
};
