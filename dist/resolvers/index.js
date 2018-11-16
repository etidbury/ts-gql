"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_binding_1 = require("prisma-binding");
const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');
const jwks = jwksClient({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 1,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
});
const validateAndParseIdToken = (idToken) => new Promise((resolve, reject) => {
    const { header, payload } = jwt.decode(idToken, { complete: true });
    if (!header || !header.kid || !payload)
        reject(new Error('Invalid Token'));
    jwks.getSigningKey(header.kid, (err, key) => {
        if (err)
            reject(new Error('Error getting signing key: ' + err.message));
        jwt.verify(idToken, key.publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
            if (err)
                reject('jwt verify error: ' + err.message);
            resolve(decoded);
        });
    });
});
function createPrismaUser(ctx, idToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield ctx.db.mutation.createUser({
            data: {
                identity: idToken.sub.split(`|`)[0],
                auth0id: idToken.sub.split(`|`)[1],
                name: idToken.name,
                email: idToken.email,
                avatar: idToken.picture
            }
        });
        return user;
    });
}
const ctxUser = ctx => ctx.request.user;
exports.Mutation = {
    authenticate(parent, { idToken }, ctx, info) {
        return __awaiter(this, void 0, void 0, function* () {
            let userToken = null;
            try {
                userToken = yield validateAndParseIdToken(idToken);
            }
            catch (err) {
                throw new Error(err.message);
            }
            const auth0id = userToken.sub.split("|")[1];
            let user = yield ctx.db.query.user({ where: { auth0id } }, info);
            if (!user) {
                user = createPrismaUser(ctx, userToken);
            }
            return user;
        });
    },
    createDraft(parent, { title, text }, ctx, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = ctxUser(ctx);
            return ctx.db.mutation.createPost({
                data: { title, text, isPublished: false, user: { connect: { id } } }
            }, info);
        });
    },
    deletePost(parent, { id }, ctx, info) {
        return __awaiter(this, void 0, void 0, function* () {
            return ctx.db.mutation.deletePost({ where: { id } }, info);
        });
    },
    publish(parent, _a, ctx, info) {
        var { id } = _a, p = __rest(_a, ["id"]);
        return __awaiter(this, void 0, void 0, function* () {
            console.log('PUBLISH');
            return ctx.db.mutation.updatePost({
                where: { id },
                data: { isPublished: true }
            }, info);
        });
    }
};
exports.Query = {
    feed(parent, args, ctx, info) {
        return ctx.db.query.posts({ where: { isPublished: true } }, info);
    },
    drafts(parent, args, ctx, info) {
        return ctx.db.query.posts({ where: { isPublished: false, user: { id: ctxUser(ctx).id } } }, info);
    },
    post(parent, { id }, ctx, info) {
        return __awaiter(this, void 0, void 0, function* () {
            return ctx.db.query.post({ where: { id } }, info);
        });
    },
    me(parent, args, ctx, info) {
        return ctx.db.query.user({ where: { id: ctxUser(ctx).id } });
    },
    users: prisma_binding_1.forwardTo('db')
};
//# sourceMappingURL=index.js.map