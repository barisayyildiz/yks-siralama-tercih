
String.prototype.turkishToUpper = function(){
    var string = this;
    var letters = { "i": "İ", "ş": "Ş", "ğ": "Ğ", "ü": "Ü", "ö": "Ö", "ç": "Ç", "ı": "I" };
    string = string.replace(/(([iışğüçö]))/g, function(letter){ return letters[letter]; })
    return string.toUpperCase();
}

let inputs = document.querySelectorAll("input")

inputs.forEach(element => element.addEventListener("input", event => {

    console.log("qq");

    //console.log(element.id);
    console.log(element.value);

    let data = {
        "universite" : inputs[0].value.turkishToUpper(),
        "bolum" : inputs[1].value,
        "say" : document.getElementById("SAY").checked,
        "ea" : document.getElementById("EA").checked,
        "soz" : document.getElementById("SÖZ").checked,
        "devlet" : document.getElementById("devlet").checked,
        "ozel" : document.getElementById("ozel").checked,
        "kktc" : document.getElementById("kktc").checked,
        "yurtdisi" : document.getElementById("yurtdisi").checked
    };

    console.log(data);

    fetch("/query", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        }
    })
    .then(response => response.json())
    .then(data => {

        console.log(data);
        createNode(data);

    });



}))


function createNode(data)
{


    //let list = document.querySelector("ul");
    //list.innerHTML = "";

    //console.log(document.querySelector("table").children);

    let table = document.querySelector("table")
    let header = table.children[0];

    table.innerHTML = "";
    table.appendChild(header);

    if(data.length > 300)
        return;

    data = sortByKey(data);

    console.log(data);

    for(let i=0; i<data.length; i++)
    {

        //if(document.getElementById(data[i].puanTur).checked)
        //console.log(document.getElementById(data[i].puanTur));


        let row = document.createElement("tr");
        let uni = document.createElement("td");
        let bolum = document.createElement("td");
        let puan = document.createElement("td");
        let tur = document.createElement("td");

        uni.innerText = data[i].uni;
        bolum.innerText = data[i].bolum;
        puan.innerText = data[i].TabanPuan;
        tur.innerText = data[i].puanTur;

        row.appendChild(uni), row.appendChild(bolum), row.appendChild(puan), row.appendChild(tur);
        document.querySelector("table").appendChild(row);


        /*
        let node = document.createElement("li");
        node.innerText = data[i].uni + " " + data[i].bolum;
        list.appendChild(node);
        */
    }

}

function sortByKey(data)
{

    data.forEach(item => {
        if(item.TabanPuan == undefined)
            item.TabanPuan = 0;
    });


    for(let i=0; i<data.length; i++)
    {
        for(let j=0; j<data.length-i-1; j++)
        {
            if(data[j].TabanPuan < data[j+1].TabanPuan)
            {
                let temp = data[j];
                data[j] = data[j+1];
                data[j+1] = temp;
            }
        }
    }

    return data;

}
