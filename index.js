const express = require('express');
const app = express()
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

//middleware

app.use(cors({
    origin: ['http://localhost:5173','https://cash-n-pay.web.app'],
    credentials: true
}))
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.brerg1p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {

        const usersCollection = client.db("cashNPay").collection("users");
        const transactionsCollection = client.db("cashNPay").collection("transactions");



        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.TOKEN_SECRET, {
                expiresIn: '3h'
            })
            res.send({ token })
        })

        app.get('/history', async (req, res) => {
            const result = await transactionsCollection.find().toArray()
            res.send(result)
        })

        app.get('/history/:id', async (req, res) => {
            const id = req.params.id;
            const query = {user: id}
            const result = await transactionsCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray()
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const cursor = req.body;
            const result = await usersCollection.insertOne(cursor)
            res.send(result)
        })

        app.post('/history', async (req, res) => {
            const cursor = req.body;
            const result = await transactionsCollection.insertOne(cursor)
            res.send(result)
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const result = await usersCollection.findOne(query)
            res.send(result)
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await usersCollection.deleteOne(query)
            res.send(result)
        })


    } finally {
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is running properly, no issues here')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})