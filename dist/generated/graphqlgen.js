"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var QueryResolvers;
(function (QueryResolvers) {
    QueryResolvers.defaultResolvers = {};
})(QueryResolvers = exports.QueryResolvers || (exports.QueryResolvers = {}));
var PostResolvers;
(function (PostResolvers) {
    PostResolvers.defaultResolvers = {
        id: (parent) => parent.id,
        isPublished: (parent) => parent.isPublished,
        title: (parent) => parent.title,
        text: (parent) => parent.text,
        testString: (parent) => parent.testString,
        user: (parent) => parent.user
    };
})(PostResolvers = exports.PostResolvers || (exports.PostResolvers = {}));
var UserResolvers;
(function (UserResolvers) {
    UserResolvers.defaultResolvers = {
        id: (parent) => parent.id,
        email: (parent) => parent.email,
        role: (parent) => parent.role,
        name: (parent) => parent.name,
        avatar: (parent) => parent.avatar,
        identity: (parent) => parent.identity
    };
})(UserResolvers = exports.UserResolvers || (exports.UserResolvers = {}));
var MutationResolvers;
(function (MutationResolvers) {
    MutationResolvers.defaultResolvers = {};
})(MutationResolvers = exports.MutationResolvers || (exports.MutationResolvers = {}));
var HelloPayloadResolvers;
(function (HelloPayloadResolvers) {
    HelloPayloadResolvers.defaultResolvers = {
        name: (parent) => parent.name === undefined ? null : parent.name
    };
})(HelloPayloadResolvers = exports.HelloPayloadResolvers || (exports.HelloPayloadResolvers = {}));
//# sourceMappingURL=graphqlgen.js.map