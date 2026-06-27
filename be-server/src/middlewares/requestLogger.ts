import { Request, Response, NextFunction } from 'express';

const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  // Log incoming request
  console.log('\n─────────────────────────────────────────');
  console.log(`[REQUEST]  ${req.method} ${req.originalUrl}`);

  if (Object.keys(req.body).length > 0) {
    // Mask sensitive fields before logging
    const safeBody = { ...req.body };
    if (safeBody.password) safeBody.password = '***';
    if (safeBody.confirmPassword) safeBody.confirmPassword = '***';
    if (safeBody.newPassword) safeBody.newPassword = '***';
    console.log('[PAYLOAD] ', JSON.stringify(safeBody, null, 2));
  }

  if (Object.keys(req.params).length > 0) {
    console.log('[PARAMS]  ', req.params);
  }

  if (Object.keys(req.query).length > 0) {
    console.log('[QUERY]   ', req.query);
  }

  // Intercept res.json to log the response
  const originalJson = res.json.bind(res);
  res.json = (body: unknown) => {
    const duration = Date.now() - start;
    console.log(`[RESPONSE] ${res.statusCode} (${duration}ms)`);
    console.log('[BODY]    ', JSON.stringify(body, null, 2));
    console.log('─────────────────────────────────────────\n');
    return originalJson(body);
  };

  next();
};

export default requestLogger;
