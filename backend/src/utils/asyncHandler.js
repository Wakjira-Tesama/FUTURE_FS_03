export function asyncHandler(fn) {
  return function asyncWrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
