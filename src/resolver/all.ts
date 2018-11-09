import { IResolvers } from "graphql-tools"
import {MutationResolvers, QueryResolvers} from '../generated/graphqlgen'
import { Context } from "../types";

export const Mutation: MutationResolvers.Type = {
  createUser:(parent,{name},ctx) =>{
    return ctx.db.createUser({name})
  }
}

export const Query:QueryResolvers.Type = {
  hello: async (parent,args, ctx:Context,info) => {
    return { name: "world" }
  },
  //@ts-ignore
  users: async (parent,args, ctx:Context) => {
    const users = await ctx.db.users()
    console.log('usrss',users)

    return users
  },
}
