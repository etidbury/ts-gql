// This resolver file was scaffolded by github.com/prisma/graphqlgen, DO NOT EDIT.
// Please do not import this file directly but copy & paste to your application code.

import { HelloPayloadResolvers } from "../graphqlgen";

export const HelloPayload: HelloPayloadResolvers.Type = {
  ...HelloPayloadResolvers.defaultResolvers,

  name: (parent, args, ctx) => {
    throw new Error("Resolver not implemented");
  }
};
