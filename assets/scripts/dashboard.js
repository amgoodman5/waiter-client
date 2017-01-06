const SERVER_URL = getUrl();

$.ajaxSetup({
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    }
});

$(document).ready(function() {
    $('.collapse').collapse();
    getJob()
        .then(cleanData)
        .then(appendJob)
        .catch(errorFunction);
});

function getUrl() {
    if (window.location.host.indexOf('localhost') != -1) {
        return 'http://localhost:3000';
    } else {
        return 'https://line-waiter-db.herokuapp.com';
    }
}

function getJob() {
    return $.get(`${SERVER_URL}/userAPI/job`);
}

function cleanData(data) {
    let cleanArr = data;
    cleanArr.forEach(function(element) {
        let date = moment(element.date).format('MM-DD-YYYY')
        let start = moment(element.start_time, 'hh:mm:ss').format('hh:mm');
        let datetime = moment(`${date} ${start}`, 'MM-DD-YYYY hh:mm');
        let now = moment(moment(), 'MM-DD-YYYY hh:mm', 'MM-DD-YYYY hh:mm');
        let duration = moment.duration(now - datetime);
        console.log(duration);
        let durationClean = moment(duration._data).format("h[h] m[m]")
        if (duration > 0) {
            element.active_time = durationClean;
        } else {
            element.active_time = "Not Started";
        }
        if (element.active_time != 'Not Started') {
            element.cost = duration._milliseconds / 60000 * 0.1;
        } else {
            element.cost = 0;
        }
        element.start_time = moment(element.start_time, 'hh:mm:ss').format('h:mma');
        element.date = date;
    });
    return cleanArr;
}

function appendJob(clean) {
    // console.log(clean);
    let source = $('#job-template').html();
    let template = Handlebars.compile(source);
    let context = {
        clean
    };
    let html = template(context);
    $('.accordion-job').html(html);
    // return user.id;
}

function errorFunction(err) {
    console.log('error', err);
}
