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
        ea : Number,
        soz : Number
    }
})

const yerSchema = new mongoose.Schema({
    yer : {
        puan : Number,
        tyt : Number,
        say : Number,
        ea : Number,
        soz : Number
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

app.post("/gonder", async (req, res) => {
    console.log("###################");

    let data = {tyt : {}, say : {}, ea : {}, soz : {}, meta : {}};
    data.tyt.tur = req.body["tyt-tur"], data.tyt.sos = req.body["tyt-sos"], data.tyt.mat = req.body["tyt-mat"], data.tyt.fen = req.body["tyt-fen"];
    data.say.mat = req.body["say-mat"], data.say.fiz = req.body["say-fiz"], data.say.kim = req.body["say-kim"], data.say.bio = req.body["say-bio"];
    data.ea.edeb = req.body["ea-edeb"], data.ea.tar = req.body["ea-tar"], data.ea.cog = req.body["ea-cog"];
    data.soz.tar = req.body["soz-tar"], data.soz.cog = req.body["soz-cog"], data.soz.fel = req.body["soz-fel"], data.soz.din = req.body["soz-din"];
    data.meta.obp = req.body["obp"], data.meta.kirik = req.body.kirik !== undefined;


    data = arrange(data);

    console.log("data : ", data);

    
    let tytPoints = calculateTyt(data);
    let aytPoints = calculateAyt(data);
    console.log(tytPoints, aytPoints);

    let rankings = await calculateRanking({
        ham : {tyt : tytPoints.ham, say : aytPoints.ham.say, ea : aytPoints.ham.ea, soz : aytPoints.ham.soz}, 
        yer : {tyt : tytPoints.yer, say : aytPoints.yer.say, ea : aytPoints.yer.ea, soz : aytPoints.yer.soz}
    })

    console.log("rank : ", rankings);

    res.render("result", {
        rankings : rankings,
        tytPoints : tytPoints,
        aytPoints : aytPoints,
        style : "./style/result.css"
    });

    
})

function arrange(data)
{
    /*
    Object.keys(data).forEach(key => {
        if(data[key] == "")
        {
            data[key] = 0;
        }else if(key !== "kirik")
        {
            //convert to floating number
            data[key] = Number(data[key]);
        }else if(key === "kirik" && data[key] === true)
        {
            data["obp"] /= 2;
        }
    })

    return data;
    */

    Object.keys(data).forEach(key => {

        console.log(data[key]);

        Object.keys(data[key]).forEach(item => {
            //console.log(item, data[key][item]);

            if(data[key][item] === "")
            {
                data[key][item] = 0;
            }else if(item !== "kirik")
            {
                data[key][item] = Number(data[key][item]);
            }else if(item === "kirik" && data[key][item] == true)
            {
                data["meta"]["obp"] /= 2;
            }

        });

    });

    return data;

    /*
    console.log("-----------");
    console.log(data.tyt);
    */

}


function calculateTyt(data)
{
    //return (tur * 3.4 + sos * 3.4 + mat * 3.3 + fen * 3.4 + 100);
    //req.body["tyt-tur"], req.body["tyt-sos"], req.body["tyt-mat"], req.body["tyt-fen"], req.body["obp"]
    return {
        ham : Number((data.tyt.tur * 3.24 +  data.tyt.sos * 3.66 + data.tyt.mat * 3.34 + data.tyt.fen * 3.41 + 100).toFixed(5)),
        yer : Number((data.tyt.tur * 3.24 + data.tyt.sos * 3.66 + data.tyt.mat * 3.34 + data.tyt.fen * 3.41 + 100 + data.meta.obp * 0.6).toFixed(5))
    };

}

function calculateAyt(data)
{
    let result = {};

    result.say = data.tyt.tur * 1.38 + data.tyt.sos * 1.56 + data.tyt.mat * 1.43 + data.tyt.fen * 1.46; //tyt
    result.say += data.say.mat * 2.71 + data.say.fiz * 3.15 + data.say.kim * 2.77 + data.say.bio * 3.31 + 100; //ayt
    
    result.ea = data.tyt.tur * 1.38 + data.tyt.sos * 1.55 + data.tyt.mat * 1.42 + data.tyt.fen * 1.45;
    result.ea += data.say.mat * 2.69 + data.ea.edeb * 3.18 + data.ea.tar * 3.54 + data.ea.cog * 2.96 + 100;

    result.soz = data.tyt.tur * 1.35 + data.tyt.sos * 1.53 + data.tyt.mat * 1.40 + data.tyt.fen * 1.42; //tyt
    result.soz += data.ea.edeb * 3.12 + data.ea.tar * 3.48 + data.ea.cog * 2.91 + data.soz.tar * 3.7 + data.soz.cog * 2.6 + data.soz.fel * 3.22 + data.soz.din * 3.94

    return {
        ham : {say : Number((result.say).toFixed(5)), ea : Number((result.ea).toFixed(5)), soz : Number((result.soz.toFixed(5)))},
        yer : {say : Number((result.say + data.meta.obp * 0.6).toFixed(5)), ea : Number((result.ea + data.meta.obp * 0.6).toFixed(5)), soz : Number((result.soz + data.meta.obp * 0.6).toFixed(5))}
    };
}

async function calculateRanking(puan)
{
    let rankings = { ham : {}, yer : {}};
    rankings.ham.tytFlag = true, rankings.ham.sayFlag = true, rankings.ham.eaFlag = true, rankings.ham.sozFlag = true;
    rankings.yer.tytFlag = true, rankings.yer.sayFlag = true, rankings.yer.eaFlag = true, rankings.yer.sozFlag = true;
    
    
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
        
        //ayt söz
        if((puan.ham.soz > yigilma[i].ham.puan) && rankings.ham.sozFlag)
        {
            console.log("++++++++++++ : " , puan.ham.soz, yigilma[i].ham.puan)
            rankings.ham.sozFlag = false;
            if(puan.ham.soz >= 500)
            {
                rankings.ham.soz = 1;
                continue;
            }

            let r = ((yigilma[i].ham.soz - yigilma[i-1].ham.soz) / (yigilma[i].ham.puan - yigilma[i-1].ham.puan)) * (puan.ham.soz - yigilma[i].ham.puan) + yigilma[i].ham.soz;

            console.log("RRRRRRR : ", (yigilma[i].ham["soz"]));

            rankings.ham.soz = Math.round(r);

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

        //ayt söz
        if((puan.yer.soz > yigilma[i].yer.puan) && rankings.yer.sozFlag)
        {
            rankings.yer.sozFlag = false;
            if(puan.yer.soz >= 550)
            {
                rankings.yer.soz = 1;
                continue;
            }

            let r = ((yigilma[i].yer.soz - yigilma[i-1].yer.soz) / (yigilma[i].yer.puan - yigilma[i-1].yer.puan)) * (puan.yer.soz - yigilma[i].yer.puan) + yigilma[i].yer.soz;
            rankings.yer.soz = Math.round(r);

        } 

    }


    //console.log("rankings : ", rankings);


    return rankings;

}
