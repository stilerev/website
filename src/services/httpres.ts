import express = require("express");

export interface Cookie {
    key: string;
    value: string;
}

export interface HttpResponseMessage {
    message: string;
    status: number;
    redirect?: string;
    cookie?: Cookie;
}

/**
 * Send a response to the client using JSON.
 * @param response
 * @param res
 */
export function sendResponse(response: HttpResponseMessage, res: express.Response) {
    res.status(response.status);
    if (response.cookie) res.cookie(response.cookie.key, response.cookie.value);
    res.json(response);
}
