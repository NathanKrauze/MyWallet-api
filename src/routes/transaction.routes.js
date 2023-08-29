import { Router } from "express";
import { addTransaction, showTransactions } from "../controllers/transactions.controllers.js";

const transactionRouter = Router();

transactionRouter.post('/add-transaction', addTransaction);
transactionRouter.get('/transactions', showTransactions);

export default transactionRouter;