import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from "mongodb";
import joi from 'joi';
import bcrypt from 'bcrypt';
import usersRouter from './routes/auth.routes.js';

dotenv.config()

const mongoClient = new MongoClient(process.env.DATABASE_URL);
export let db;
mongoClient.connect()
    .then(() => db = mongoClient.db())
    .catch((err) => console.log(err.message));


const app = express();
app.use(cors());
app.use(express.json())

app.use(usersRouter)

const port = process.env.PORT || 5000
app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})