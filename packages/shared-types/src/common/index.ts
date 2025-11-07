export interface ResponseDto<T> {
  statusCode: number;
  statusMessage: string;
  data: T;
}
