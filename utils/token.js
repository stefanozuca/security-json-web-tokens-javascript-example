import * as dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import fs from "node:fs";

const SECRET = process.env.SECRET;
const ONE_MINUTE_IN_MILISECONDS = 60*1000;
const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH;
const PUBLIC_KEY_PATH = process.env.PUBLIC_KEY_PATH;


export const signToken = (user) => {
    const payload = {
        sub: user.id,
        name: user.fullname,
        exp: Date.now() + ONE_MINUTE_IN_MILISECONDS,
    };

    // Si está disponible la llave private para encriptado asimétrico, utilizamos este mecanismo.
    if (PRIVATE_KEY_PATH) {
        const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
        return jwt.sign(payload, privateKey, { algorithm: 'RS256'});
    }

    return jwt.sign(payload, SECRET)
}

export const verifyToken = (req) => {
    console.log(req.token);

    const token = req.token;

    if (PUBLIC_KEY_PATH) {
        const publicKey = fs.readFileSync(PUBLIC_KEY_PATH, 'utf8');
        return jwt.verify(token, publicKey);
    }

    return jwt.verify(token, SECRET);
}

export const validateExpiration = (payload) => {
    if (Date.now() > payload.exp) {
        throw new Error("Token expired");
    }
};