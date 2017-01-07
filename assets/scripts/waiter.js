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

        $.ajax({
            url: `${SERVER_URL}/users/jobs`,
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

function logOut(){
  $('#log-out').on('click',function(event){
    event.preventDefault();
    $.get(`${SERVER_URL}/authAPI/logout`)
    .then(()=>{
      return window.location.replace(`${CLIENT_URL}`);
    });
  });
}
