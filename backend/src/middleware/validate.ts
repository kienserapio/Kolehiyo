import { RequestHandler } from 'express';
import { ZodObject, z } from 'zod';
import { ValidationError } from '../utils/error';

// Generic validator for request body/params/query using zod
export const validateBody = (schema: ZodObject<any>): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issues = result.error.format();
      return next(new ValidationError('Invalid request body', issues));
    }
    // replace body with parsed data
    req.body = result.data;
    next();
  };
};

export const validateParams = (schema: ZodObject<any>): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      const issues = result.error.format();
      return next(new ValidationError('Invalid request params', issues));
    }
    req.params = result.data as any;
    next();
  };
};

export const validateQuery = (schema: ZodObject<any>): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const issues = result.error.format();
      return next(new ValidationError('Invalid query params', issues));
    }
    req.query = result.data as any;
    next();
  };
};

export default { validateBody, validateParams, validateQuery };
