export class Responses {
  private status_code: number;
  private message: string;
  public result: any;
  public is_success: boolean;

  constructor(
    status_code: number,
    result: any,
    message: string,
    is_success: boolean,
  ) {
    this.status_code = status_code;
    this.result = result;
    this.message = message;
    this.is_success = is_success;
  }

  static sendResponse(
    statusCode: number,
    result: any,
    message: string,
    isSuccess: boolean,
  ) {
    return {
      statusCode,
      result,
      message,
      isSuccess,
    };
  }
}
