exports.feed = async (parent, {filter, skip, first, orderBy}, {prisma}) => {
    const where = filter
        ? {
              OR: [{description_contains: filter}, {url_contains: filter}],
          }
        : {};

    const links = await prisma.links({where, skip, first, orderBy});
    const count = await prisma
        .linksConnection({where})
        .aggregate()
        .count();

    return {links, count};
};
