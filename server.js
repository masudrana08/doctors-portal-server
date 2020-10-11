const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const admin = require('firebase-admin');

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))
require('dotenv').config()

var serviceAccount = require("./doctors-portal-client-firebase-adminsdk-8s39n-0f2ffa71da.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://doctors-portal-client.firebaseio.com"
});


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fjsvr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const appoinmentCollection = client.db(`${process.env.DB_NAME}`).collection("appoinments");
  const usersCollection = client.db(`${process.env.DB_NAME}`).collection("users");
  // perform actions on the collection object
  app.post('/appoinment-booking',(req,res)=>{
    appoinmentCollection.insertOne(req.body)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
  })
  
  
  app.post('/addUser',(req,res)=>{
    usersCollection.insertOne(req.body)
    .then(result=>{
      res.send({})
    })
  })

  app.get('/userRole',(req,res)=>{
    const email = req.headers.email
    usersCollection.find({email:email})
    .toArray((error,documents)=>{
      res.send(documents[0])
    })
  })

  app.get('/appoinment',(req,res)=>{
  //   admin.auth().verifyIdToken(req.headers.authtoken)
  //   .then(decodedToken=>{
  //     const {uid, email} = decodedToken
  //     if(uid==req.headers.uid && email == req.headers.email){
        
        
  //     }
  //   })
  //   .catch(error=>{
  //     console.log(error)
  //   });
    const email= req.headers.email
  usersCollection.find({email:email})
        .toArray((error,documents)=>{
          switch (documents[0].role) {
            case 'admin':
              appoinmentCollection.find({})
              .toArray((error, documents)=>{
                res.send(documents)
              })
            case 'user':
              appoinmentCollection.find({email:`${email}`})
              .toArray((error, documents)=>{
                res.send(documents)
              })

          }
        })
  })

 
});


const PORT = process.env.port || 3001
app.listen(PORT,()=>{
    console.log('server is running with '+PORT+' port')
})