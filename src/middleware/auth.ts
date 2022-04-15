import config from "../config";
import { NextFunction, Request, Response } from "express"

export default function (req: Request, res: Response, next: NextFunction) {

    if (config.credentials.PASSWORD_HASH !== req.cookies.usr) {
        //Cannot use sendResponse due to redirecting and sending json data at the same time.
        res.set("Content-Type", "text/html");
        return res.status(403).send("<!DOCTYPE html><html><head><meta http-equiv='refresh' content='0; url=/'></head></html>");
    }

    next();
}