import { RequestHandler } from 'express';

// Wrap an async handler so thrown errors are forwarded to express error middleware
export const wrap = (fn: (req: any, res: any, next?: any) => Promise<any>): RequestHandler => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default wrap;
