/*
MIT License

Copyright (c) 2016 Ioan Loosley

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var oldjson;
var incbible = true;

function isOdd(num) { return num % 2;}
function tencheck(i){
if (i < 10) {i = "0" + i};
return i;
}

function uclock() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s =today.getSeconds();
    h = tencheck(h);
    m = tencheck(m);
    var colon = ":"
    if (isOdd(s) === 0) {colon = " "};
    document.getElementById('clock').innerHTML =
    h + colon + m;
    var t = setTimeout(uclock, 500);
}

function genboard() {
    var bibleitems = 0; 
    $.ajax({
        type: "POST",
        url: "/api/service/list",
        success: function(response) {
            var json_obj = response; //parse JSON
            if (JSON.stringify(json_obj) != oldjson) {
                var songoutput = "<div id='songs'><h1 id='title'>Songs</h1><br><div class='items'>";
                var bibleoutput = "<div id='bibles'><h1 id='title'>Readings</h1><br><div class='items'>";
                for (var i in json_obj.results.items) {
                    if (json_obj.results.items[i].plugin == "songs") {
                        var classes = json_obj.results.items[i].selected ? "sellected" : "";
                        songoutput += "<span class='item top " + classes + "'>" + json_obj.results.items[i].title + "</span><br>";
                    } else if (json_obj.results.items[i].plugin == "bibles" && incbible == true) {
                        var classes = json_obj.results.items[i].selected ? "sellected" : "";
			bibleitems += 1;
			var biblev = json_obj.results.items[i].title;
                        bibleoutput += "<span class='item " + classes + "'>" + biblev.substring(0, biblev.lastIndexOf(",") + 1).slice(0,-1) + "</span><br>";
                    }
                }
                songoutput += "</div></div>";
                bibleoutput += "</div></div>";
                output = songoutput + bibleoutput;
                $("#board").html(output);
                if (bibleitems == 0)
                {$("#bibles").addClass("hidden");}
                oldjson = JSON.stringify(json_obj);
            }
        }
    })
}

function doPoll() {
    genboard(); // process results here
    setTimeout(doPoll, 5000);
}
doPoll();
uclock();
