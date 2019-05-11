exports.postedBy = ({ id }, args, { prisma }) => prisma.link({ id }).postedBy()

exports.votes = ({ id }, args, { prisma }) => prisma.link({ id }).votes();