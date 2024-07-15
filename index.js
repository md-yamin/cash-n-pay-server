const express = require('express');
const app = express()
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

//middleware

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.brerg1p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {

        const collection = client.db("modernTable").collection("");
   
        app.get("/", async(req, res)=>{
            const result = await collection.find().toArray()
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