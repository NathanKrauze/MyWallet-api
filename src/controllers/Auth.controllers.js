import bcrypt from 'bcrypt';
import { db } from '../app.js';
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
        
		await db.collection("sessions").insertOne({userId: user._id,token})
        res.status(200).send(token);
    } catch (err){
        res.status(500).send(err.message)
    }
}