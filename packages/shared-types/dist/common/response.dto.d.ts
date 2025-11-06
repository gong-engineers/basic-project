export declare class ResponseDto<T> {
    statusCode: number;
    statusMessage: String;
    data: T;
    constructor(statusCode: number, statusMessage: String, data: T);
    static success<T>(statusMessage: String, data: T): ResponseDto<T>;
    static error<T>(statusCode: number, statusMessage: String, data: T): ResponseDto<T>;
}
