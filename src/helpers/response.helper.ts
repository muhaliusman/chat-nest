export class ResponseHelper {
  static success(message: string, data?: object | object[]) {
    return {
      success: true,
      data,
      message,
    };
  }
  static error(message: string, data?: object) {
    return {
      success: false,
      data,
      message,
    };
  }
}
