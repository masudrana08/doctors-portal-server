const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))
require('dotenv').config()


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fjsvr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const appoinmentCollection = client.db(`${process.env.DB_NAME}`).collection("appoinments");
  const usersCollection = client.db(`${process.env.DB_NAME}`).collection("users");
  // perform actions on the collection object
  app.post('/appoinment-booking',(req,res)=>{
    appoinmentCollection.insertOne(req.body)
  })
  
 
});


const PORT = process.env.port || 3001
app.listen(PORT,()=>{
    console.log('server is running with '+PORT+' port')
})