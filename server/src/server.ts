import express from "express";
import path from 'path';
import bodyParser from "body-parser"
import routes from "./routes"
import cors from 'cors'

const app = express()

//app.use(bodyParser.text({ type: '*/*' }));
app.use(express.json())
app.use(cors())

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))
app.use(routes)

app.listen(5000, () => {
    console.log("Listening on 5000");

})