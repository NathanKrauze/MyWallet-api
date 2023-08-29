import { Router } from "express";
import { logout, userLogin, userSignUp } from "../controllers/Auth.controllers.js";

const usersRouter = Router();

usersRouter.post('/sign-up', userSignUp);
usersRouter.post('/sign-in', userLogin);
usersRouter.delete('/sign-out', logout)

export default usersRouter;