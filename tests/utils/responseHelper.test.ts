import { successResponse, errorResponse } from '../../src/utils/responseHelper'; // Altere o caminho conforme necessário

describe('Response Functions', () => {
  describe('successResponse', () => {
    it('should return a response with default status code 200', () => {
      const data = { message: 'Success' };
      const response = successResponse(data);
      expect(response).toEqual({
        statusCode: 200,
        body: JSON.stringify(data),
      });
    });

    it('should return a response with custom status code', () => {
      const data = { message: 'Custom Status' };
      const customStatusCode = 201;
      const response = successResponse(data, customStatusCode);
      expect(response).toEqual({
        statusCode: customStatusCode,
        body: JSON.stringify(data),
      });
    });
  });

  describe('errorResponse', () => {
    it('should return a response with default status code 500', () => {
      const errorMessage = 'Internal Server Error';
      const response = errorResponse(errorMessage);
      expect(response).toEqual({
        statusCode: 500,
        body: JSON.stringify({ message: errorMessage }),
      });
    });

    it('should return a response with custom status code', () => {
      const errorMessage = 'Bad Request';
      const customStatusCode = 400;
      const response = errorResponse(errorMessage, customStatusCode);
      expect(response).toEqual({
        statusCode: customStatusCode,
        body: JSON.stringify({ message: errorMessage }),
      });
    });
  });
});
