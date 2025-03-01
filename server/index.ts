import express from "express";
import "dotenv/config";
import api from "./api";
import { existsSync } from "node:fs";
import morgan from "morgan";
import compression from "compression";
import { createRequestHandler } from "@react-router/express";

const app = express();
app.use(express.json());
app.use(compression());

app.use(morgan((tokens, req, res) => (
    [
        new Date().toISOString(),
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
    ].join(" ")
)));

app.use(api);

if (process.env.NODE_ENV == "production") {
    console.log("Redirecting to https");
    app.enable('trust proxy');
    app.use((req, res, next) => {
        if (!req.secure) {
            return res.redirect('https://' + req.headers.host + req.url);
        }

        next();
    });
}

if (existsSync("./build")) {
    console.log("Build found - starting PROD");

    app.use(
        "/assets",
        express.static("build/client/assets", { immutable: true, maxAge: "1y" })
    );

    app.use(express.static("build/client", { maxAge: "1h" }));

    const BUILD_PATH = "../build/server/index.js";

    app.use(createRequestHandler({
        build: await import(BUILD_PATH),
    }));
}

app.use(((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        error: err?.toString() || "" + err,
    });
}) as express.ErrorRequestHandler);

console.log("Starting...");
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
