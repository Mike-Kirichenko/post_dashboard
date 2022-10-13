const { GraphQLUpload } = require('graphql-upload-minimal');
const { Query: PostQuery, Mutation: PostMutation } = require('./postResolvers');
const { Query: CategoryQuery } = require('./categoryResolvers');

const Query = { ...PostQuery, ...CategoryQuery };
const Mutation = { ...PostMutation };

module.exports = { Upload: GraphQLUpload, Query, Mutation };
