import { ResponseHelper } from './response.helper';

describe('ResponseHelper', () => {
  test('success method should return a success response', () => {
    const message = 'Test success message';
    const data = { key: 'value' };

    const result = ResponseHelper.success(message, data);

    expect(result.success).toBe(true);
    expect(result.data).toBe(data);
    expect(result.message).toBe(message);
  });

  test('success method should return a success response without data', () => {
    const message = 'Test success message';

    const result = ResponseHelper.success(message);

    expect(result.success).toBe(true);
    expect(result.data).toBeUndefined();
    expect(result.message).toBe(message);
  });

  test('error method should return an error response', () => {
    const message = 'Test error message';
    const data = { key: 'value' };

    const result = ResponseHelper.error(message, data);

    expect(result.success).toBe(false);
    expect(result.data).toBe(data);
    expect(result.message).toBe(message);
  });

  test('error method should return an error response without data', () => {
    const message = 'Test error message';

    const result = ResponseHelper.error(message);

    expect(result.success).toBe(false);
    expect(result.data).toBeUndefined();
    expect(result.message).toBe(message);
  });
});
