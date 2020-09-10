const Models = require("./models.js");

function calculateTyt(data)
{
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
    result.soz += data.ea.edeb * 3.12 + data.ea.tar * 3.48 + data.ea.cog * 2.91 + data.soz.tar * 3.7 + data.soz.cog * 2.6 + data.soz.fel * 3.22 + data.soz.din * 3.94 + 100;

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
    
    
    let yigilma = await Models.hamYiginsal.find({});

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
            rankings.ham.sozFlag = false;
            if(puan.ham.soz >= 500)
            {
                rankings.ham.soz = 1;
                continue;
            }

            let r = ((yigilma[i].ham.soz - yigilma[i-1].ham.soz) / (yigilma[i].ham.puan - yigilma[i-1].ham.puan)) * (puan.ham.soz - yigilma[i].ham.puan) + yigilma[i].ham.soz;

            rankings.ham.soz = Math.round(r);

        }


    }


    yigilma = await Models.yerYiginsal.find({});

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

    return rankings;

}

function arrange(data)
{
    Object.keys(data).forEach(key => {

        Object.keys(data[key]).forEach(item => {

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
}




module.exports = {calculateTyt, calculateAyt, calculateRanking, arrange};

