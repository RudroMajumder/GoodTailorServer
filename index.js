const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;

const app = express()
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h5fiw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db("goodTailor").collection("services");
  const adminsCollection = client.db("goodTailor").collection("admins");
  const appointmentsCollection = client.db("goodTailor").collection("appointments");
  const reviewsCollection = client.db("goodTailor").collection("reviews");
  
  console.log("COnnected");

  app.post('/addService',(req,res)=>{
    const service = req.body;
    console.log(service);
    servicesCollection.insertOne(service)
    .then( result =>{
      console.log(result);
      res.send(result.insertedCount>0);
    })
  })

  app.get('/services',(req,res)=>{
    servicesCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

  app.post('/addAdmin',(req,res)=>{
    const email = req.body;
    console.log(email);
    adminsCollection.insertOne(email)
    .then(result =>{
      console.log(result);
      res.send(result.insertedCount>0);
    })
  })

  app.post('/addAppointment',(req,res)=>{
    const appointmentData = req.body;
    appointmentsCollection.insertOne(appointmentData)
    .then(result =>{
      console.log(result);
      res.send(result.insertedCount>0);
    })
  })

  app.delete('/delete/:id',(req,res)=>{
    console.log(req.params.id)
    servicesCollection.deleteOne({_id:ObjectID(req.params.id)})
    .then( (result)=>{
      console.log(result)
      res.redirect(req.originalUrl)
    })
  })

  app.post('/addReview',(req,res)=>{
    const review = req.body;
    console.log(review)
    reviewsCollection.insertOne(review)
    .then( result =>{
      console.log(result);
      res.send(result.insertedCount>0)
    })
  })

  app.get('/reviews',(req,res)=>{
    reviewsCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
