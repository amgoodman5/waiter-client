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

function appendJob(data) {
    console.log(data);
    let now = moment();
    // let newDate = moment('2013-11-16', 'YYYY-MM-DD').format('MM-YYYY');
    let source = $('#job-template').html();
    let template = Handlebars.compile(source);
    let context = {
        data
    };
    let html = template(context);
    $('.accordion-job').html(html);
    // return user.id;
}

function errorFunction(err) {
    console.log('error', err);
}
