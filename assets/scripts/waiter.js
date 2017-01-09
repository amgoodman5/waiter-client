const SERVER_URL = getUrl();
const CLIENT_URL = getUrl2();

$.ajaxSetup({
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    }
});

$(document).ready(function() {
    $('.collapse').collapse();
    getUserName();
    updateStatus();
    logOut();
    getJob()
        .then(cleanData)
        .then(appendInLineJob)
        .then(appendAcceptedJob)
        .then(appendCompletedJob);
    // .catch(errorFunction);
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
    return $.get(`${SERVER_URL}/userAPI/job`);
}

function cleanData(data) {
    console.log(data);
    noJobs(data)
    let cleanArr = data;
    cleanArr.forEach(function(element) {
        let now = moment(moment(), 'ISO_8601').format('MM-DD-YYYY HH:mm');
        let date = moment(element.date, 'ISO_8601').format('MM-DD-YYYY');
        element.now = date;
        let start = moment(element.start_time, 'HH:mm:ss').format('HH:mm');
        let end = moment(`${date} ${element.end_time}`).format('MM-DD-YYYY HH:mm');
        let datetime = moment(`${date} ${element.start_time}`).format('MM-DD-YYYY HH:mm');
        let nowDur = moment(now);
        let nowDur2 = moment(end);
        let datetimeDur = moment(datetime);
        let duration = nowDur.diff(datetime, 'seconds');
        let duration2 = nowDur2.diff(datetime, 'seconds');
        let newEffort = moment.duration(nowDur - datetimeDur);
        let endEffort = moment.duration(nowDur2 - datetimeDur);
        let durationClean = moment(newEffort._data).format("H[h] m[m]");
        let endDurationClean = moment(endEffort._data).format("H[h] m[m]");
        if (duration > 0) {
            if (element.status === 'Completed') {
                element.active_time = endDurationClean;
            } else if (element.status === 'Accepted') {
                element.active_time = 'Not Started';
            } else {
                element.active_time = durationClean;
            }
        } else {
            element.active_time = 'Not Started';
        }
        if (element.active_time != 'Not Started') {
            if (element.status === 'Completed') {
                let cost = (duration2 * 0.0033).toFixed(2);
                element.cost = cost;
            } else {
                let cost = (duration * 0.0033).toFixed(2);
                element.cost = cost;
            }
        } else {
            element.cost = 0;
        }
        element.start_time = moment(element.start_time, 'H:mm:ss').format('h:mma');
        element.time = moment(element.time, 'H:mm').format('h:mma');
        element.date = moment(date).format('MMM-D');
        let phoneform = formatPhoneNumber(element);
        if (element.waiter_id) {
            element.waiter.phone_number = phoneform;
        }
        if (element.status === 'Waiting') {
            element.waiting = true;
            element.completed = false;
            element.accepted = false;
        } else if (element.status === 'Completed') {
            element.waiting = false;
            element.completed = true;
            element.accepted = false;
        } else {
            element.waiting = false;
            element.completed = false;
            element.accepted = true;
        }
    });
    return cleanArr;
}

function appendInLineJob(data) {
    let clean = [];
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
    updateStatus();
    return data;
}

function appendCompletedJob(data) {
    let clean = [];
    data.forEach(function(element) {
        if (element.status === 'Completed') {
            element.start_time = element.end_time;
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
                window.location.replace(`${CLIENT_URL}/waiter.html`);
            }
        });
    });
}

function updateStatus() {
    $('.select-list').on('change', function(event) {
        console.log('running');
        let jobID = $(this).find("option:selected").data('id');
        let selected = $(this).find("option:selected").html();
        let timestamp = moment().format('MM-DD-YYYY HH:mm');
        let jobObj = {
            id: jobID,
            status: selected,
            starting_time: timestamp
        };
        $.post(`${SERVER_URL}/emailAPI`, jobObj);
        $.ajax({
            url: `${SERVER_URL}/waiterAPI/jobs`,
            method: "PUT",
            data: jobObj,
            dataType: "application/json"
        }).done(function(result) {
            console.log('hello');
            location.reload();
        })
    });
}

function noJobs(clean) {
    if (clean.length === 0) {
        $('.no-job').append(`<h1 class="nojob">No Current Jobs</h1>`);
    } else {
        $('.no-job').empty();
    }
}

function errorFunction(err) {
    console.log('error', err);
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

function formatPhoneNumber(element) {
    if (element.waiter_id) {
        var str2 = ("" + element.waiter.phone_number).replace(/\D/g, '');
        var m = str2.match(/^(\d{3})(\d{3})(\d{4})$/);
        return (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
    } else {
        return 'No Number Listed';
    }
}

function getUserName() {
    $.get(`${SERVER_URL}/userAPI`)
        .then((data) => {
            return $('#user-job').html(`${data[0].fname}'s Jobs`);
        });
}
