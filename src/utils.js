const jwt = require('jsonwebtoken');
const APP_SECRET = 'GraphQL-is-aw3some';

const getUserId = (request) => {
    const Authorization = request.get('Authorization');

    if (Authorization) {
        const token = Authorization.replace('Bearer ', '');
        const { userId } = jwt.verify(token, APP_SECRET);
        return userId;
    }

    throw new Error('Not authenticated');
}

async function checkAvailabilityLink(id, prisma, request) {
    const userId = getUserId(request);
    const creatorOfLink = await prisma.link({ id }).postedBy();

    if (creatorOfLink) {
        if (creatorOfLink.id === userId) {
            return true;
        }

        throw new Error('Not permission for editing the post');
    }

    throw new Error(`Post with id ${id} not found`);
}

module.exports = {
    APP_SECRET,
    getUserId,
    checkAvailabilityLink,
}