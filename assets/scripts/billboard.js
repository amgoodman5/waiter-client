const JOB_URL = getUrl();
const JOB_URL2 = getUrl1()

$.ajaxSetup({
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    }
});

$(document).ready(() => {
    getJob()
        .then((jobs) => {
            console.log(jobs);
            jobs.forEach((job) => {
var card = `<div id="accordion" role="tablist" aria-multiselectable="true">
            <div class="card"><div class="row" role="tab" id="card-header">
            <div class=" job-headers"><h2><a class="collapsed" data-toggle="collapse"
            data-target="#${job.id}" aria-expanded="false" aria-controls="collapseExample">
            <h4>${job.name}</h4></a>  <div class="collapse" id="${job.id}">
            <div class="card card-block"><div class="panel-body"><h4>Address: ${job.address}</h4>
            <h4>Starts: ${job.start_time}</h4><h4>Date: ${job.date}</h4>
            <button data-id="${job.id}"class="btn btn-warning card-link accept-button"
            type="submit">Accept Job</button></div>
             <div class="panel-body"></div>
            </div></div></div></div></div></div>`
                $(".job_cards").append(card)
            });



            $('.accept-button').on('click', function(event) {
                console.log(this.dataset.id);
                var jobObj = {
                    id: this.dataset.id
                };
                $.ajax({
                    url: `${JOB_URL}/users/jobs`,
                    method: "PUT",
                    data: jobObj,
                    dataType: "application/json"

                });
                  $.get(`${JOB_URL}/users/jobs`)
                 .then(()=> {
                    window.location.replace(`${JOB_URL2}/waiter.html`);
                }).catch(function(error) {
                    console.error(error);
                });
            })
        });
});
  


function getJob() {
    return $.get(`${JOB_URL}/users/jobs`)
}

function getUrl() {
    if (window.location.host.indexOf('localhost') != -1) {
        return 'http://localhost:3000';
    } else {
        return 'https://line-waiter-db.herokuapp.com';
    }
};
function getUrl1() {
    if (window.location.host.indexOf('localhost') != -1) {
        return 'http://localhost:8080';
    } else {
        return 'https://line-waiter.firebaseapp.com';
    }
}
