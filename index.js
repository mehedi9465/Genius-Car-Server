const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId; 

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u8ama.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("Mechanices");
      const ServiceCollection = database.collection("Services");

    //   API POST
      app.post('/services', async(req, res) => {
          const service = req.body;
          const result = await ServiceCollection.insertOne(service);
          res.send(result);
      })

    // Get All Service
      app.get('/services', async(req, res) => {
        const data = ServiceCollection.find({});
        const result = await data.toArray();
        res.send(result)
      })

    // Get Single Service
    app.get('/services/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await ServiceCollection.findOne(query);
      res.send(result)
    })

    // Delete API
    app.delete('/services/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ServiceCollection.deleteOne(query);
      res.send(result);
    })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

  app.get('/', (req, res) => {
      res.send('Crud is on');
  })

  app.listen(port, () => {
      console.log('Listening to', port);
  })