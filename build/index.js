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
Object.defineProperty(exports, "__esModule", { value: true });
var axios = require("axios").default;
var fast_xml_parser_1 = __importDefault(require("fast-xml-parser"));
var html_to_text_1 = require("html-to-text");
var hidsData = require("./hids-urls");
// Get one today's history
var getEventToday = function () {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    // Change this any into appropriate type safe interface later
    return axios.post(hidsData.getEventUrl(day, month)).then(function (_a) {
        var data = _a.data;
        var descBm = data.description_bm;
        var descEn = data.description_eng;
        var new_data;
        descBm = cleanDescription(descBm);
        descEn = cleanDescription(descEn);
        new_data = __assign(__assign({}, data), { description_bm: descBm, description_eng: descEn });
        return new_data;
    });
};
var getAllEventsToday = function () { return __awaiter(void 0, void 0, void 0, function () {
    var date, day, month, currentPage, lastPage, lastNumber, dataList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                date = new Date();
                day = date.getDate();
                month = date.getMonth() + 1;
                currentPage = 1;
                lastPage = 1;
                lastNumber = 0;
                dataList = [];
                // Get first page
                // Change this any into appropriate type safe interface later
                return [4 /*yield*/, axios
                        .post(hidsData.getAllEventsUrl(day, month, currentPage))
                        .then(function (_a) {
                        var res = _a.data;
                        dataList = __spreadArray([], res.data);
                        lastPage = res.last_page;
                        lastNumber = res.data[res.data.length - 1]["no"];
                        currentPage++;
                    })
                        .catch(function (err) { return console.error(err); })];
            case 1:
                // Get first page
                // Change this any into appropriate type safe interface later
                _a.sent();
                _a.label = 2;
            case 2:
                if (!(currentPage <= lastPage)) return [3 /*break*/, 5];
                // Change this any into appropriate type safe interface later
                return [4 /*yield*/, axios
                        .post(hidsData.getAllEventsUrl(day, month, currentPage))
                        .then(function (_a) {
                        var res = _a.data;
                        res = res.data.map(function (data) { return (__assign(__assign({}, data), { no: ++lastNumber })); });
                        dataList = __spreadArray(__spreadArray([], dataList), res);
                    })
                        .catch(function (err) { return console.error(err); })];
            case 3:
                // Change this any into appropriate type safe interface later
                _a.sent();
                _a.label = 4;
            case 4:
                currentPage++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, new Promise(function (resolve, reject) {
                    if (dataList)
                        resolve(dataList);
                    reject("Cannot fetch data");
                })];
        }
    });
}); };
// Change this any into appropriate type safe interface later
var cleanDescription = function (desc) {
    // Description does not exists
    if (!desc)
        return;
    // Check for dynamic-content
    if (desc.match(/^<dynamic-content/g)) {
        desc += "]]>";
        var options = {
            cdataTagname: "__cdata",
        };
        // @ts-ignore
        desc = fast_xml_parser_1.default.convertToJson(fast_xml_parser_1.default.getTraversalObj(desc, options), options)["dynamic-content"];
    }
    desc = html_to_text_1.htmlToText(desc, { wordwrap: false }).trim();
    return desc;
};
module.exports = { getEventToday: getEventToday, getAllEventsToday: getAllEventsToday };
