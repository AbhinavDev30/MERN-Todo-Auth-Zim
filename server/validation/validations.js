import Joi from "@hapi/joi";

const validationSchema = Joi.object({
  title: Joi.string().required().min(6).max(15), // Changed from .email() to simple string
});

export default validationSchema;
