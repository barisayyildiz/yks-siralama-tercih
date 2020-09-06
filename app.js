const express = require("express");
const app = express();
const lib = require("./library.js");
const Models = require("./models.js");

const exphbs = require("express-handlebars");

const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/yks', {useNewUrlParser: true, useUnifiedTopology: true});


/*
//ÜNİVERSİTELER VERİTABANI
const schema = new mongoose.Schema({
    kod : Number,
    tur : String
});
const model = mongoose.model("tercih", {}, "2019_siralama");
*/



app.listen(3000, () => {console.log("I'm listening...")});

app.engine("handlebars", exphbs());
app.set('view engine', "handlebars");

app.use(express.static(__dirname + "/public"));
app.use(express.json());

app.use(express.urlencoded({
    extended: true
  }))

app.get("/", (req, res) => {

    res.render('index', {
        style : "./style/style.css"
    });

})

app.post("/submit", async (req, res) => {

    let data = {tyt : {}, say : {}, ea : {}, soz : {}, meta : {}};
    data.tyt.tur = req.body["tyt-tur"], data.tyt.sos = req.body["tyt-sos"], data.tyt.mat = req.body["tyt-mat"], data.tyt.fen = req.body["tyt-fen"];
    data.say.mat = req.body["say-mat"], data.say.fiz = req.body["say-fiz"], data.say.kim = req.body["say-kim"], data.say.bio = req.body["say-bio"];
    data.ea.edeb = req.body["ea-edeb"], data.ea.tar = req.body["ea-tar"], data.ea.cog = req.body["ea-cog"];
    data.soz.tar = req.body["soz-tar"], data.soz.cog = req.body["soz-cog"], data.soz.fel = req.body["soz-fel"], data.soz.din = req.body["soz-din"];
    data.meta.obp = req.body["obp"], data.meta.kirik = req.body.kirik !== undefined;


    data = lib.arrange(data);
    
    let tytPoints = lib.calculateTyt(data);
    let aytPoints = lib.calculateAyt(data);

    let rankings = await lib.calculateRanking({
        ham : {tyt : tytPoints.ham, say : aytPoints.ham.say, ea : aytPoints.ham.ea, soz : aytPoints.ham.soz}, 
        yer : {tyt : tytPoints.yer, say : aytPoints.yer.say, ea : aytPoints.yer.ea, soz : aytPoints.yer.soz}
    })

    res.render("result", {
        rankings : rankings,
        tytPoints : tytPoints,
        aytPoints : aytPoints,
        style : "./style/result.css"
    });

    
})


app.get("/tercih", (req, res) => {

    res.render("tercih", 
        {
            style : "./style/tercih.css"
        });

})


app.post("/query", (req, res) => {

    let flag;
    console.log("*********************************************************************************************************");
    console.log(req.body);

    let query = {
        "uni" : {"$regex" : `${req.body.universite}`, "$options" : "i"},
        "bolum" : {"$regex" : `${req.body.bolum}`, "$options" : "i"},
        "TabanPuan" : {"$lt" : req.body.max},
        "$or" : []
    };

    //puan türleri
    if(req.body.say) query["$or"].push({"puanTur" : "SAY"});
    if(req.body.ea) query["$or"].push({"puanTur" : "EA"});
    if(req.body.soz) query["$or"].push({"puanTur" : "SÖZ"});

    console.log("query -> ", query["$or"]);

    flag = true;
    if(req.body.say || req.body.ea || req.body.soz)
        flag = false;
    if(flag)
        delete query["$or"];


    /*
    Models.uniModel.find(query, (err, docs) => {
        if(err)
        {
            console.log(err);
            return;
        }

        if(docs.length > 500)
            docs = [];
        res.send(docs);   
    })
    */

    Models.uniModel.find(query).sort({TabanPuan: -1}).exec((err, docs) => {
        if(err)
        {
            console.log(err);
            return;
        }

        if(docs.length > 500)
        {
            console.log("çok fazla")
            docs = [];
        }
        else
        {
            console.log("docs : ", docs);
            docs = removeByUniTur(req.body, docs);
            console.log("İşte okullar...")
            console.log(docs);
        }

        res.send(docs);
    })
    


})


function removeByUniTur(body, docs)
{
    let temp = [];

    for(let i=0; i<docs.length; i++)
    {
        if(body.devlet && docs[i].uniTur == "Devlet") temp.push(docs[i]);
        if(body.ozel && docs[i].uniTur == "Özel") temp.push(docs[i]);
        if(body.kktc && docs[i].uniTur == "KKTC") temp.push(docs[i]);
        if(body.yurtdisi && docs[i].uniTur == "Yurtdışı") temp.push(docs[i]);
    }


    console.log("temp : ", temp);


    return temp;

}
