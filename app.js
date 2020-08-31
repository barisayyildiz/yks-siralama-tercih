const express = require("express");
const app = express();

const exphbs = require("express-handlebars");

const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/yks', {useNewUrlParser: true, useUnifiedTopology: true});

const hamSchema = new mongoose.Schema({
    ham : {
        puan : Number,
        tyt : Number,
        say : Number,
        ea : Number
    }
})

const yerSchema = new mongoose.Schema({
    yer : {
        puan : Number,
        tyt : Number,
        say : Number,
        ea : Number
    }
})

const hamYiginsal = mongoose.model("ham", hamSchema, '2019'); //ham - yığınsal tablo
const yerYiginsal = mongoose.model('yer', yerSchema, '2019'); //yerleştirme - yığınsal tablo


yerYiginsal.find({}, (err, docs) => {

    //console.log(docs[10].yer);

    console.log(docs[10].yer.puan)

});


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

    res.render('index', {
        style : "./style/style.css"
    });

})

app.post("/submit", async (req, res) => {
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
   
    //console.log(tyt_point);
    //console.log(ayt_point);

    
    console.log({
        ham : {tyt : tyt_point.ham, say : ayt_point.ham.say, ea : ayt_point.ham.ea}, 
        yer : {tyt : tyt_point.yer, say : ayt_point.yer.say, ea : ayt_point.yer.ea}
    });
    

    


    let rankings = await calculateRanking({
            ham : {tyt : tyt_point.ham, say : ayt_point.ham.say, ea : ayt_point.ham.ea}, 
            yer : {tyt : tyt_point.yer, say : ayt_point.yer.say, ea : ayt_point.yer.ea}
    })

    console.log(rankings);
    

    //Model.find({}, (err, docs) => console.log(docs));

    res.render("result", {
        rankings : rankings,
        tytPoints : tyt_point,
        aytPoints : ayt_point,
        style : "./style/result.css"
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
            data[key] = Number(data[key]);
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
        ham : Number((data["tyt-tur"] * 3.24 +  data["tyt-sos"] * 3.66 + data["tyt-mat"] * 3.34 + data["tyt-fen"] * 3.41 + 100).toFixed(5)),
        yer : Number((data["tyt-tur"] * 3.24 + data["tyt-sos"] * 3.66 + data["tyt-mat"] * 3.34 + data["tyt-fen"] * 3.41 + 100 + data["obp"] * 0.6).toFixed(5))
    };

}

function calculateAyt(data)
{
    let result = {};

    result.say = data["tyt-tur"] * 1.38 + data["tyt-sos"] * 1.56 + data["tyt-mat"] * 1.43 + data["tyt-fen"] * 1.46; //tyt
    result.say += data["ayt-mat"] * 2.71 + data["ayt-fiz"] * 3.15 + data["ayt-kim"] * 2.77 + data["ayt-bio"] * 3.31 + 100; //ayt
    
    result.ea = data["tyt-tur"] * 1.38 + data["tyt-sos"] * 1.55 + data["tyt-mat"] * 1.42 + data["tyt-fen"] * 1.45;
    result.ea += data["ayt-mat"] * 2.69 + data["ayt-edeb"] * 3.18 + data["ayt-tar"] * 3.54 + data["ayt-cog"] * 2.96 + 100;

    return {
        ham : {say : Number((result.say).toFixed(5)), ea : Number((result.ea).toFixed(12))},
        yer : {say : Number((result.say + data["obp"] * 0.6).toFixed(5)), ea : Number((result.ea + data["obp"] * 0.6).toFixed(5))}
    };
}

async function calculateRanking(puan)
{
    console.log("----");
    let rankings = { ham : {}, yer : {}};
    rankings.ham.tytFlag = true, rankings.ham.sayFlag = true, rankings.ham.eaFlag = true;
    rankings.yer.tytFlag = true, rankings.yer.sayFlag = true, rankings.yer.eaFlag = true;
    
    
    let yigilma = await hamYiginsal.find({});
    //console.log(yigilma[0].yer);

    for(let i=0; i<yigilma.length; i++)
    {
        //tyt
        if((puan.ham.tyt > yigilma[i].ham.puan) && rankings.ham.tytFlag)
        {
            
            rankings.ham.tytFlag = false;
            if(puan.ham.tyt >= 500)
            {
                rankings.ham.tyt = 1;
                continue;
            }

            let r = ((yigilma[i].ham.tyt - yigilma[i-1].ham.tyt) / (yigilma[i].ham.puan - yigilma[i-1].ham.puan) * (puan.ham.tyt - yigilma[i].ham.puan)) + yigilma[i].ham.tyt;
            //console.log(" s : ", (yigilma[i].ham.tyt - yigilma[i-1].ham.tyt / (yigilma[i].ham.puan - yigilma[i-1].ham.puan)));
            rankings.ham.tyt = Math.round(r);

        }
        //ayt say
        if((puan.ham.say > yigilma[i].ham.puan) && rankings.ham.sayFlag)
        {
            rankings.ham.sayFlag = false;
            if(puan.ham.say >= 500)
            {
                rankings.ham.say = 1;
                continue;
            }

            let r = ((yigilma[i].ham.say - yigilma[i-1].ham.say) / (yigilma[i].ham.puan - yigilma[i-1].ham.puan)) * (puan.ham.say - yigilma[i].ham.puan) + yigilma[i].ham.say;
            rankings.ham.say = Math.round(r);

        }

        //ayt ea
        if((puan.ham.ea > yigilma[i].ham.puan) && rankings.ham.eaFlag)
        {
            rankings.ham.eaFlag = false;
            if(puan.ham.ea >= 500)
            {
                rankings.ham.ea = 1;
                continue;
            }

            let r = ((yigilma[i].ham.ea - yigilma[i-1].ham.ea) / (yigilma[i].ham.puan - yigilma[i-1].ham.puan)) * (puan.ham.ea - yigilma[i].ham.puan) + yigilma[i].ham.ea;
            rankings.ham.ea = Math.round(r);

        }   

    }


    yigilma = await yerYiginsal.find({});

    for(let i=19; i<yigilma.length; i++)
    {
        //tyt
        if((puan.yer.tyt > yigilma[i].yer.puan) && rankings.yer.tytFlag)
        {
            
            rankings.yer.tytFlag = false;
            if(puan.yer.tyt >= 550)
            {
                rankings.yer.tyt = 1;
                continue;
            }

            let r = ((yigilma[i].yer.tyt - yigilma[i-1].yer.tyt) / (yigilma[i].yer.puan - yigilma[i-1].yer.puan) * (puan.yer.tyt - yigilma[i].yer.puan)) + yigilma[i].yer.tyt;
            //console.log(" s : ", (yigilma[i].ham.tyt - yigilma[i-1].ham.tyt / (yigilma[i].ham.puan - yigilma[i-1].ham.puan)));
            rankings.yer.tyt = Math.round(r);

        }
        //ayt say
        if((puan.yer.say > yigilma[i].yer.puan) && rankings.yer.sayFlag)
        {
            rankings.yer.sayFlag = false;
            if(puan.yer.say >= 550)
            {
                rankings.yer.say = 1;
                continue;
            }

            let r = ((yigilma[i].yer.say - yigilma[i-1].yer.say) / (yigilma[i].yer.puan - yigilma[i-1].yer.puan)) * (puan.yer.say - yigilma[i].yer.puan) + yigilma[i].yer.say;
            rankings.yer.say = Math.round(r);

        }

        //ayt ea
        if((puan.yer.ea > yigilma[i].yer.puan) && rankings.yer.eaFlag)
        {
            rankings.yer.eaFlag = false;
            if(puan.yer.ea >= 550)
            {
                rankings.yer.ea = 1;
                continue;
            }

            let r = ((yigilma[i].yer.ea - yigilma[i-1].yer.ea) / (yigilma[i].yer.puan - yigilma[i-1].yer.puan)) * (puan.yer.ea - yigilma[i].yer.puan) + yigilma[i].yer.ea;
            rankings.yer.ea = Math.round(r);

        }   

    }


    //console.log("rankings : ", rankings);


    return rankings;

}
