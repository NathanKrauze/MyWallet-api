import { Router } from "express";
import { userSignUp } from "../controllers/Auth.controllers.js";

const usersRouter = Router();

usersRouter.post('/sign-up', userSignUp);

export default usersRouter;