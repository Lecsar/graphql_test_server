exports.links = ({ id }, args, { prisma }) => prisma.user({ id }).links()

exports.links = ({ id }, args, { prisma }) => prisma.user({ id }).votes()