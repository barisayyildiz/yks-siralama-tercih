const express = require("express");
const app = express();

const exphbs = require("express-handlebars");

const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/yks', {useNewUrlParser: true, useUnifiedTopology: true});

const Model = mongoose.model('ham_puan', {puan : Number, tyt : Number, say : Number, ea : Number}, 'ham_puan');


//Model.create({puan : 600, tyt : 1, say : 1, ea : 1});


app.listen(3000, () => {console.log("I'm listening...")});

app.engine("handlebars", exphbs());
app.set('view engine', "handlebars");

app.use(express.static(__dirname + "/public"));
app.use(express.json());

app.use(express.urlencoded({
    extended: true
  }))

app.get("/", (req, res) => {

    res.render('index', {});

})

app.post("/submit", (req, res) => {
    //console.log(req.body["ayt-mat-Y"] == "");

    /*
    var superSecret = function(req.body){
        Object.keys(spy).forEach(function(key){ spy[key] = "redacted" });
        return spy;
    }
    */

    req.body = arrange(req.body);
    req.body = toInt(req.body);

    let tyt_point = calculateTyt(req.body["tyt-tur"], req.body["tyt-sos"], req.body["tyt-mat"], req.body["tyt-fen"], req.body["obp"]);
    let ayt_point = calculateAyt(req.body);

    console.log(req.body["obp"]);
    
    console.log(tyt_point);
    console.log(ayt_point);

    Model.find({}, (err, docs) => console.log(docs));


    res.render("result", {
        layout : 'result',
        data : req.body
    });
})


function arrange(data)
{
    Object.keys(data).forEach(key => {
        if(data[key] == "")
            data[key] = 0;
    })

    return data;

}

function toInt(data)
{
    Object.keys(data).forEach(key => {

        data[key] = parseFloat(Number.parseFloat(data[key]).toFixed(2));

        //data[key] = parseFloat(data[key]);
    })

    return data;
}

function calculateTyt(tur, sos, mat, fen, obp)
{
    //return (tur * 3.4 + sos * 3.4 + mat * 3.3 + fen * 3.4 + 100);
    return {
        hamPuan : tur * 3.4 + sos * 3.4 + mat * 3.3 + fen * 3.4 + 100,
        yerPuan : tur * 3.4 + sos * 3.4 + mat * 3.3 + fen * 3.4 + 100 + obp * 0.6
    };

}

function calculateAyt(data)
{
    let result = {};

    result.say = data["tyt-tur"] * 1.32 + data["tyt-sos"] * 1.36 + data["tyt-mat"] * 1.32 + data["tyt-fen"] * 1.36; //tyt
    result.say += data["ayt-mat"] * 3 + data["ayt-fiz"] * 2.85 + data["ayt-kim"] * 3.07 + data["ayt-bio"] * 3.07 + 100; //ayt
    
    result.ea = data["tyt-tur"] * 1.32 + data["tyt-sos"] * 1.36 + data["tyt-mat"] * 1.32 + data["tyt-fen"] * 1.36;
    result.ea += data["ayt-mat"] * 3 + data["ayt-edeb"] * 3 + data["ayt-tar"] * 2.8 + data["ayt-cog"] * 3.33 + 100;

    return {
        hamPuan : {say : result.say, ea : result.ea},
        yerPuan : {say : result.say + data["obp"] * 0.6, ea : result.ea + data["obp"] * 0.6}
    };
}