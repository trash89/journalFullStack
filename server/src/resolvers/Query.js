function profile(parent, args, context) {
  return context.prisma.profile.findUnique({
    where: {
      idProfile: parseInt(args.idProfile),
    },
    include: {
      client: true,
      journal: true,
    },
  });
}

function profiles(parent, args, context) {
  return context.prisma.profile.findMany({
    include: {
      client: true,
      journal: true,
    },
  });
}

function client(parent, args, context) {
  return context.prisma.client.findUnique({
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

function clients(parent, args, context) {
  return context.prisma.client.findMany({
    include: {
      profile: true,
      project: true,
      subproject: true,
      journal: true,
    },
  });
}

function project(parent, args, context) {
  return context.prisma.project.findUnique({
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

function projects(parent, args, context) {
  return context.prisma.project.findMany({
    include: {
      client: true,
      subproject: true,
      journal: true,
    },
  });
}

function subproject(parent, args, context) {
  return context.prisma.subproject.findUnique({
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

function subprojects(parent, args, context) {
  return context.prisma.subproject.findMany({
    include: {
      client: true,
      project: true,
      journal: true,
    },
  });
}
function journal(parent, args, context) {
  return context.prisma.journal.findUnique({
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

function journals(parent, args, context) {
  return context.prisma.journal.findMany({
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
  profiles,
  client,
  clients,
  project,
  projects,
  subproject,
  subprojects,
  journal,
  journals,
};
