const CREATED = 'CREATED';
const resolve = payload => payload;

const newLinkSubscribe = (parent, args, { prisma }) =>
    prisma.$subscribe.link({ mutation_in: [CREATED] }).node()

const newVoteSubscribe = (parent, args, { prisma }) =>
    prisma.$subscribe.vote({ mutation_in: [CREATED] }).node();

const newLink = {
    subscribe: newLinkSubscribe,
    resolve
}

const newVote = {
    subscribe: newVoteSubscribe,
    resolve
}

module.exports = {
    newLink,
    newVote,
}