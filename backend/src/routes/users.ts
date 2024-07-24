// routes/users.ts
import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/users";
import { validateBody, validateParams } from "../middleware/validate";
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
} from "../schemas/user";
import { wrapAsync } from "../utils/wrapAsync";
import { NotFoundError } from "../error/Error";

const userRouter = Router();

userRouter.get("/", wrapAsync(getUsers));

userRouter.get("/:id", validateParams(userIdSchema), wrapAsync(getUserById));

userRouter.post("/", validateBody(createUserSchema), wrapAsync(createUser));

userRouter.put(
  "/:id",
  validateParams(userIdSchema),
  validateBody(updateUserSchema),
  wrapAsync(updateUser)
);

userRouter.delete("/:id", validateParams(userIdSchema), wrapAsync(deleteUser));

// All other route requests
userRouter.all("*", (req, res, next) => {
  next(new NotFoundError("Page Not Found!"));
});

export default userRouter;
