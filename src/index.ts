import "dotenv/config";

import { Connection, createConnection } from "mysql2/promise";
import express from "express";

let dbConnection: Connection;
const app = express();

// CRUD - Create Read Update Delete

app.get("/students", async (req, res) => {
    try {
        const [students] = await dbConnection.query("SELECT id, firstName, lastName, email FROM students");

        res.status(200);
        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.json({ error: "something went wrong" });
    }
});

app.get("/students/:id", async (req, res) => { });

app.post("/students", async (req, res) => { });

app.put("/students/:id", async (req, res) => { });

app.delete("/students/:id", async (req, res) => { });

async function runApp() {
    dbConnection = await createConnection({
        host: "localhost",
        user: "root",
        password: process.env.DB_PASSWORD,
        database: "school",
        multipleStatements: true
    });

    try {
        app.listen(3000, () => console.log("app is running on localhost:3000"));
    } catch (err) {
        dbConnection.end();
        throw err;
    }
}

process.on("uncaughtException", () => dbConnection.end());
process.on("unhandledRejection", () => dbConnection.end());

runApp();
