function profile(parent, args, context) {
  return context.prisma.profile.findUnique({
    where: {
      Username: args.Username,
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
  return context.prisma.client.findMany({
    where: {
      Name: { contains: args.NameContains },
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
  return context.prisma.project.findMany({
    where: {
      Name: { contains: args.NameContains },
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
  return context.prisma.subproject.findMany({
    where: {
      Name: { contains: args.NameContains },
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
  return context.prisma.journal.findMany({
    where: {
      Description: { contains: args.DescriptionContains },
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
