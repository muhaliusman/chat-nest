import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export class ResponseHelper {
  static success(message: string, data?: object | object[]) {
    return {
      success: true,
      data,
      message,
    };
  }
  static error(res: Response, error: unknown) {
    res.status(
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR,
    );

    const message =
      error instanceof Error ? error.message : 'An error occurred';

    return {
      success: false,
      message,
    };
  }
}
