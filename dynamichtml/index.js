const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const jsonparser = bodyParser.json();
const urlencodedparser = bodyParser.urlencoded({ extended: false });
app.use(express.static(__dirname));

app.post("/subject", urlencodedparser, (req, res) => {
    console.log(req.body);
    res.redirect("/");
});

app.post("/object", urlencodedparser, (req, res) => {
    console.log(req.body);
    res.redirect("/");
});

app.post("/rule", urlencodedparser, (req, res) => {
    console.log(req.body);
    res.redirect("/");
});

app.post("/access", urlencodedparser, (req, res) => {
    console.log(req.body);
    res.redirect("/");
});

app.listen(3000, () => {
    console.log("listening the port at 3000");
});