//console.log(document.querySelector("#tyt-table").rows[1].cells[1]);

let tyt_table = document.querySelector("#tyt-table");

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

        console.log(d, y, net);

        tyt_table.rows[3].cells[i].innerHTML = net;

    }

});


function netHesapla()
{
    let tyt_table = document.querySelector("#tyt-table");
    for(let i=1; i<=3; i++) //columns
    {
        //console.log(document.querySelector("#tyt-table").rows[i].cells[i]);
        
        //row 1, row2 => row'3 e kaydet
        let d = parseInt(tyt_table.rows[1].cells[i]);
        let y = parseInt(tyt_table.rows[2].cells[i]);
        let net = d - y/4;

        console.log(d, y, net);
        
        tyt_table.rows[3].cells[i].innerHTML = net;
    }
}


