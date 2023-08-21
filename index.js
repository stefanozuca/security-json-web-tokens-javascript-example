import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import { getCredential, getToken } from "./utils/headers.js";
import { signToken, verifyToken, validateExpiration } from "./utils/token.js";
import { getUser } from "./utils/users.js";


const app = express();

const PORT = process.env.PORT;

app.get("/public", (req, res) => {
    res.status(200).send("I'm public");
});

app.get("/private", (req, res) => {
    try {
        const token = getToken(req);
        const payload = verifyToken(token);

        validateExpiration(payload);

        res.send("I'm private");
    }
    catch (error) {
        res.status(401).send({error: error.message});
    }
});

app.post("/token", (req, res) => {
    try 
    {
        const { username, password } = getCredential(req);
        const user = getUser(username,password);
        const token = signToken(user);

        res.send({token});
    } 
    catch (error) {
        res.status(400).send({error: error.message});
    }

});


app.listen(PORT, () => console.log("Listening on http://localhost:"+PORT));
