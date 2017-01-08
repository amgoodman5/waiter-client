const SERVER_URL = getUrl();
const CLIENT_URL = getUrl2();

$.ajaxSetup({
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    }
});

$(document).ready(function() {
    let cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)userName\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    $('#user-job').html(`${cookieValue}'s Jobs`);
    updateStatus();
    $('.collapse').collapse();
    logOut();
    getJob()
        .then(cleanData)
        .then(appendJob);
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

    let cleanArr = data;
    cleanArr.forEach(function(element) {
        let phoneform = formatPhoneNumber(element.waiter.phone_number);
        let date = moment(element.date).format('MM-DD-YYYY');
        element.postdate = moment(date).format('MMM-DD');
        let start = moment(element.start_time, 'H:mm:ss').format('H:mm');
        let datetime = moment(`${date} ${start}`, 'MM-DD-YYYY H:mm');
        let now = moment(moment(), 'MM-DD-YYYY hh:mm', 'MM-DD-YYYY H:mm');
        let duration = moment.duration(now - datetime);
        let durationClean = moment(duration._data).format("H[h] m[m]");
        if (duration > 0) {
            element.active_time = durationClean;
        } else {
            element.active_time = "Not Started";
        }
        if (element.active_time != 'Not Started') {
            let cost = duration._milliseconds / 60000 * 0.1;
            element.cost = cost.toFixed(2);
        } else {
            element.cost = 0;
        }
        element.start_time = moment(element.start_time, 'H:mm:ss').format('h:mma');
        element.time = moment(element.time, 'H:mm').format('h:mma');
        element.date = date;
        element.waiter.phone_number = phoneform;
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

    updateStatus();
    totalWait();
}

function updateStatus() {
    $('.select-list').on('change', function(event) {
        let jobID = $(this).find("option:selected").data('id');
        let selected = $(this).find("option:selected").html();
        let timestamp = moment().format('MM-DD-YYYY HH:mm');
        console.log(jobID);
        console.log(selected);
        console.log(timestamp);

        let jobObj = {
            id: jobID,
            status: selected,
            starting_time: timestamp
        };
        console.log(jobObj)
        $.ajax({
            url: `${SERVER_URL}/waiterAPI/jobs`,
            method: "PUT",
            data: jobObj,
            dataType: "application/json"
        });
    });
}



function totalWait() {
    $('#wait-input').on('change', function(event) {
        let jobID = this.dataset.id
        let total = $('#wait-input').val();
        console.log(total);
        let jobObj = {
            id: jobID,
            totalWait: total
        };
    });
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

function formatPhoneNumber(str) {
    var str2 = ("" + str).replace(/\D/g, '');
    var m = str2.match(/^(\d{3})(\d{3})(\d{4})$/);
    return (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
}
