"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cacher = void 0;
var Cacher = /** @class */ (function () {
    /**
     *
     * @param duration the duration to store the cache in seconds.
     */
    function Cacher(duration) {
        this.cached = {
            duration: -1,
            expiredTime: -1,
            data: null
        };
        this.cached.duration = duration;
        this.cached.expiredTime = Date.now() + (duration * 1000);
    }
    Cacher.prototype.cache = function (data, cb) {
        if (this.isCached()) {
            console.log("is cached");
            cb(data);
            return;
        }
        console.log("recaching");
        this.cached.data = data;
        this.cached.expiredTime = Date.now() + (this.cached.duration * 1000);
        cb(data);
        return;
    };
    Cacher.prototype.isCached = function () {
        return Date.now() <= this.cached.expiredTime;
    };
    return Cacher;
}());
exports.Cacher = Cacher;
