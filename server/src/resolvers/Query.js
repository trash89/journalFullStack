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

async function profiles(parent, args, context) {
  const where = args.filter
    ? {
        Username: { contains: args.filter },
      }
    : {};
  const count = await context.prisma.profile.count({ where });
  const list = await context.prisma.profile.findMany({
    where,
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy,
    include: {
      client: true,
      journal: true,
    },
  });
  return { list, count };
}

async function clients(parent, args, context) {
  const where = args.filter
    ? {
        OR: [{ Name: { contains: args.filter } }, { Description: { contains: args.filter } }],
      }
    : {};
  const count = await context.prisma.client.count({ where });
  const list = await context.prisma.client.findMany({
    where,
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy,
    include: {
      profile: true,
      project: true,
      subproject: true,
      journal: true,
    },
  });
  return { list, count };
}

async function projects(parent, args, context) {
  const where = args.filter
    ? {
        OR: [{ Name: { contains: args.filter } }, { Description: { contains: args.filter } }],
      }
    : {};
  const count = await context.prisma.project.count({ where });
  const list = await context.prisma.project.findMany({
    where,
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy,
    include: {
      client: true,
      subproject: true,
      journal: true,
    },
  });
  return { list, count };
}

async function subprojects(parent, args, context) {
  const where = args.filter
    ? {
        OR: [{ Name: { contains: args.filter } }, { Description: { contains: args.filter } }],
      }
    : {};
  const count = await context.prisma.subproject.count({ where });
  const list = await context.prisma.subproject.findMany({
    where,
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy,
    include: {
      client: true,
      project: true,
      journal: true,
    },
  });
  return { list, count };
}

async function journals(parent, args, context) {
  const where = args.filter
    ? {
        OR: [{ Description: { contains: args.filter } }, { Todos: { contains: args.filter } }, { ThingsDone: { contains: args.filter } }],
      }
    : {};
  const count = await context.prisma.journal.count({ where });
  const list = await context.prisma.journal.findMany({
    where,
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy,
    include: {
      profile: true,
      client: true,
      project: true,
      subproject: true,
    },
  });
  return { list, count };
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
