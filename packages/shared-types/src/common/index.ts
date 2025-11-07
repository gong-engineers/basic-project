export interface ResponseDto<T> {
  statusCode: number;
  statusMessage: String;
  data: T;
}
