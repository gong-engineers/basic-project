import { ResponseDto as SharedResponseDto } from '@basic-project/shared-types';

export class ResponseDto<T> implements SharedResponseDto<T> {
  statusCode: number;
  statusMessage: String;
  data: T;

  constructor(statusCode: number, statusMessage: String, data: T) {
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
    this.data = data;
  }

  // 성공 시 반환 형태
  static success<T>(statusMessage: String, data: T): ResponseDto<T> {
    return new ResponseDto(200, statusMessage, data);
  }

  // 실패 시 반환 형태
  static error<T>(
    statusCode: number,
    statusMessage: String,
    data: T,
  ): ResponseDto<T> {
    return new ResponseDto(statusCode, statusMessage, data);
  }
}
