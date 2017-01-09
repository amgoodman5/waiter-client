const SERVER_URL = getUrl();
const CLIENT_URL = getUrl2();

$(document).ready(function() {
    console.log(document.cookie);
    let cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)userName\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    $('#user-name').html(`${cookieValue}'s Requests`);
    $('.collapse').collapse();
    logOut();
    getJob()
        .then(cleanData)
        .then(appendInLineJob)
        .then(appendAcceptedJob)
        .then(appendRequestedJob)
        .then(appendCompletedJob);
    // .catch(errorFunction);
    endJob()
});

function getUrl() {
    if (window.location.host.indexOf('localhost') != -1) {
        return 'http://localhost:3000';
    } else {
        return 'https://line-waiter-db.herokuapp.com';
    }
}

function getUrl2() {
    if (window.location.host.indexOf('localhost') != -1) {
        return 'http://localhost:8080';
    } else {
        return 'https://line-waiter.firebaseapp.com';
    }
}

function getJob() {
    return $.get(`${SERVER_URL}/userAPI/request`);
}

function cleanData(data) {
    console.log(data);

    let cleanArr = data;
    cleanArr.forEach(function(element) {
        // let phoneform = formatPhoneNumber(element.waiter.phone_number);
        let now = moment(moment(), 'ISO_8601').format('MM-DD-YYYY HH:mm');
        let date = moment(element.date, 'ISO_8601').format('MM-DD-YYYY');
        let start = moment(element.start_time, 'HH:MM:SS').format('HH:MM');
        let datetime = moment(`${date} ${element.start_time}`).format('MM-DD-YYYY HH:mm');
        let nowDur = moment(now);
        let datetimeDur = moment(datetime);
        let duration = nowDur.diff(datetime, 'minutes');
        let duration2 = nowDur.diff(datetime);
        let newEffort = moment.duration(nowDur - datetimeDur);
        console.log(newEffort);
        let durationClean = moment(newEffort._data).format("H[h] m[m]");
        console.log(durationClean);
        if (duration > 0) {
            element.active_time = durationClean;
        } else {
            element.active_time = "Not Started";
        }
        if (element.active_time != 'Not Started') {
            let cost = (duration * .2).toFixed(2);
            element.cost = cost;
        } else {
            element.cost = 0;
        }
        element.start_time = moment(element.start_time, 'H:mm:ss').format('h:mma');
        element.time = moment(element.time, 'H:mm').format('h:mma');
        element.date = date;
        // element.waiter.phone_number = phoneform;
    });
    return cleanArr;
}

function appendInLineJob(data) {
    let clean = [];
    noJobs(data)
    data.forEach(function(element) {
        if (element.status === 'Waiting') {
            clean.push(element)
        }
    });
    let source = $('#job-template').html();
    let template = Handlebars.compile(source);
    let context = {
        clean
    };
    console.log(context);
    let html = template(context);
    $('#waiting-job').html(html);

    endJob();
    return data;
}

function appendAcceptedJob(data) {
    noJobs(data)
    let clean = [];
    data.forEach(function(element) {
        if (element.status === 'Accepted') {
            clean.push(element)
        }
    });
    let source = $('#job-template').html();
    let template = Handlebars.compile(source);
    let context = {
        clean
    };
    let html = template(context);
    $('#accepted-job').html(html);
    endJob();
    return data;
}

function appendRequestedJob(data) {
    noJobs(data)
    let clean = [];
    data.forEach(function(element) {
        if (element.status === 'Requested') {
            clean.push(element)
        }
    });
    let source = $('#job-template').html();
    let template = Handlebars.compile(source);
    let context = {
        clean
    };
    let html = template(context);
    $('#requested-job').html(html);
    endJob();
    return data;
}

function appendCompletedJob(data) {
    noJobs(data)
    let clean = [];
    data.forEach(function(element) {
        if (element.status === 'Completed') {
            clean.push(element)
        }
    });
    let source = $('#job-template').html();
    let template = Handlebars.compile(source);
    let context = {
        clean
    };
    let html = template(context);
    $('#completed-job').html(html);
    endJob();
    return data;
}

function endJob() {
    $('.end-job').on('click', function(event) {
        console.log(this.dataset.id);
        let timestamp = moment().format('MM-DD-YYYY HH:mm');
        var jobObj = {
            id: this.dataset.id,
            endtime: timestamp
        };
        $.ajax({
            url: `${SERVER_URL}/userAPI/job`,
            method: "DELETE",
            data: jobObj,
            dataType: "json",
            success: function() {
                window.location.replace(`${CLIENT_URL}/dashboard.html`);
            }
        });
    });
}

function noJobs(clean) {
    if (clean.length === 0) {
        console.log(false);
        $('.no-job').append(`<h1>No Current Requests</h1>`)
    } else {
        $('.no-job').empty()
    }
}

function logOut() {
    $('#log-out').on('click', function(event) {
        event.preventDefault();
        $.get(`${SERVER_URL}/authAPI/logout`)
            .then(() => {
                return window.location.replace(`${CLIENT_URL}`);
            });
    });
}

function formatPhoneNumber(str) {
    var str2 = ("" + str).replace(/\D/g, '');
    var m = str2.match(/^(\d{3})(\d{3})(\d{4})$/);
    return (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
}
