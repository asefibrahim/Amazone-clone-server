const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000


// milldeWare
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5niozn3.mongodb.net/?retryWrites=true&w=majority`;

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
        const productsCollection = client.db('emaJohnDb').collection('products')

        app.post('/productsByIds', async (req, res) => {
            const ids = req.body
            const ObjectIds = ids.map(id => new ObjectId(id))
            console.log(ids);
            const query = { _id: { $in: ObjectIds } }
            const result = await productsCollection.find(query).toArray()

            res.send(result)
        })

        app.get('/products', async (req, res) => {
            console.log(req.query);
            const pageIndexNumber = parseInt(req.query.page) || 0
            const limit = parseInt(req.query.limit) || 10
            const skip = pageIndexNumber * limit

            const result = await productsCollection.find().skip(skip).limit(limit).toArray()
            res.send(result)

        })

        app.get('/productsTotal', async (req, res) => {
            const result = await productsCollection.estimatedDocumentCount()
            res.send({ totalProducts: result })
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.log);




app.get('/', (req, res) => {
    res.send('Ema is running.......')
})

app.listen(port)