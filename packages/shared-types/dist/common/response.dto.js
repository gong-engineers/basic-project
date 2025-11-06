"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseDto = void 0;
class ResponseDto {
    statusCode;
    statusMessage;
    data;
    constructor(statusCode, statusMessage, data) {
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.data = data;
    }
    // 성공 시 반환 형태
    static success(statusMessage, data) {
        return new ResponseDto(200, statusMessage, data);
    }
    // 실패 시 반환 형태
    static error(statusCode, statusMessage, data) {
        return new ResponseDto(statusCode, statusMessage, data);
    }
}
exports.ResponseDto = ResponseDto;
