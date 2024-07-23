import { Router } from "express";
import { signup, login, refresh } from "../controllers/auth";
import { validateBody } from "../middleware/validate";
import { signupSchema, loginSchema } from "../schemas/auth";
import { wrapAsync } from "../utils/wrapAsync";
import ExpressError from "../utils/ExpressError";

const authRouter = Router();

authRouter.post("/signup", validateBody(signupSchema), wrapAsync(signup));
authRouter.post("/login", validateBody(loginSchema), wrapAsync(login));
authRouter.post("/refresh", wrapAsync(refresh));

// All other route requests
authRouter.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

export default authRouter;
