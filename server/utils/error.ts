export const errorHandler = (statusCode: number, message: any): Error => {
  const error = new Error();
  (error as any).statusCode = statusCode;
  (error as any).message = message;
  return error;
};
