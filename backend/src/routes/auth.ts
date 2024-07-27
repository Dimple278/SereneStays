import { Router } from "express";
import { signup, login, refresh } from "../controllers/auth";
import { validateBody } from "../middleware/validate";
import { signupSchema, loginSchema } from "../schemas/auth";
import { wrapAsync } from "../utils/wrapAsync";
import { NotFoundError } from "../error/Error";
import { upload } from "../../cloudinary";

const authRouter = Router();

authRouter.post(
  "/signup",
  upload.single("image"),
  validateBody(signupSchema),
  wrapAsync(signup)
);
authRouter.post(
  "/login",
  upload.single("image"),
  validateBody(loginSchema),
  wrapAsync(login)
);
authRouter.post("/refresh", wrapAsync(refresh));

// All other route requests
authRouter.all("*", (req, res, next) => {
  next(new NotFoundError("Page Not Found!"));
});

export default authRouter;
