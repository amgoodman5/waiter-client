const SERVER_URL = getUrl();


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
        let now = moment(moment(), 'HH:mm');
        let start = moment(element.start_time, 'HH:mm');
        let duration = moment.duration(now - start).minutes();
        console.log(duration);
        if (duration > 0) {
            element.active_time = moment(moment(now, 'hh:mm:ss').diff(moment(element.start_time, 'hh:mm:ss'))).format('m');
        } else {
            element.active_time = "Not Started";
        }
        if (element.active_time != 'Not Started') {
            element.cost = element.active_time * 0.5;
        } else {
            element.cost = 0;
        }
        element.start_time = moment(element.start_time, 'hh:mm:ss').format('h:mma');
    });
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
    if (err.status === 401) {
      window.location = '/signin.html';
    } else {
      console.log(err);
    }
}
