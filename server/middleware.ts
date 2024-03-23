import { Request, Response, NextFunction } from "express";
import { userSchema } from "./schemas";
import ExpressError from "./utils/ExpressError";

export const validateRegister = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};