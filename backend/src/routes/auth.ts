import { Router } from "express";
import { signup, login, refresh } from "../controllers/auth";
import { validateBody } from "../middleware/validate";
import { signupSchema, loginSchema } from "../schemas/auth";
import { wrapAsync } from "../utils/wrapAsync";
import { upload } from "../../cloudinary";
import { createUser } from "../controllers/users";
import { NotFoundError } from "../error/NotFoundError";

const authRouter = Router();

authRouter.post(
  "/signup",
  upload.single("image"),
  validateBody(signupSchema),
  wrapAsync(createUser)
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
