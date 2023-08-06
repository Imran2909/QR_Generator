const express = require('express');
const qr = require("qrcode");
const path = require('path');
const cors = require("cors")
const fs = require("fs"); 
const app = express()

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(cors())
app.get("/", (req, res) => {
    res.send("Home page")
})

app.get("/generate", async (req, res) => {
    function generateNumber() {
        return { "number": Math.floor(Math.random() * 10000000000000000), "message": "This is random generated QR code" }
    }
    let data = generateNumber()
    let stJson = JSON.stringify(data.number)
    qr.toFile("qr.png", stJson, function (err) {
        if (err) {
            console.log("Error generating QR code:", err);
            return res.status(500).send("Error generating QR code");
        }

        fs.readFile("qr.png", (readErr, fileData) => {
            if (readErr) {
                console.log("Error reading QR code:", readErr);
                return res.status(500).send("Error reading QR code");
            }

            res.setHeader('Content-Type', 'image/png');
            res.end(fileData);
        });
    });
})


app.post("/numbered/:id", async (req, res) => {
    try {
        let nums = +req.params.id;
        const stJson = JSON.stringify(nums);

        qr.toFile("qr.png", stJson, function (err) {
            if (err) {
                console.log("Error generating QR code:", err);
                return res.status(500).send("Error generating QR code");
            }

            fs.readFile("qr.png", (readErr, fileData) => {
                if (readErr) {
                    console.log("Error reading QR code:", readErr);
                    return res.status(500).send("Error reading QR code");
                }

                res.setHeader('Content-Type', 'image/png');
                res.send(fileData);
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send("An error occurred");
    }
});

app.listen(3030, () => {
    console.log("Server is running on port no 3030")
})
