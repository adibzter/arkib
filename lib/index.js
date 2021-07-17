"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var fs_1 = __importDefault(require("fs"));
var axios_1 = __importDefault(require("axios"));
var fast_xml_parser_1 = __importDefault(require("fast-xml-parser"));
var html_to_text_1 = require("html-to-text");
var hids_urls_1 = __importDefault(require("./hids-urls"));
var date = new Date();
var HOST = 'https://hids.arkib.gov.my';
// Get one history of specified date
var getEventByDate = function (day, month) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, getEvent(day, month)];
    });
}); };
// Get one today's history
var getEventToday = function () { return __awaiter(void 0, void 0, void 0, function () {
    var day, month;
    return __generator(this, function (_a) {
        day = date.getDate();
        month = date.getMonth() + 1;
        return [2 /*return*/, getEvent(day, month)];
    });
}); };
// Get one history
var getEvent = function (day, month) { return __awaiter(void 0, void 0, void 0, function () {
    var data, new_data, descBm, descEn, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.post(hids_urls_1.default.getEventUrl(day, month))];
            case 1:
                data = (_a.sent()).data;
                new_data = void 0;
                descBm = data.description_bm;
                descEn = data.description_eng;
                descBm = cleanDescription(descBm);
                descEn = cleanDescription(descEn);
                new_data = __assign(__assign({}, data), { description_bm: descBm, description_eng: descEn });
                return [2 /*return*/, new_data];
            case 2:
                err_1 = _a.sent();
                throw 'Cannot fetch data';
            case 3: return [2 /*return*/];
        }
    });
}); };
var getAllEventsByDate = function (day, month) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, getAllEvents(day, month)];
    });
}); };
var getAllEventsToday = function () { return __awaiter(void 0, void 0, void 0, function () {
    var day, month;
    return __generator(this, function (_a) {
        day = date.getDate();
        month = date.getMonth() + 1;
        return [2 /*return*/, getAllEvents(day, month)];
    });
}); };
var getAllEvents = function (day, month) { return __awaiter(void 0, void 0, void 0, function () {
    var currentPage, lastPage, lastNumber, dataList, pages, results, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                currentPage = 1;
                lastPage = 1;
                lastNumber = 0;
                dataList = [];
                // Get first page
                // Change this any into appropriate type safe interface later
                return [4 /*yield*/, axios_1.default
                        .post(hids_urls_1.default.getAllEventsUrl(day, month, currentPage))
                        .then(function (_a) {
                        var res = _a.data;
                        dataList = __spreadArray([], res.data);
                        lastPage = res.last_page;
                        lastNumber = res.data[res.data.length - 1]['no'];
                        currentPage++;
                    })];
            case 1:
                // Get first page
                // Change this any into appropriate type safe interface later
                _a.sent();
                pages = [];
                while (currentPage <= lastPage) {
                    // Change this any into appropriate type safe interface later
                    pages.push(axios_1.default.post(hids_urls_1.default.getAllEventsUrl(day, month, currentPage)));
                    currentPage++;
                }
                results = [];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, Promise.all(pages)];
            case 3:
                results = _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_2 = _a.sent();
                throw 'Cannot fetch data';
            case 5:
                results.map(function (_a) {
                    var data = _a.data;
                    data = data.data;
                    // @ts-ignore
                    data.map(function (el) { return dataList.push(__assign(__assign({}, el), { no: ++lastNumber })); });
                });
                return [2 /*return*/, dataList];
        }
    });
}); };
var getVideoDetails = function (id, language, options) { return __awaiter(void 0, void 0, void 0, function () {
    var data, new_data, descBm, descEn, ids, id_1, res, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, axios_1.default.post(hids_urls_1.default.getVideoDetailsUrl(id, language))];
            case 1:
                data = (_a.sent()).data;
                new_data = void 0;
                descBm = data.description_bm;
                descEn = data.description_eng;
                descBm = cleanDescription(descBm);
                descEn = cleanDescription(descEn);
                new_data = __assign(__assign({}, data), { url: data.fullvideo.url, description_bm: descBm, description_eng: descEn, lkp_era: {
                        thumbnail: "" + HOST + data.lkp_era.thumbnail,
                    } });
                if (!options) return [3 /*break*/, 3];
                ids = new_data.url.split('/');
                id_1 = +ids[ids.length - 1];
                return [4 /*yield*/, downloadVideo(id_1, options.savePath, options.fileName)];
            case 2:
                res = _a.sent();
                console.log(res);
                _a.label = 3;
            case 3: return [2 /*return*/, new_data];
            case 4:
                err_3 = _a.sent();
                throw 'Cannot fetch data';
            case 5: return [2 /*return*/];
        }
    });
}); };
// Download Video
var downloadVideo = function (id, savePath, fileName) {
    if (savePath === void 0) { savePath = '.'; }
    if (fileName === void 0) { fileName = id.toString(); }
    return __awaiter(void 0, void 0, void 0, function () {
        var res, writeStream_1, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    savePath = savePath + "/" + fileName + ".mp4";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, axios_1.default.get(hids_urls_1.default.getSampleVideoUrl(id), {
                            responseType: 'stream',
                        })];
                case 2:
                    res = _a.sent();
                    // Video not exists
                    if (!res)
                        throw 'Video not exists';
                    writeStream_1 = fs_1.default.createWriteStream(savePath);
                    // Piping data into file
                    res.data.pipe(writeStream_1);
                    return [4 /*yield*/, new Promise(function (resolve) {
                            writeStream_1
                                .on('ready', function () { return console.log('Download Started...'); })
                                .on('error', function (err) {
                                throw err;
                            })
                                .on('finish', function () {
                                console.log('Download Finished');
                                console.log("File location: " + savePath);
                                resolve(savePath);
                            });
                        })];
                case 3:
                    // Wait until finish piping
                    savePath = _a.sent();
                    return [2 /*return*/, savePath];
                case 4:
                    err_4 = _a.sent();
                    throw 'Failed to download video';
                case 5: return [2 /*return*/];
            }
        });
    });
};
var cleanDescription = function (desc) {
    // Description does not exists
    if (!desc)
        return;
    // Check for dynamic-content
    if (desc.match(/^<dynamic-content/g)) {
        desc += ']]>';
        var options = {
            cdataTagname: '__cdata',
        };
        // @ts-ignore
        desc = fast_xml_parser_1.default.convertToJson(fast_xml_parser_1.default.getTraversalObj(desc, options), options)['dynamic-content'];
    }
    desc = html_to_text_1.htmlToText(desc, { wordwrap: false }).trim();
    return desc;
};
module.exports = {
    getEventToday: getEventToday,
    getAllEventsToday: getAllEventsToday,
    getEventByDate: getEventByDate,
    getAllEventsByDate: getAllEventsByDate,
    getVideoDetails: getVideoDetails,
    downloadVideo: downloadVideo,
};
