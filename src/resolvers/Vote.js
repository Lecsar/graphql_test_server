exports.link = ({ id }, args, { prisma }) => prisma.vote({ id }).link();

exports.user = ({ id }, args, { prisma }) => prisma.vote({ id }).user();