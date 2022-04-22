import crypto from "crypto";

interface LoginMessages {
    FAIL: string;
    SUCCESS: string;
}

interface FileMessages {
    NO_FILE: string;
    UPLOADED: string;
    DELETED: string;
    RENAMED: string;
}

interface Config {
    messages: {
        login: LoginMessages;
        files: FileMessages;
    },
    credentials: {
        PASSWORD_HASH: string;
    },
    user: {
        COOKIE_NAME: string;
    }
}

const config: Config = {
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
        PASSWORD_HASH: crypto.createHash("sha512").update(process.env.USR + "").update(process.env.RND + "").digest("hex")
    },
    user: {
        COOKIE_NAME: "user"
    }
}

export default config;