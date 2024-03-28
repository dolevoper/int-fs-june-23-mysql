import "dotenv/config";

import { Connection, RowDataPacket, createConnection } from "mysql2/promise";
import express from "express";
import { json } from "body-parser";

let dbConnection: Connection;
const app = express();

app.use(json());

const studentsPageSize = 2;
app.get("/students", async (req, res) => {
    try {
        const requestedPage = Number(req.query.page);
        const offset = isNaN(requestedPage) || !Number.isInteger(requestedPage) ?
            0 :
            (requestedPage - 1) * studentsPageSize;
        const [students] = await dbConnection.query(
            `SELECT id, firstName, lastName, email
            FROM students
            LIMIT ${studentsPageSize} OFFSET ${offset}`
        );

        res.status(200);
        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.json({ error: "something went wrong" });
    }
});

app.get("/students/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [students] = await dbConnection.execute(
            `SELECT id, firstName, lastName, email
            FROM students
            WHERE id = ?`,
            [id]
        );

        const [student] = students as RowDataPacket[];

        if (!student) {
            res.status(404);
            res.json({ error: "student not found" });
            return;
        }

        res.status(200);
        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.json({ error: "something went wrong" });
    }
});

app.post("/students", async (req, res) => {
    try {
        const {
            id,
            firstName,
            lastName,
            email
        } = req.body;

        dbConnection.execute(
            `INSERT INTO students (id, firstName, lastName, email)
            VALUES (?, ?, ?, ?)`,
            [id ?? crypto.randomUUID(), firstName, lastName, email]
        );

        res.status(201);
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500);
        res.json({ error: "something went wrong" });
    }
});

app.put("/students/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email } = req.body;

        dbConnection.execute(
            `UPDATE students
            SET firstName = ?, lastName = ?, email = ?
            WHERE id = ?`,
            [firstName, lastName, email, id]
        );

        res.status(204);
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500);
        res.json({ error: "something went wrong" });
    }
});

app.delete("/students/:id", async (req, res) => {
    try {
        const { id } = req.params;

        dbConnection.execute(
            `DELETE FROM students
            WHERE id = ?`,
            [id]
        );

        res.status(204);
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500);
        res.json({ error: "something went wrong" });
    }
});

async function runApp() {
    dbConnection = await createConnection({
        host: "localhost",
        user: "root",
        password: process.env.DB_PASSWORD,
        database: "school"
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
