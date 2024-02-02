import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export interface ResponseObject {
  success: boolean;
  message: string;
  data?: object | object[];
}

export class ResponseHelper {
  static success(message: string, data?: object | object[]): ResponseObject {
    return {
      success: true,
      data,
      message,
    };
  }

  static error(res: Response, error: unknown): ResponseObject {
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
