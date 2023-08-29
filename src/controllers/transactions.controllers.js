import Joi from 'joi';
import { db } from '../database/database.connection.js';
import { transactionSchema } from '../Schemas/transactions.schemas.js';
import dayjs from 'dayjs';

export async function addTransaction(req, res){
    const {value, description, type} = req.body;
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")
    if (!token) return response.status(401).send("Token not sended");

    const validation = transactionSchema.validate(req.body, {abortEarly: false});
    if(validation.error) return res.status(422).send('Invalid or incorrect information');

    let transaction = {};

    try{
        const session = await db.collection('sessions').findOne({token});
        if(!session) return res.status(401).send('Invalid token');

        const user = await db.collection('users').findOne({name: session.user});
        transaction = {user: user.name, value, description, type, date: dayjs().format('DD/MM')}

        await db.collection('transactions').insertOne(transaction);
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function showTransactions(req, res){
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")
    if (!token) return res.status(401).send("Token not sended");

    try{
        const session = await db.collection('sessions').findOne({token});
        if(!session) return res.status(401).send('Invalid token');

        const user = await db.collection('users').findOne({name: session.user});

        const transactions = await db.collection('transactions').find({user: user.name}).toArray();
        res.send(transactions);
    } catch (err){
        res.status(500).send(err.message)
    }
}