import bcrypt from 'bcrypt';
import { db } from '../database/database.connection.js';
import { v4 as uuid} from 'uuid';
import { signUpSchema, loginSchema } from '../Schemas/users.schemas.js';

export async function userSignUp (req, res){
    const {name, email, password} = req.body;

    const validation = signUpSchema.validate(req.body, {abortEarly: false});
    if(validation.error) return res.status(422).send('Invalid or incorrect information');

    const hash = bcrypt.hashSync(password, 10)


    try {
        const user = await db.collection('users').findOne({ email })
        if (user) return res.status(409).send("E-mail already registered")

        await db.collection('users').insertOne({ name, email, password: hash })
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function userLogin (req, res){
    const { email, password } = req.body;

    const validation = loginSchema.validate(req.body, {abortEarly: false});
    if(validation.error) return res.status(422).send('Invalid or incorrect information');

    try{
        const user = await db.collection('users').findOne({ email });
        if(!user) return res.status(404).send('unregistered email');
        
        const passwordRight = user && bcrypt.compareSync(password, user.password);
        if(!passwordRight) res.status(401).send('incorrect password');

        const token = uuid();

        const session = {user: user.name, token}
        
		await db.collection("sessions").insertOne(session)
        res.status(200).send(session);
    } catch (err){
        res.status(500).send(err.message)
    }
}

export async function logout(req, res){
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")
    if (!token) return res.status(401).send("Token not sended");

    try{
        const session = await db.collection('sessions').findOne({token});
        if(!session) return res.status(401).send('Invalid token');

        await db.collection('sessions').deleteOne({token});
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}