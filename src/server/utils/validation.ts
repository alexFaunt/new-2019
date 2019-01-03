import * as Joi from 'joi';

export const validator = (schema) => (values) => {
  const { value, error } = Joi.validate(values, schema);

  if (error) {
    throw error;
  }

  return value;
};

export default Joi;
