import crypto from "crypto";

interface LoginMessages {
    FAIL: string;
    SUCCESS: string;
}

interface FileMessages {
    NO_FILE: string;
    UPLOADED: string;
    DELETED: string;
}

interface Config {
    messages: {
        login: LoginMessages;
        files: FileMessages;
    },
    credentials: {
        PASSWORD_HASH: string;
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
            DELETED: "Deleted file %file%"
        }
    },
    credentials: {
        PASSWORD_HASH: crypto.createHash("sha512").update(process.env.USR + "").update(process.env.RND + "").digest("hex")
    }
}

export default config;