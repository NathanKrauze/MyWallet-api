import { Router } from "express";
import { userLogin, userSignUp } from "../controllers/Auth.controllers.js";

const usersRouter = Router();

usersRouter.post('/sign-up', userSignUp);
usersRouter.post('/sign-in', userLogin);

export default usersRouter;