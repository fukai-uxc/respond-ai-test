const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Groq = require("groq-sdk");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("public"));

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.post("/api/chat", async function (req, res) {
    try {
        const message = req.body.message;

        if (!message) {
            return res.status(400).json({
                error: "Message is required."
            });
        }

        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful AI assistant helping test the RESPOND AI prototype."
                },
                {
                    role: "user",
                    content: message
                }
            ]
        });

        const response = completion.choices[0].message.content;

        res.json({
            response: response
        });

    } catch (error) {
        console.error("Groq API Error:", error);

        res.status(500).json({
            error: "Failed to communicate with Groq.",
            details: error.message
        });
    }
});

module.exports = app;