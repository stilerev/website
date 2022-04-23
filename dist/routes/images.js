"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeAllImages = void 0;
var express_1 = require("express");
var awsfiles_1 = require("../services/awsfiles");
var httpres_1 = require("../services/httpres");
var s3_1 = require("../services/s3");
var fs_1 = __importDefault(require("fs"));
var auth_1 = __importDefault(require("../middleware/auth"));
var path = require("path");
var multer = require("multer");
var config_1 = __importDefault(require("../config"));
var upload = multer({
    dest: "uploads/"
});
var router = express_1.Router();
router.get("/image/:name", function (req, res) {
    var readStream = awsfiles_1.getFileStream(req.params.name);
    res.setHeader("Cache-Control", "max-age=" + 365 * 24 * 60 * 60);
    res.removeHeader("Pragma");
    res.removeHeader("Expires");
    readStream.pipe(res);
});
router.patch("/image/:name", auth_1.default, function (req, res) {
    s3_1.editFile(res, req.params.name, {
        name: req.body.newname,
        visible: req.body.visible
    });
});
router.post("/image/:name", auth_1.default, upload.single("image"), function (req, res) {
    var nameOfUpload = req.params.name.toLowerCase();
    if (!req.file) {
        httpres_1.sendResponse({
            message: config_1.default.messages.files.NO_FILE,
            status: 400
        }, res);
        return;
    }
    //rename file for s3 upload.
    if (req.params.name) {
        nameOfUpload = req.params.name;
        if (!path.extname(nameOfUpload)) {
            nameOfUpload += path.extname(req.file.originalname);
        }
    }
    else {
        nameOfUpload = req.file.originalname;
    }
    s3_1.uploadFile(req, res, nameOfUpload).promise().then(function (val) {
        if (val) {
            fs_1.default.unlinkSync(req.file.path);
            httpres_1.sendResponse({
                message: config_1.default.messages.files.UPLOADED.replace("%file%", val.Key),
                status: 201
            }, res);
        }
    });
});
router.delete("/image/:name", auth_1.default, function (req, res) {
    s3_1.deleteFile(res, req.params.name).promise().then(function () {
        httpres_1.sendResponse({
            message: config_1.default.messages.files.DELETED.replace("%file%", req.params.name.toLowerCase()),
            status: 200
        }, res);
    });
});
var arr = [];
function storeAllImages() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            arr = [];
            return [2 /*return*/, awsfiles_1.getFiles().then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                    var i, val;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log("RES STORE IMAGE: " + res);
                                i = 0;
                                _a.label = 1;
                            case 1:
                                if (!(i < res.KeyCount)) return [3 /*break*/, 4];
                                return [4 /*yield*/, awsfiles_1.getMetadata(res.Contents[i].Key)];
                            case 2:
                                val = _a.sent();
                                arr.push({
                                    name: res.Contents[i].Key,
                                    visible: (val.Metadata.visible === "true")
                                });
                                _a.label = 3;
                            case 3:
                                i++;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/, arr];
                        }
                    });
                }); }).catch(function (err) {
                    console.log("ERRORR: " + err);
                })];
        });
    });
}
exports.storeAllImages = storeAllImages;
exports.default = router;
