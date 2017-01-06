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
        element.start_time = moment(element.start_time, 'hh:mm:ss').format('h:mma');
        console.log(element.start_time);
    });
    // console.log(cleanArr);
    return cleanArr;
}

function appendJob(clean) {
    console.log(clean);
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
