const express        = require('express');
const cors           = require("cors");
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const app            = express();
const jsonParser     = express.json();
const {ObjectId} = require('mongodb');

const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url);
app.use(cors());

(async () => {
    try {
        await mongoClient.connect();
        app.locals.collection = mongoClient.db("samara_test").collection("samara_collection");
        app.locals.users = mongoClient.db("samara_test").collection("users");
        app.locals.savedDots = mongoClient.db("samara_test").collection("saved_dots");
        await app.listen(3001);
        console.log("Сервер начал работу");
    }catch(err) {
        return console.log(err);
    }
})();

app.get("/getAllDots", async(req, res) => {
    const collection = req.app.locals.collection;
    try{
        const data = await collection.find({}, {longitude: 1, latitude: 1, _id: 0}).limit(10000).toArray();
        res.send(data);
    }
    catch(err){return console.log(err);}
});

app.get("/getDotsByDate", async(req, res) => {
    console.log(req.query.startDate)
    console.log(req.query.endDate)
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const collection1 = req.app.locals.collection;
    try{
        const data = await collection1.find({created_at: {$gte: startDate,$lt: endDate}}, {longitude: 1, latitude: 1, _id: 0}).limit(1000).toArray();
        console.log(data)
        res.send(data);
    }
    catch(err){return console.log(err);}
});

app.get("/getDotsByRegion", async(req, res) => {
    console.log(req.query.startDate)
    const startDate = req.query.startDate.toString();
    const endDate = req.query.endDate.toString();
    const longitude = req.query.longitude *1;
    const latitude = req.query.latitude *1;
    // const radius = req.query.radius;
    const collection = req.app.locals.collection;
    try{
        const data = await collection.aggregate([
            { $geoNear: {
                    near: { type: "Point", coordinates: [ latitude , longitude ] },
                    distanceField: "dist.calculated",
                    maxDistance: 300,
                    spherical: true
                }},
            { $match : {created_at: {$gte: startDate,$lt: endDate}}}
        ]).toArray();
        res.send(data);
    }
    catch(err){return console.log(err);}
});
app.get("/saveDot", async(req, res) => {
    const name = req.query.name;
    const login = req.query.login;
    const longitude = req.query.longitude *1;
    const latitude = req.query.latitude *1;
    // const radius = req.query.radius;
    const collection = req.app.locals.savedDots;
    try{
        const data = await collection.insert({
            name: name,
            login: login,
            latitude: latitude,
            longitude: longitude
        });
        res.send(data);
    }
    catch(err){return console.log(err);}
});
app.get("/getSavedDots", async(req, res) => {
    const login = req.query.login;
    const collection = req.app.locals.savedDots;
    try{
        const data = await collection.find({
            login: login
        }).toArray();
        res.send(data);
    }
    catch(err){return console.log(err);}
});

app.get("/deleteSavedDots", async(req, res) => {
    const id = req.query.id.toString();
    const collection = req.app.locals.savedDots;
    try{
        const data = await collection.deleteOne({"_id": ObjectId(id)});
        res.send(data);
    }
    catch(err){return console.log(err);}
});


app.get("/addNewUser", async(req, res) => {
    const email = req.query.email;
    const phone = req.query.phone;
    const surname = req.query.surname;
    const name = req.query.name;
    const lastname = req.query.lastname;
    const login = req.query.login;
    const password = req.query.password;
    const users = req.app.locals.users;
    try{
        const userData = await users.insert({
            mail: email,
            phone_number: phone,
            surname: surname,
            name: name,
            lastname: lastname,
            login: login,
            pw: password,
        });
        res.send(userData);
    }
    catch(err){return console.log(err);}
});

app.get("/login", async(req, res) => {
    const login = req.query.login;
    const pw = req.query.pw;
    const users = req.app.locals.users;
    try{
        const userData = await users.findOne({login: login, pw: pw});
        if (userData && userData.login) console.log(userData.login + ' вошел в систему')
        res.send(userData);
    }
    catch(err){return console.log(err);}
});