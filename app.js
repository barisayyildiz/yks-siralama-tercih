const express = require("express");
const app = express();

const exphbs = require("express-handlebars");

const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/yks', {useNewUrlParser: true, useUnifiedTopology: true});

const Schema = new mongoose.Schema({
    ham : {
        puan : Number,
        tyt : Number,
        say : Number,
        ea : Number
    }
})

const Model = mongoose.model('2019', Schema, '2019');


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
    
    let data = arrange(req.body);

    console.log(data);

    let tyt_point = calculateTyt(req.body);
    let ayt_point = calculateAyt(req.body);
   
    console.log(tyt_point);
    console.log(ayt_point);

    let rankings = calculateRanking({
            ham : {tyt : tyt_point.hamPuan, say : ayt_point.hamPuan.say, ea : ayt_point.hamPuan.ea}, 
            yer : {tyt : tyt_point.hamPuan, say : ayt_point.yerPuan.say, ea : ayt_point.yerPuan.ea}
    });
    
    console.log(rankings);

    

    //Model.find({}, (err, docs) => console.log(docs));

    res.render("result", {
        layout : 'result',
        data : req.body
    });
})


function arrange(data)
{
    Object.keys(data).forEach(key => {
        if(data[key] == "")
        {
            data[key] = 0;
        }else if(key !== "kirik")
        {
            //convert to floating number
            data[key] = parseFloat(Number.parseFloat(data[key]).toFixed(2));
        }else if(key === "kirik")
        {
            data["obp"] /= 2;
        }
    })

    return data;

}


function calculateTyt(data)
{
    //return (tur * 3.4 + sos * 3.4 + mat * 3.3 + fen * 3.4 + 100);
    //req.body["tyt-tur"], req.body["tyt-sos"], req.body["tyt-mat"], req.body["tyt-fen"], req.body["obp"]
    return {
        hamPuan : data["tyt-tur"] * 3.3 +  data["tyt-sos"] * 3.4 + data["tyt-mat"] * 3.3 + data["tyt-fen"] * 3.4 + 100,
        yerPuan : data["tyt-tur"] * 3.3 + data["tyt-sos"] * 3.4 + data["tyt-mat"] * 3.3 + data["tyt-fen"] * 3.4 + 100 + data["obp"] * 0.6
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

function calculateRanking(data){

    Model.find({}, (err, docs) => {

        //let rankings = {ham : {tytFlag = true, sayFlag = true, eaFlag = true}, yer : {}};
        let rankings = {ham : {}, yer : {}};
        rankings.ham.tytFlag = true, rankings.ham.sayFlag = true, rankings.ham.eaFlag = true;

        
        //ham sonuçlar
        for(let i=0; i<docs.length; i++)
        {
            //tyt
            if((data.ham.tyt > docs[i].ham.tyt) && rankings.ham.tytFlag)
            {
                rankings.ham.tytFlag = false;
                if(i === 0)
                {
                    rankings.ham.tyt = 1;
                    continue;
                }

                let r = ((docs[i].ham.tyt - docs[i-1].ham.tyt / (docs[i].ham.puan - docs[i-1].ham.puan)) * (data.ham.tyt - docs[i].ham.puan)) + docs[i].ham.tyt;
                rankings.ham.tyt = r;

            }
            //ayt say
            if((data.ham.say > docs[i].ham.say) && rankings.ham.sayFlag)
            {
                rankings.ham.sayFlag = false;
                if(i === 0)
                {
                    rankings.ham.say = 1;
                    continue;
                }

                let r = ((docs[i].ham.say - docs[i-1].ham.say / (docs[i].ham.puan - docs[i-1].ham.puan)) * (data.ham.say - docs[i].ham.puan)) + docs[i].ham.say;
                rankings.ham.say = r;

            }

            //ayt ea
            if((data.ham.ea > docs[i].ham.ea) && rankings.ham.eaFlag)
            {
                rankings.ham.eaFlag = false;
                if(i === 0)
                {
                    rankings.ham.ea = 1;
                    continue;
                }

                let r = ((docs[i].ham.ea - docs[i-1].ham.ea / (docs[i].ham.puan - docs[i-1].ham.puan)) * (data.ham.ea - docs[i].ham.puan)) + docs[i].ham.ea;
                rankings.ham.ea = r;

            }
        }

        console.log(rankings);
        return rankings;

    })

}