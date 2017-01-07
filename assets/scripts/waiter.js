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
        // .catch(errorFunction);
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
    let source = $('#job-template').html();
    let template = Handlebars.compile(source);
    let context = {
        clean
    };
    let html = template(context);
    $('.accordion-job').html(html);
    // return user.id;

    updateStatus()
}

function updateStatus() {
    $('.select-list').on('change', function(event) {
        let jobID = $(this).find("option:selected").data('id');
        let selected = $(this).find("option:selected").html();
        console.log(jobID);
        let jobObj = {
            id: jobID,
            status: selected
        };

        $.ajax({
            url: `${SERVER_URL}/users/jobs`,
            method: "PUT",
            data: jobObj,
            dataType: "application/json"
        });
    });
}


function errorFunction(err) {
    console.log('error', err);
}
