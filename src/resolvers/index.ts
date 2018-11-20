import { IResolvers } from "graphql-tools"
import {MutationResolvers, QueryResolvers} from '../generated/graphqlgen'
import { Context } from "../types";
import {forwardTo} from 'prisma-binding'
const jwksClient = require('jwks-rsa')
const jwt = require('jsonwebtoken')
const jwks = jwksClient({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 1,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
})

const validateAndParseIdToken = (idToken) => new Promise((resolve, reject) => {
    const { header, payload } = jwt.decode(idToken, { complete: true })
    if (!header || !header.kid || !payload) reject(new Error('Invalid Token'))
    jwks.getSigningKey(header.kid, (err, key) => {
        if (err) reject(new Error('Error getting signing key: ' + err.message))
        jwt.verify(idToken, key.publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
            if (err) reject('jwt verify error: ' + err.message)
            resolve(decoded)
        })
    })
})


async function createPrismaUser(ctx, idToken) {
  const user = await ctx.db.mutation.createUser({
    data: {
      identity: idToken.sub.split(`|`)[0],
      auth0id: idToken.sub.split(`|`)[1],
      name: idToken.name,
      email: idToken.email,
      avatar: idToken.picture
    }
  })
  return user
}
const ctxUser = ctx => ctx.request.user

export const Mutation: MutationResolvers.Type = {
  async authenticate(parent, { idToken }, ctx, info) {
    let userToken:any = null
    try {
      userToken = await validateAndParseIdToken(idToken)
    } catch (err) {
      throw new Error(err.message)
    }
    
    //@ts-ignore
    const auth0id = userToken.sub.split("|")[1]
    let user = await ctx.db.query.user({ where: { auth0id } }, info)
    if (!user) {
      user = createPrismaUser(ctx, userToken)
    }
    return user
  },
  async createDraft(parent, { title, text }, ctx, info) {
    const { id } = ctxUser(ctx)
    return ctx.db.mutation.createPost(
      {
        data: { title, text, isPublished: false, user: { connect: { id } } }
      },
      info
    )
  },
  async deletePost(parent, { id }, ctx, info) {
    return ctx.db.mutation.deletePost({ where: { id } }, info)
  },
  async publish(parent, { id, ...p }, ctx, info) {
    console.log('PUBLISH')
    return ctx.db.mutation.updatePost(
      {
        where: { id },
        data: { isPublished: true }
      },
      info
    )
  }
}

export const Query:QueryResolvers.Type = {
  feed(parent, args, ctx, info) {
    return ctx.db.query.posts({ where: { isPublished: true } }, info)
  },
  drafts(parent, args, ctx, info) {
    return ctx.db.query.posts(
      { where: { isPublished: false, user: { id: ctxUser(ctx).id } } },
      info
    )
  },
  async post(parent, { id }, ctx, info) {
    return ctx.db.query.post({ where: { id } }, info)
  },
  me(parent, args, ctx, info) {
    return ctx.db.query.user({ where: { id: ctxUser(ctx).id } })
  },
  users: forwardTo('db'),
  hello(parent, args:any, ctx, info) {
    return {name:args.name||"world"}
  },
}
