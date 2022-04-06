"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.ROLE = exports.authorize = void 0;
var crypto = __importStar(require("crypto"));
var ROLE;
(function (ROLE) {
    ROLE[ROLE["DEFAULT"] = 0] = "DEFAULT";
    ROLE[ROLE["ADMIN"] = 1] = "ADMIN";
})(ROLE || (ROLE = {}));
exports.ROLE = ROLE;
function authorize(user, role) {
    return function (req, res, next) {
        if (!req.user) {
            return res.sendStatus(401);
        }
        if (!hasRole(user, role)) {
            return res.sendStatus(401);
        }
        next();
    };
}
exports.authorize = authorize;
function hasRole(user, role) {
    return user.role === role;
}
function hashPassword(password) {
    return crypto.createHash("sha512").update(password);
}
function createUser(username, password) {
    var salt = crypto.randomBytes(32).toString("hex");
    var unsalted = hashPassword(password).digest("hex");
    var passwordSalted = crypto.createHash("sha512").update(unsalted).update(salt).digest("hex");
    var user = {
        name: username,
        password: passwordSalted,
        salt: salt,
        role: ROLE.DEFAULT
    };
    return user;
}
exports.createUser = createUser;
function login(username, password) {
}
