document.getElementById('number').onkeypress = function (e) {
    e = e || event;
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    var chr = getChar(e);
    if (chr == null) return;
    if (chr < '0' || chr > '9') {
        return false;
    }

    function getChar(event) {
        if (event.which == null) {
            if (event.keyCode < 32) return null;
            return String.fromCharCode(event.keyCode)
        }
        if (event.which != 0 && event.charCode != 0) {
            if (event.which < 32) return null;
            return String.fromCharCode(event.which)
        }
        return null;
    }
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}



function flights(type) {
    let url,
        xhttp = new XMLHttpRequest(),
        proxy = "https://cors-anywhere.herokuapp.com/",
        path = "https://api.rasp.yandex.net/v3.0/schedule/?",
        key = "apikey=8032855d-42ac-4830-ac06-c82eeb7974e9",
        date = formatDate(new Date),
        limit = "limit=2500",
        event = "event=" + type,
        station = "station=s9600213";// Шереметьево
    url = proxy + path + key + "&" + station + "&" + limit + "&" + date + "&" + event;
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (Object.getOwnPropertyNames(object).length === 0) {
                object = JSON.parse(this.responseText);
                switch (type) {
                    case 'arrival':
                        objArrival = object.schedule;
                        break;
                    default:
                        objDepart = object.schedule;
                }
            } else {
                object = JSON.parse(this.responseText);
                switch (type) {
                    case 'arrival':
                        objArrival = object.schedule;
                        break;
                    default:
                        objDepart = object.schedule;
                }
                objAll = objDepart.concat(objArrival);
                parseFlights(objAll);
                document.getElementById('preloader').style.display = "none";
            }



        }

    }
    xhttp.open("GET", url, true);
    xhttp.send();
}

function parseFlights(object, number, title) {
    document.getElementById("table").innerHTML = "";
    for (let i = 0; i < object.length; i++) {
        if (number && !object[i].thread.number.includes(number)) { continue }
        if (title && !object[i].thread.title.toLowerCase().includes(title)) { continue }
        if (flightsDelay == true && object[i].is_fuzzy == false) { continue }
        let tr = document.createElement('tr'),
            td1 = "<td>" + object[i].thread.number + "</td>",
            td2 = "<td>" + object[i].thread.title + "</td>",
            td3 = "<td>" + object[i].departure + "</td>",
            td4 = "<td>" + object[i].arrival + "</td>";
        // td5 = "<td>" + object[i].days + "</td>";
        tr.innerHTML = td1 + td2 + td3 + td4;

        document.getElementById("table").append(tr);
    }
}

function switchType() {
    type = document.getElementById('selectType').value;
    number = document.getElementById('number').value.toString();
    title = document.getElementById('title').value.toLowerCase();
    flightsDelay = false;
    switch (type) {
        case 'arrival':
            object = objArrival;
            break;
        case 'departure':
            object = objDepart;
            break;
        case 'delayed':
            flightsDelay = true;

        default:
            object = objAll;
    }

    parseFlights(object, number, title);
}


let object = {},
    type,
    number,
    title,
    flightsDelay,
    objDepart,
    objArrival,
    objAll;

flights('departure');
flights('arrival');

document.getElementById('selectType').addEventListener('change', function () {
    switchType();
});

document.getElementById('number').addEventListener('input', function () {
    switchType();
});
document.getElementById('title').addEventListener('input', function () {
    switchType();
});

