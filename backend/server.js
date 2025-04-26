import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import dotenv from 'dotenv';
import {MongoClient} from "mongodb";
import routeAnimal from "./routes/routeAnimal.js";
import routeUser from "./routes/routeUser.js";

// === SETUPS === //

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app  = express(); // APP
const PORT = process.env.PORT || 3000; //PORT


// === DATABASE CONFIG === //

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

async function connectToDatabase() {
    try{
        await client.connect();
        db = client.db("petoVibe");
        console.log('Connected to database'.green);

    }catch (err){
        console.error('Failed to connect to MongoDB!'.red, err.message);
        process.exit(1);
    }
}

connectToDatabase();

// == END OF CONFIGURATION == //

// === BODY PARSER MIDDLEWARE === //
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use((req, res, next) => {
    req.db = db;
    next();
})

// == STATIC SETUP == //
app.use(express.static(path.join(__dirname, 'public')))



// USE ROUTES //
// use route for animal
app.use('/animals', routeAnimal);
// use route for user
app.use('/users',routeUser)


// === START LISTENING === //
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)})