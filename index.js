const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fdbahux.mongodb.net/?retryWrites=true&w=majority`;

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

    const usersCollection = client.db('bloodLinkDB').collection('users');

    app.get('/users', async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if(req.query?.email) {
        query = {email: req.query.email}
      }
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    })

    app.post('/users', async (req, res) => {
      const userData = req.body;
      const insertedData = await usersCollection.insertOne(userData);
      res.send(insertedData);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('blood is flowing');
})

app.listen(port, () => {
  console.log(`blood is flowing on port ${port}`);
})