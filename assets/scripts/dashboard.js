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
        .then(appendJob);
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
    });
    return cleanArr;
}

function appendInLineJob(clean) {
    console.log(clean);
    clean.forEach(function(element) {
        if (element.status === 'Waiting') {
            console.log(true);
        }
        console.log(element.status);
    })
    return clean;
}

function appendJob(clean) {
    noJobs(clean)
    let source = $('#job-template').html();
    let template = Handlebars.compile(source);
    let context = {
        clean
    };
    let html = template(context);
    $('#jobs').html(html);
    // return user.id;

    endJob();
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
