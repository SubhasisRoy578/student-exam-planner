// Generic request-body validator. Takes a Zod schema and returns
// Express middleware that validates req.body, replacing it with the
// parsed (and coerced/defaulted) result on success.

export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return res.status(400).json({ message: 'Validation failed', errors: details });
    }

    req.body = result.data;
    next();
  };
}