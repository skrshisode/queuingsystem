'use strict';
/**
 * Middlewares util
 */
module.exports = (middlewares) => {
  return (req, res, next) => {
    const stack = [];
    for (let i = middlewares.length; i--; i > 0) {
      const middleware = middlewares[i];
      if (i === 0) {
        middleware(req, res, stack[stack.length - i - 1]);
      }
      else if (i === middlewares.length - 1) {
        stack.push(
        () => {
          middleware(req, res, next);
        }
      );
      }
      else {
        stack.push(
        () => {
          middleware(req, res, stack[stack.length - i - 1]);
        }
      );
      }
    }
  };
};
