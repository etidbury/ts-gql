"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_client_lib_1 = require("prisma-client-lib");
const prisma_schema_1 = require("./prisma-schema");
exports.Prisma = prisma_client_lib_1.makePrismaClientClass({
    typeDefs: prisma_schema_1.typeDefs,
    endpoint: `${process.env["PRISMA_URL"]}`
});
exports.prisma = new exports.Prisma();
//# sourceMappingURL=index.js.map