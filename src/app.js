import express from 'express';
import cors from 'cors';
import usersRouter from './routes/auth.routes.js';
import transactionRouter from './routes/transaction.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use(usersRouter);
app.use(transactionRouter);

const port = process.env.PORT || 5000
app.listen(port, () => {
	console.log(`Server running on port ${port}`)
});