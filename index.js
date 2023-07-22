const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const cors = require("cors");
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.mqbvthc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    client.connect();
    const toolsCollection = client.db("knitOps").collection("tools");
    const usersCollection = client.db("knitOps").collection("users");

    // root page

    app.get("/", async (req, res) => {
      res.send("server running");
    });

    app.get("/tools", async (req, res) => {
      const query = {};
      const result = await toolsCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const body = req.body;
      const result = usersCollection.insertOne(body);
      res.send(result);
    });

    app.get("/tools/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toolsCollection.findOne(query);
      res.send(result);
    });

    app.put("/upgrade/:id", async (req, res) => {
      const id = req.params.id;
      const {tool,desiredVersion} = req.body;
      const filter = {id: id}
      const query = {tech:{name:tool}}
      const userDetails = await usersCollection.findOne(filter);
      const tech = userDetails.tech.find(item=>item.name === tool);
      console.log(tech)
      const updateDoc = {
          $set: {
            name: tool,
            version: desiredVersion,
          }
      }
      // const result = await usersCollection.updateOne(filter, updateDoc);
      // res.send(result)
    });

    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { id: id };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch((error) => console.log(error));

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
