import Joi from "joi";

export const userSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().required(),
    image: Joi.string().allow("", null),
});
