const express = require('express');
const qr = require("qrcode");
const path = require('path');
const cors = require("cors")
const fs = require("fs");
const app = express()
const { qrModel } = require("./model")
const { connection } = require("./db")

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(cors())
app.get("/", (req, res) => {
    res.send("Home page")
})

const date = new Date();
let dte = date.toDateString()
let tme = date.toLocaleTimeString()
let val = `${tme} ${dte}`

app.get("/generate", async (req, res) => {
    function generateNumber() {
        return { "number": Math.floor(Math.random() * 10000000000000000), "message": "This is random generated QR code" }
    }
    let data = generateNumber()
    let stJson = JSON.stringify(data.number)
    let chk = await qrModel.find({ "number": stJson })
    if (chk.length > 0) {
        console.log("1")
        res.send("This is already present")
    }
    else {
        try {
            let sve = new qrModel({ "number": `${stJson}`, "time": val })
            await sve.save()
            console.log("2")
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

        } catch (error) {
            console.log("error")
            res.send(error)
        }
    }

})


app.post("/numbered/:id", async (req, res) => {
    try {
        let nums = req.params.id;
        const stJson = JSON.stringify(nums);

        let chk = await qrModel.find({ "number": nums })
        if (chk.length > 0) {
            console.log("1")
            res.send("This is already present")
        }

        else {
            let sve = new qrModel({ "number": `${nums}`, "time": val })
            await sve.save()

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
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send("An error occurred");
    }
});

app.listen(3030, async () => {
    try {
        await connection
        console.log("connected to db");
        console.log("Server is running on port no 3030")
    } catch (error) {
        console.log(error);
    }
})
