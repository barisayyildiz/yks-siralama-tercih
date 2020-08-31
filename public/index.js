
console.log("qasdasdasdasd");

document.getElementById("btn").addEventListener("click", event => {

    let data = {
        tyt : {
            tur : document.getElementById("tyt-tur").value,
            sos : document.getElementById("tyt-sos").value,
            mat : document.getElementById("tyt-mat").value,
            fen : document.getElementById("tyt-fen").value
        },
        say : {
            mat : document.getElementById("say-mat").value,
            fiz : document.getElementById("say-fiz").value,
            kim : document.getElementById("say-kim").value,
            bio : document.getElementById("say-bio").value
        },

        ea : {
            edeb : document.getElementById("ea-edeb").value,
            tar : document.getElementById("ea-tar").value,
            cog : document.getElementById("say-fiz").value
        },

        soz : {
            tar : document.getElementById("soz-tar").value,
            cog : document.getElementById("soz-cog").value,
            fel : document.getElementById("soz-fel").value,
            din : document.getElementById("soz-din").value,
        },

        meta : {
            obp : document.getElementById("diplomaNotu").value,
            kirik : document.getElementById("kirik").checked
        }
    }


    fetch("/gonder", {
        method : "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body : JSON.stringify(data)
    });

    console.log("qqq");



})


/*
    inputs.forEach(element => {
        //console.log(element.parentNode.nextElementSibling.children[0]);
        //console.log(element.nextElementSibling);
    });
    */

/*
let tyt_table = document.querySelector("#tyt-table");

tyt_table.addEventListener("input", event => {
    console.log(event);


    //console.log("asd");
    let inputs = document.querySelectorAll(".dogru");
    
    

    for(let i=0; i<inputs.length; i++)
    {
        let element = inputs[i];
        let max = Number(element.firstElementChild.max);
        console.log(max);
        let d = element.firstElementChild.value;
        d = isNaN(d) ? 0 : Number(d);
        let y = element.nextElementSibling.firstElementChild.value;
        y = isNaN(y) ? 0 : Number(y);

        if(d + y > max)
        {
            element.firstElementChild.value = max, d = max;
            element.nextElementSibling.firstElementChild.value = 0, y = 0;
        }

        let net = d - y/4;

        element.parentNode.nextElementSibling.children[i].firstElementChild.value = net;
        element.parentNode.nextElementSibling.children[i].firstElementChild.innerHTML = net;
    }

})*/


document.querySelectorAll("table").forEach(table => table.addEventListener("input", event => {

    let inputs = table.querySelectorAll(".dogru");
    console.log(inputs);

    for(let i=0; i<inputs.length; i++)
    {
        let element = inputs[i];
        let max = Number(element.firstElementChild.max);
        console.log(max);
        let d = element.firstElementChild.value;
        d = isNaN(d) ? 0 : Number(d);
        let y = element.nextElementSibling.firstElementChild.value;
        y = isNaN(y) ? 0 : Number(y);

        if(d + y > max)
        {
            element.firstElementChild.value = max, d = max;
            element.nextElementSibling.firstElementChild.value = 0, y = 0;
        }

        let net = d - y/4;

        element.parentNode.nextElementSibling.children[i].firstElementChild.value = net;
        element.parentNode.nextElementSibling.children[i].firstElementChild.innerHTML = net;
    }

}))
