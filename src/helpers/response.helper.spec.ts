import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ResponseHelper } from './response.helper';

describe('ResponseHelper', () => {
  describe('success method', () => {
    it('should return a success response with message and data', () => {
      const message = 'Success message';
      const data = { key: 'value' };

      const result = ResponseHelper.success(message, data);

      expect(result).toEqual({
        success: true,
        data,
        message,
      });
    });

    it('should return a success response with only message if no data provided', () => {
      const message = 'Success message';

      const result = ResponseHelper.success(message);

      expect(result).toEqual({
        success: true,
        message,
      });
    });
  });

  describe('error method', () => {
    it('should return an error response with status and message from HttpException', () => {
      const res: Partial<Response> = { status: jest.fn() };
      const status = HttpStatus.BAD_REQUEST;
      const error = new HttpException('Error message', status);

      const result = ResponseHelper.error(res as Response, error);

      expect(res.status).toHaveBeenCalledWith(status);
      expect(result).toEqual({
        success: false,
        message: 'Error message',
      });
    });

    it('should return an error response with status 500 and default message if not HttpException', () => {
      const res: Partial<Response> = { status: jest.fn() };
      const error = new Error('Generic error');

      const result = ResponseHelper.error(res as Response, error);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result).toEqual({
        success: false,
        message: error.message,
      });
    });
  });
});
