import { IResolvers } from "graphql-tools"

export default {
  Query: {
    hello: async (_, __, { req }) => {
      return { name: "world" }
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
