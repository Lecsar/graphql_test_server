const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId, checkAvailabilityLink } = require('../utils');

async function signup(parent, args, { prisma }) {
    const password = await bcrypt.hash(args.password, 10);
    const user = await prisma.createUser({ ...args, password });
    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return { user, token };
}

async function login(parent, { email, password }, { prisma }, info) {
    const user = await prisma.user({ email });

    if (!user) {
        throw new Error('No such user found');
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
        throw new Error('Invalid password');
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return { token, user };
};

const post = (parent, { description, url }, { prisma, request }) => {
    const id = getUserId(request);
    return prisma.createLink({ url, description, postedBy: { connect: { id } } })
};

async function updateLink(parent, { id, description, url }, { prisma, request }) {
    const isLinkAvailable = await checkAvailabilityLink(id, prisma, request);

    if (isLinkAvailable) {
        return prisma.updateLink({ data: { description, url }, where: { id } });
    };
}

async function deleteLink(parent, { id }, { prisma, request }) {
    const isLinkAvailable = await checkAvailabilityLink(id, prisma, request);

    if (isLinkAvailable) {
        return prisma.deleteLink({ id });
    };
};

async function vote(parent, { linkId }, { prisma, request }) {
    const userId = getUserId(request);

    const linkExists = await prisma.$exists.vote({
        user: { id: userId },
        link: { id: linkId },
    });

    if (linkExists) {
        throw new Error(`Already voted for link: ${linkId}`)
    }

    return prisma.createVote({
        user: { connect: { id: userId } },
        link: { connect: { id: linkId } }
    })
}

module.exports = {
    signup,
    login,
    post,
    updateLink,
    deleteLink,
    vote,
}