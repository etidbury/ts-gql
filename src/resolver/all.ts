import { IResolvers } from "graphql-tools"

export default {
  Query: {
    hello: async (_, __, { req }) => {
      return { name: "world" }
    },
    users: async (_, __, { req,prisma }) => {
      return prisma.users()
    },
  },
  // Mutation: {
  //   // register: async (_, { email, password }) => {
  //   //   await Chart.create({
        
  //   //   }).save()

  //   //   return true;
  //   // },
  // }
} as IResolvers
