"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
/**
 * Send a response to the client using JSON.
 * @param response
 * @param res
 */
function sendResponse(response, res) {
    res.status(response.status);
    if (response.cookie)
        res.cookie(response.cookie.key, response.cookie.value);
    res.json(response);
}
exports.sendResponse = sendResponse;
