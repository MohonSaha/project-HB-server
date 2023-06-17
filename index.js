require("dotenv").config();
const cors = require('cors');
const express = require('express');
const app = express()

const port = process.env.PORT || 5000;

// Middleware
app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.grqmol8.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const usersCollection = client.db("hotel-booking").collection("users");
    const hotelsCollection = client.db("hotel-booking").collection("hotels");



    app.get('/users/owner/:email', async (req, res) => {
        const email = req.params.email;

        const query = { email: email }
        const user = await usersCollection.findOne(query);
        const result = { owner: user?.role === 'owner' };
        res.send(result);
    })


    app.post('/usersOwner', async (req, res) => {
        const user = req.body;
        const { name, email, image } = user;
        const newUserData = { name, email, image, role: "owner" };
        console.log(newUserData);

        const query = { email: user.email };
        const existingUser = await usersCollection.findOne(query);
        if (existingUser) {
            return res.send({ message: "User Already Exist" })
        }

        const result = await usersCollection.insertOne(newUserData);
        res.send(result);
    })


    app.post('/users', async (req, res) => {
        const user = req.body;
        const { name, email, image } = user;
        const newUserData = { name, email, image, role: "user" };
        console.log(newUserData);

        const query = { email: user.email };
        const existingUser = await usersCollection.findOne(query);
        if (existingUser) {
            return res.send({ message: "User Already Exist" })
        }

        const result = await usersCollection.insertOne(newUserData);
        res.send(result);
    })





    // Hotel related APIs

    // Create or add or insert new hotel data:- 
    app.post('/addHotels', async (req, res) => {
        const newHotel = req.body;
        const result = await hotelsCollection.insertOne(newHotel)
        res.send(result)
    })









    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) => res.send('StellarStay is running'))

app.listen(port, () => console.log(`StellarStay is running on: ${port}`))
