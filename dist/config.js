"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
var config = {
    messages: {
        login: {
            FAIL: "Failed to log in",
            SUCCESS: "Logged in"
        },
        files: {
            NO_FILE: "No file selected",
            UPLOADED: "Uploaded file %file%",
            DELETED: "Deleted file %file%",
            RENAMED: "Renamed file %old% to %new%"
        }
    },
    credentials: {
        PASSWORD_HASH: crypto_1.default.createHash("sha512").update(process.env.USR + "").update(process.env.RND + "").digest("hex")
    },
    user: {
        COOKIE_NAME: "user"
    }
};
exports.default = config;
