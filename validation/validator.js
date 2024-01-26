function checkBody(schema) {
  return (req, res, next) => {
    const validation = schema.validate(req.body);
    if (validation.error) {
      return res.status(400).send({ error: validation.error.details });
    }
    next();
  };
}

function checkParams(schema) {
  return (req, res, next) => {
    const validation = schema.validate(req.params);
    if (validation.error) {
      return res.status(400).send({ error: validation.error.details });
    }
    next();
  };
}

module.exports = { checkBody, checkParams };
