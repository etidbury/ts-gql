"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_get_1 = require("lodash.get");
const _userLocationOnContext = "request.user";
const ctxUser = (ctx, userLocationOnContext) => lodash_get_1.default(ctx, userLocationOnContext ? userLocationOnContext : _userLocationOnContext);
const isLoggedIn = ctx => {
    const user = ctxUser(ctx, _userLocationOnContext);
    if (!user)
        throw new Error(`Not logged in`);
    return user;
};
const isRequestingUserAlsoOwner = ({ ctx, userId, type, typeId }) => ctx.db.exists[type]({ id: typeId, user: { id: userId } });
const isRequestingUser = ({ ctx, userId }) => ctx.db.exists.User({ id: userId });
exports.default = {
    isAuthenticated(next, source, args, ctx) {
        isLoggedIn(ctx);
        return next();
    },
    hasRole(next, source, { roles }, ctx) {
        const { role } = isLoggedIn(ctx);
        if (roles.includes(role)) {
            return next();
        }
        throw new Error(`Unauthorized, incorrect role`);
    },
    isOwner(next, source, { type }, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: typeId } = source && source.id
                ? source
                : ctx.request.body.variables ? ctx.request.body.variables : { id: null };
            const { id: userId } = isLoggedIn(ctx);
            const isOwner = type === `User`
                ? userId === typeId
                : yield isRequestingUserAlsoOwner({ ctx, userId, type, typeId });
            if (isOwner) {
                return next();
            }
            throw new Error(`Unauthorized, must be owner`);
        });
    },
    isOwnerOrHasRole(next, source, { roles, type }, ctx, ...p) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: userId, role } = isLoggedIn(ctx);
            if (roles.includes(role)) {
                return next();
            }
            const { id: typeId } = ctx.request.body.variables;
            const isOwner = yield isRequestingUserAlsoOwner({
                ctx,
                userId,
                type,
                typeId
            });
            if (isOwner) {
                return next();
            }
            throw new Error(`Unauthorized, not owner or incorrect role`);
        });
    }
};
//# sourceMappingURL=index.js.map