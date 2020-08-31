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
   
    //console.log(tyt_point);
    //console.log(ayt_point);

    
    console.log({
        ham : {tyt : tyt_point.hamPuan, say : ayt_point.hamPuan.say, ea : ayt_point.hamPuan.ea}, 
        yer : {tyt : tyt_point.yerPuan, say : ayt_point.yerPuan.say, ea : ayt_point.yerPuan.ea}
    });
    

    


    
    let rankings = calculateRanking({
            ham : {tyt : tyt_point.hamPuan, say : ayt_point.hamPuan.say, ea : ayt_point.hamPuan.ea}, 
            yer : {tyt : tyt_point.yerPuan, say : ayt_point.yerPuan.say, ea : ayt_point.yerPuan.ea}
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

function calculateRanking(puan){

    console.log("-------")

    hamYiginsal.find({}, (err, yigilma) => {

        let rankings = {};
        rankings.tytFlag = true, rankings.sayFlag = true, rankings.eaFlag = true;

        for(let i=0; i<yigilma.length; i++)
        {
            //tyt
            if((puan.ham.tyt > yigilma[i].ham.puan) && rankings.tytFlag)
            {
                console.log(puan.ham.tyt, yigilma[i].ham.puan);
                
                rankings.tytFlag = false;
                if(puan.ham.tyt >= 500)
                {
                    rankings.tyt = 1;
                    continue;
                }

                let r = ((yigilma[i].ham.tyt - yigilma[i-1].ham.tyt) / (yigilma[i].ham.puan - yigilma[i-1].ham.puan) * (puan.ham.tyt - yigilma[i].ham.puan)) + yigilma[i].ham.tyt;
                //console.log(" s : ", (yigilma[i].ham.tyt - yigilma[i-1].ham.tyt / (yigilma[i].ham.puan - yigilma[i-1].ham.puan)));
                rankings.tyt = r;

            }
            //ayt say
            if((puan.ham.say > yigilma[i].ham.puan) && rankings.sayFlag)
            {
                rankings.sayFlag = false;
                if(puan.ham.say >= 500)
                {
                    rankings.say = 1;
                    continue;
                }

                let r = ((yigilma[i].ham.say - yigilma[i-1].ham.say) / (yigilma[i].ham.puan - yigilma[i-1].ham.puan)) * (puan.ham.say - yigilma[i].ham.puan) + yigilma[i].ham.say;
                rankings.say = r;

            }

            //ayt ea
            if((puan.ham.ea > yigilma[i].ham.puan) && rankings.eaFlag)
            {
                rankings.eaFlag = false;
                if(puan.ham.ea >= 500)
                {
                    rankings.ea = 1;
                    continue;
                }

                let r = ((yigilma[i].ham.ea - yigilma[i-1].ham.ea) / (yigilma[i].ham.puan - yigilma[i-1].ham.puan)) * (puan.ham.ea - yigilma[i].ham.puan) + yigilma[i].ham.ea;
                rankings.ea = r;

            }   

        }

        console.log(rankings);

    })

    yerYiginsal.find({}, (err, yigilma) => {

        let rankings = {};
        rankings.tytFlag = true, rankings.sayFlag = true, rankings.eaFlag = true;

        for(let i=19; i<yigilma.length; i++)
        {
            //tyt
            if((puan.yer.tyt > yigilma[i].yer.puan) && rankings.tytFlag)
            {
                console.log(puan.yer.tyt, yigilma[i].yer.puan);
                
                rankings.tytFlag = false;
                if(puan.yer.tyt >= 550)
                {
                    rankings.tyt = 1;
                    continue;
                }

                let r = ((yigilma[i].yer.tyt - yigilma[i-1].yer.tyt) / (yigilma[i].yer.puan - yigilma[i-1].yer.puan) * (puan.yer.tyt - yigilma[i].yer.puan)) + yigilma[i].yer.tyt;
                //console.log(" s : ", (yigilma[i].ham.tyt - yigilma[i-1].ham.tyt / (yigilma[i].ham.puan - yigilma[i-1].ham.puan)));
                rankings.tyt = r;

            }
            //ayt say
            if((puan.yer.say > yigilma[i].yer.puan) && rankings.sayFlag)
            {
                rankings.sayFlag = false;
                if(puan.yer.say >= 550)
                {
                    rankings.say = 1;
                    continue;
                }

                let r = ((yigilma[i].yer.say - yigilma[i-1].yer.say) / (yigilma[i].yer.puan - yigilma[i-1].yer.puan)) * (puan.yer.say - yigilma[i].yer.puan) + yigilma[i].yer.say;
                rankings.say = r;

            }

            //ayt ea
            if((puan.yer.ea > yigilma[i].yer.puan) && rankings.eaFlag)
            {
                rankings.eaFlag = false;
                if(puan.yer.ea >= 550)
                {
                    rankings.ea = 1;
                    continue;
                }

                let r = ((yigilma[i].yer.ea - yigilma[i-1].yer.ea) / (yigilma[i].yer.puan - yigilma[i-1].yer.puan)) * (puan.yer.ea - yigilma[i].yer.puan) + yigilma[i].yer.ea;
                rankings.ea = r;

            }   

        }

        console.log(rankings);

    })

    /*
    Model.find({}, (err, yigilma) => {

        //let rankings = {ham : {tytFlag = true, sayFlag = true, eaFlag = true}, yer : {}};
        let rankings = {ham : {}, yer : {}};
        rankings.ham.tytFlag = true, rankings.ham.sayFlag = true, rankings.ham.eaFlag = true;
        rankings.yer.tytFlag = true, rankings.yer.sayFlag = true, rankings.yer.eaFlag = true;

        console.log("test : ", yigilma[0].yer);
        if(yigilma[0].ham == undefined)
        {
            console.log("++");
        }else
        {
            console.log("--");
        }

        
        //ham sonuçlar
        for(let i=0; i<yigilma.length; i++)
        {
            if(yigilma[i].ham === undefined)
                continue;
            

            //tyt
            if((puan.ham.tyt > yigilma[i].ham.puan) && rankings.ham.tytFlag)
            {
                console.log(puan.ham.tyt, yigilma[i].ham.puan);
                
                rankings.ham.tytFlag = false;
                if(i === 0)
                {
                    rankings.ham.tyt = 1;
                    continue;
                }

                let r = ((yigilma[i].ham.tyt - yigilma[i-1].ham.tyt) / (yigilma[i].ham.puan - yigilma[i-1].ham.puan) * (puan.ham.tyt - yigilma[i].ham.puan)) + yigilma[i].ham.tyt;
                //console.log(" s : ", (yigilma[i].ham.tyt - yigilma[i-1].ham.tyt / (yigilma[i].ham.puan - yigilma[i-1].ham.puan)));
                rankings.ham.tyt = r;

            }
            //ayt say
            if((puan.ham.say > yigilma[i].ham.puan) && rankings.ham.sayFlag)
            {
                rankings.ham.sayFlag = false;
                if(i === 0)
                {
                    rankings.ham.say = 1;
                    continue;
                }

                let r = ((yigilma[i].ham.say - yigilma[i-1].ham.say) / (yigilma[i].ham.puan - yigilma[i-1].ham.puan)) * (puan.ham.say - yigilma[i].ham.puan) + yigilma[i].ham.say;
                rankings.ham.say = r;

            }

            //ayt ea
            if((puan.ham.ea > yigilma[i].ham.puan) && rankings.ham.eaFlag)
            {
                rankings.ham.eaFlag = false;
                if(i === 0)
                {
                    rankings.ham.ea = 1;
                    continue;
                }

                let r = ((yigilma[i].ham.ea - yigilma[i-1].ham.ea) / (yigilma[i].ham.puan - yigilma[i-1].ham.puan)) * (puan.ham.ea - yigilma[i].ham.puan) + yigilma[i].ham.ea;
                rankings.ham.ea = r;

            }
        }

        console.log(" i :", yigilma.length);

        //yerleştirme sonuçlar
        for(let i=0; i<yigilma.length; i++)
        {
            if(yigilma[i].yer === undefined)
                continue;

            //tyt
            if((puan.yer.tyt > yigilma[i].yer.puan) && rankings.ham.tytFlag)
            {
                console.log(puan.yer.tyt, yigilma[i].ham.puan);
                
                rankings.yer.tytFlag = false;
                if(i === 0)
                {
                    rankings.yer.tyt = 1;
                    continue;
                }

                let r = ((yigilma[i].yer.tyt - yigilma[i-1].yer.tyt) / (yigilma[i].yer.puan - yigilma[i-1].yer.puan) * (puan.yer.tyt - yigilma[i].yer.puan)) + yigilma[i].yer.tyt;
                //console.log(" s : ", (yigilma[i].ham.tyt - yigilma[i-1].ham.tyt / (yigilma[i].ham.puan - yigilma[i-1].ham.puan)));
                rankings.yer.tyt = r;

                console.log(" r-tyt : ", r);

            }
            //ayt say
            if((puan.yer.say > yigilma[i].yer.puan) && rankings.yer.sayFlag)
            {
                rankings.yer.sayFlag = false;
                if(i === 0)
                {
                    rankings.yer.say = 1;
                    continue;
                }

                let r = ((yigilma[i].yer.say - yigilma[i-1].yer.say) / (yigilma[i].yer.puan - yigilma[i-1].yer.puan)) * (puan.yer.say - yigilma[i].yer.puan) + yigilma[i].yer.say;
                rankings.yer.say = r;

                console.log(" r-say : ", r);

            }

            //ayt ea
            if((puan.yer.ea > yigilma[i].yer.puan) && rankings.yer.eaFlag)
            {
                rankings.yer.eaFlag = false;
                if(i === 0)
                {
                    rankings.yer.ea = 1;
                    continue;
                }

                let r = ((yigilma[i].yer.ea - yigilma[i-1].yer.ea) / (yigilma[i].yer.puan - yigilma[i-1].yer.puan)) * (puan.yer.ea - yigilma[i].yer.puan) + yigilma[i].yer.ea;
                rankings.yer.ea = r;

                console.log(" r-ea : ", r);

            }
        }

        console.log(rankings);
        return rankings;

    })
    */

}