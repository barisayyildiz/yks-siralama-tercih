
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
        "tyt" : document.getElementById("tyt").checked,
        "say" : document.getElementById("say").checked,
        "ea" : document.getElementById("ea").checked,
        "soz" : document.getElementById("soz").checked,

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

/*

const input = document.querySelector("input");



input.addEventListener("input", event => {

    console.log(input.value);

    let data = {"val" : input.value.turkishToUpper()};

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

        //onsole.log(data);
        createNode(data);

    });

})

*/

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


    //console.log(list);

    



    for(let i=0; i<data.length; i++)
    {

        let row = document.createElement("tr");
        let uni = document.createElement("td");
        let bolum = document.createElement("td");
        let puan = document.createElement("td");
        let tur = document.createElement("td");

        uni.innerText = data[i].uni;
        bolum.innerText = data[i].bolum;
        puan.innerText = data[i].TabanPuan;
        tur.innerText = data[i].Tur;

        row.appendChild(uni), row.appendChild(bolum), row.appendChild(puan), row.appendChild(tur);
        document.querySelector("table").appendChild(row);


        /*
        let node = document.createElement("li");
        node.innerText = data[i].uni + " " + data[i].bolum;
        list.appendChild(node);
        */
    }

}
