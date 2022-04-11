import crypto from "crypto";
import { NextFunction, Request, Response } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
    const hash = crypto.createHash("sha512").update(process.env.USR + "").update(process.env.RND + "").digest("hex");

    if (hash !== req.cookies.usr) {
        //Cannot use sendResponse due to redirecting and sending json data at the same time.
        res.set("Content-Type", "text/html");
        return res.status(403).send("<!DOCTYPE html><html><head><meta http-equiv='refresh' content='0; url=/'></head></html>");
    }

    next();
}