import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './db';
import globalRouter from './globalRouter';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const cors = require('cors')
const PORT = process.env.PORT || 5000;

connectDB();
app.use(cors())
app.use(bodyParser.json());
app.use('/api/v1/', globalRouter);


app.get('/helloworld', (request, response) => {
    response.send("Hello World!");
})

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

