import * as dotenv from "dotenv";
dotenv.config();

export const getCredential = (req) => {
    const { authorization } = req.headers;

    if (!authorization) {
        throw new Error("No authorization header provided");
    }

    // Basic
    const [type, credentials] = authorization.split(" ");

    if (type !== "Basic") {
        throw new Error("Authorizarion type not allowed");
    }

    const [username, password] = Buffer.from(credentials, "base64")
        .toString()
        .split(":");

    return { username, password };
}

export const getToken = (req) => {
    const { authorization } = req.headers;

    if (!authorization) {
        throw new Error("No authorization header provided");
    }

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer") {
        throw new Error("Authorizarion type not allowed");
    }

    return { token };

}