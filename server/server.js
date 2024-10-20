const express = require('express');
const app = express();
const port = 4000;

const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
})

app.post("/text", (req, res) => {
    // const text1 = req.body.inText;
    const t1 = req.body.lati;
    const t2 = req.body.longi;
    console.log(`lati::${t1}  longi::${t2}`);

    const sendText = {
        nyam: "nyamnyam!!"
    };
    res.send(sendText);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port})`);
})