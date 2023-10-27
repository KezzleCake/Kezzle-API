"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.__esModule = true;
exports.CurationService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("@nestjs/mongoose");
var curation_schema_1 = require("./entities/curation.schema");
var response_curation_dto_1 = require("./dto/response-curation.dto");
var response_curations_dto_1 = require("./dto/response-curations.dto");
var response_home_curation_dto_1 = require("./dto/response-home-curation.dto");
var curation_not_found_exception_1 = require("./exceptions/curation-not-found.exception");
var response_curation_cake_dto_1 = require("./dto/response-curation-cake.dto");
var response_cake_dto_1 = require("src/cake/dto/response-cake.dto");
var CurationService = /** @class */ (function () {
    function CurationService(curationModel, httpService, cakeService, anniversaryService) {
        this.curationModel = curationModel;
        this.httpService = httpService;
        this.cakeService = cakeService;
        this.anniversaryService = anniversaryService;
    }
    CurationService.prototype.createCuration = function (keyword, disc, note) {
        return __awaiter(this, void 0, void 0, function () {
            var apiUrl, response, cakes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apiUrl = "https://api.kezzlecake.com/clip/cakes/ko-search?keyword=" + keyword + "&size=10";
                        return [4 /*yield*/, this.httpService.get(apiUrl).toPromise()];
                    case 1:
                        response = _a.sent();
                        cakes = response.data.result;
                        return [4 /*yield*/, this.curationModel.create({
                                cakes: cakes,
                                description: disc,
                                key: keyword,
                                note: note
                            })];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CurationService.prototype.homeCuration = function (after, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var ments, result, _i, ments_1, ment, tmps, Response, ann, pop;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ments = ['상황별 BEST', '받는 사람들을 위한 케이크'];
                        result = [];
                        _i = 0, ments_1 = ments;
                        _a.label = 1;
                    case 1:
                        if (!(_i < ments_1.length)) return [3 /*break*/, 5];
                        ment = ments_1[_i];
                        return [4 /*yield*/, this.curationModel.find({ note: ment })];
                    case 2:
                        tmps = _a.sent();
                        return [4 /*yield*/, tmps.map(function (tmp) { return new response_curation_dto_1.CurationDto(tmp); })];
                    case 3:
                        Response = _a.sent();
                        result.push(new response_curations_dto_1.CurationsDto(Response, ment));
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [4 /*yield*/, this.anniversaryService.getAnniversary()];
                    case 6:
                        ann = _a.sent();
                        return [4 /*yield*/, this.cakeService.popular(after, limit)];
                    case 7:
                        pop = _a.sent();
                        return [2 /*return*/, new response_home_curation_dto_1.HomeCurationDto(result, ann, pop)];
                }
            });
        });
    };
    CurationService.prototype.showCuration = function (curationId, user) {
        return __awaiter(this, void 0, void 0, function () {
            var curation, Response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.curationModel.findById(curationId)["catch"](function () {
                            throw new curation_not_found_exception_1.CurationNotFoundException(curationId);
                        })];
                    case 1:
                        curation = _a.sent();
                        return [4 /*yield*/, curation.cakes.map(function (cake) { return new response_cake_dto_1.CakeResponseDto(cake, user.firebaseUid); })];
                    case 2:
                        Response = _a.sent();
                        return [2 /*return*/, new response_curation_cake_dto_1.CurationCakeResponsDto(curation.description, Response)];
                }
            });
        });
    };
    CurationService = __decorate([
        common_1.Injectable(),
        __param(0, mongoose_1.InjectModel(curation_schema_1.Curation.name, 'kezzle'))
    ], CurationService);
    return CurationService;
}());
exports.CurationService = CurationService;
