"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP = void 0;
var events_1 = require("events");
var app_checker_1 = require("./app-checker");
var pixel_nethub_options_1 = require("pixel-nethub-options");
var path = require("path");
var APP = /** @class */ (function (_super) {
    __extends(APP, _super);
    function APP(appPath) {
        var _this = _super.call(this) || this;
        _this.appPath = appPath;
        _this.running = false;
        return _this;
    }
    APP.prototype.validateStructureApp = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, app_checker_1.checkApp)(this.appPath)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    APP.prototype.validateOptionsApp = function (option, typeManager) {
        return __awaiter(this, void 0, void 0, function () {
            var optionSchema, optionsValidator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!option) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.getOptionSchema()];
                    case 1:
                        optionSchema = _a.sent();
                        optionsValidator = new pixel_nethub_options_1.OptionValidator(option, optionSchema, typeManager);
                        return [4 /*yield*/, optionsValidator.validate()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    APP.prototype.getOptionSchema = function () {
        return __awaiter(this, void 0, void 0, function () {
            var optionsPath, optionSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        optionsPath = path.join(this.appPath, 'options.json');
                        return [4 /*yield*/, Promise.resolve("".concat(optionsPath)).then(function (s) { return require(s); })];
                    case 1:
                        optionSchema = _a.sent();
                        return [2 /*return*/, optionSchema];
                }
            });
        });
    };
    APP.prototype.loadApp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var app;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve("".concat(path.resolve(this.appPath))).then(function (s) { return require(s); })];
                    case 1:
                        app = _a.sent();
                        if (app && !app.start && app.default) {
                            this.appImported = app.default;
                        }
                        else {
                            this.appImported = app;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    APP.prototype.start = function (context) {
        var _a;
        if (this.running === true) {
            return;
        }
        this.running = true;
        (_a = this.appImported) === null || _a === void 0 ? void 0 : _a.start(context);
    };
    APP.prototype.stop = function () {
        var _a;
        if (this.running === false) {
            return;
        }
        this.running = false;
        (_a = this.appImported) === null || _a === void 0 ? void 0 : _a.stop();
    };
    return APP;
}(events_1.EventEmitter));
exports.APP = APP;
