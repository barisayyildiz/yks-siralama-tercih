//console.log(document.querySelector("#tyt-table").rows[1].cells[1]);

let tyt_table = document.querySelector("#tyt-table");
let ayt_table = document.querySelector("#ayt-table")

document.querySelector("#tyt-table").addEventListener("input", e => {
    
    //console.log(e.target.value);
    //console.log(tyt_table.rows[1].cells[1].childNodes[1].value);

    for(let i=1; i<=4; i++)
    {
        let d = parseInt(tyt_table.rows[1].cells[i].childNodes[1].value);
        d = isNaN(d) ? 0 : d;
        let y = parseInt(tyt_table.rows[2].cells[i].childNodes[1].value);
        y = isNaN(y) ? 0 : y;
        let net = d - y/4;

        //console.log(d, y, net);
        //console.log(tyt_table.rows[3].cells[i].childNodes[1]);

        tyt_table.rows[3].cells[i].childNodes[1].value = net;
        tyt_table.rows[3].cells[i].childNodes[1].innerHTML = net;

        

    }

});

document.querySelector("#ayt-table").addEventListener("input", e => {
    
    //console.log(e.target.value);
    //console.log(tyt_table.rows[1].cells[1].childNodes[1].value);

    for(let i=1; i<=7; i++)
    {
        let d = parseInt(ayt_table.rows[1].cells[i].childNodes[1].value);
        d = isNaN(d) ? 0 : d;
        let y = parseInt(ayt_table.rows[2].cells[i].childNodes[1].value);
        y = isNaN(y) ? 0 : y;
        let net = d - y/4;

        console.log(d, y, net);

        ayt_table.rows[3].cells[i].childNodes[1].value = net;
        ayt_table.rows[3].cells[i].childNodes[1].innerHTML = net;
        

    }

});

