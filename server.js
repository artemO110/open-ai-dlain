const PORT = 8000
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
require('dotenv').config()

const { Configuration, OpenAIApi } = require("openai");

let filePath;
const fs = require('fs')
const multer = require('multer')


const configuration = new Configuration({
    apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public')
    },
    filename: (reg, file, cb) => {
        console.log('file', file)
        cb(null, Date.now() + "-" + file.originalname)
    }
});
const upload = multer({ storage: storage }).single('file')

app.post('/images', async (reg, res) => {
    try {
        const response = await openai.createImage({
            prompt: reg.body.message,
            n: 10,
            size: "1024x1024",
        });
        console.log(response)
        res.send(response.data.data)
    } catch (error) {

        console.error(error)

    }
})

app.post("/upload", (req, res) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        filePath = req.file.path
    })
})

app.post('/variations', async (req, res) => {
    try {
        const response = await openai.createImageVariation(
            fs.createReadStream(filePath),
            4,
            "256x256"
        )
        res.send(response.data.data)
    } catch (error) {
        console.log(error)
    }
})

app.listen(PORT, () => console.log('YOU SERVER IS RUNING ON PORT ' + PORT))