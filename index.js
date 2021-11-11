const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;


// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.krqaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {


    try {
        await client.connect()

        const database = client.db("flashCorner");
        const productsCollection = database.collection("products");
        const usersCollection = database.collection("users")

        // add products api
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product)
            res.json(result);
        })

        // get products api
        app.get('/products', async (req, res) => {
            const result = await productsCollection.find({}).toArray()
            res.json(result)
        })

        // post api for users
        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await usersCollection.insertOne(user)
            res.send(result)
        })



        //make admin api
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            console.log(user);
            const filter = { email: user.email }
            const updateDoc = { $set: { role: 'admin' } }
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.json(result)
        })


        // admin cheking api
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query)
            let isAdmin = false
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })
        })

    }
    finally {


    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Hello from flash corner!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})