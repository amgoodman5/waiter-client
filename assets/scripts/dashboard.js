const SERVER_URL = getUrl();


$(document).ready(function() {
    $('.collapse').collapse();
    getJob()
        .then(cleanData)
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

function getJob() {
    return $.get(`${SERVER_URL}/userAPI/request`);
}

function cleanData(data) {
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
        element.date = date;
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
    $('#active-job').html(html);
    // return user.id;

    endJob();
}

function endJob() {
    $('.end-job').on('click', function(event) {
        console.log(this.dataset.id);
        var jobObj = {
            id: this.dataset.id
        };
        $.ajax({
            url: `${SERVER_URL}/users/jobs`,
            method: "DELETE",
            data: jobObj,
            dataType: "application/json"
        });
    });
}

// function logOut(){
//   $('#log-out').on('click',function(event)=>{
//     $.get
//   })
// }
