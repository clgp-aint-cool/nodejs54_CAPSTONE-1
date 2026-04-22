export const logApi = (tag) => {
  return (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${tag}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    });

    next();
  };
};
