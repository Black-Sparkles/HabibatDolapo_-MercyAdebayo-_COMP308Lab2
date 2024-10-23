const adminResolver = require("./admin.server.resolver");
const courseResolver = require("./courses.server.resolver");
const studentResolver = require("./students.server.resolver");

const resolvers = {
    Query: {
        ...adminResolver.Query,
        ...courseResolver.Query,
        ...studentResolver.Query,
    },
    Mutation: {
        ...adminResolver.Mutation,
        ...courseResolver.Mutation,
        ...studentResolver.Mutation,
    },
};

module.exports = resolvers;