var ip = "192.168.1.21:4316"
var oldjson;

function genboard() {
    $.ajax({
        type: "POST",
        url: "/api/service/list",
        success: function(response) {
            console.log(response);


            var json_obj = response; //parse JSON
            if (JSON.stringify(json_obj) != oldjson) {
                var songoutput = "<div id='songs'><h1 id='title'>Songs</h1><br><div class='items'>";
                var bibleoutput = "<div id='bibles'><h1 id='title'>Readings</h1><br><div class='items'>";
                for (var i in json_obj.results.items) {
                    if (json_obj.results.items[i].plugin == "songs") {
                        var classes = json_obj.results.items[i].selected ? "sellected" : "";
                        songoutput += "<span class='item top " + classes + "'>" + json_obj.results.items[i].title + "</span><br>";
                    } else if (json_obj.results.items[i].plugin == "bibles") {
                        var classes = json_obj.results.items[i].selected ? "sellected" : "";
                        bibleoutput += "<span class='item " + classes + "'>" + json_obj.results.items[i].title.split(", ")[0] + "</span><br>";
                    }

                }
                songoutput += "</div></div>";
                bibleoutput += "</div></div>";
                output = songoutput + bibleoutput;
                $("#board").html(output);
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
