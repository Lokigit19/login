const express = require("express");
const cors = require("cors");
const { Client } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const client = new Client({

    host: "YOUR_RDS_ENDPOINT",
    user: "postgres",
    password: "YourPassword",
    database: "login",
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect()
.then(() => {
    console.log("PostgreSQL Connected");
})
.catch(err => {
    console.log(err);
});

app.get("/", (req, res) => {

    res.send("Backend Running");
});

app.post("/login", async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    try {

        const result = await client.query(

            "SELECT * FROM users WHERE username=$1 AND password=$2",
            [username, password]
        );

        if (result.rows.length > 0) {

            res.json({
                message: "Login Successful"
            });

        } else {

            res.json({
                message: "Invalid Credentials"
            });
        }

    } catch (err) {

        console.log(err);

        res.status(500).send("Server Error");
    }
});

app.listen(5000, () => {

    console.log("Server running on port 5000");
});