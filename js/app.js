(function(){
    var url = 'https://api.football-data.org/v2/competitions/2021/standings';

    if('caches' in window){
        caches.match(url).then((response) => response.json())
        .then(function (data) {
            console.log(data.standings[0].table);
            var txt = "";
            var standings = data.standings[0].table;
            for (x in standings) {
                txt += "<tr><td>" + standings[x].position + "</td><td>" + standings[x].team.name + "</td><td>" + standings[x].playedGames + "</td><td>" + standings[x].won + "</td><td>" + standings[x].draw + "</td><td>" + standings[x].lost + "</td><td>" + standings[x].points + "</td><td>" + standings[x].goalDifference + "</td></tr >"
            }
            document.getElementById("tablebody").innerHTML = txt;
        })
    }

    fetch('https://api.football-data.org/v2/competitions/2021/standings', {
        headers:{
            'X-Auth-Token': 'a75aa1e62d6c4c87bd9fc71f7de21358'
        }
    })
    .then((response) =>response.json())
    .then(function(data){
        console.log(data.standings[0].table);
        var txt = "";
        var standings = data.standings[0].table;
        for(x in standings){
            txt += "<tr><td>" + standings[x].position + "</td><td>" + standings[x].team.name + "</td><td>" + standings[x].playedGames + "</td><td>" + standings[x].won + "</td><td>" + standings[x].draw + "</td><td>" + standings[x].lost + "</td><td>" + standings[x].points + "</td><td>" + standings[x].goalDifference +"</td></tr >"
        }
        document.getElementById("tablebody").innerHTML = txt;
    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./sw.js')
            .then(function () { console.log('Service Worker Registered'); });
    }
})();