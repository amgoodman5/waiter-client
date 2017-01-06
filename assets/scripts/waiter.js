// const SERVER_URL = getUrl();

// $.ajaxSetup({
//     crossDomain: true,
//     xhrFields: {
//         withCredentials: true
//     }
// });

$(document).ready(function() {
    $('.collapse').collapse();
    // getJob()
    //     .then(appendJob)
    //     .catch(errorFunction);
});

// function getUrl() {
//     if (window.location.host.indexOf('localhost') != -1) {
//         return 'http://localhost:3000';
//     } else {
//         return 'https://line-waiter-db.herokuapp.com';
//     }
// }
//
// function getJob() {
//     return $.get(`${SERVER_URL}/userAPI/1/job`);
// }
//
// function appendJob(data) {
//     console.log(data);
//     let source = $('#job-template').html();
//     let template = Handlebars.compile(source);
//     let context = {
//         data
//     };
//     let html = template(context);
//     $('.accordion-job').html(html);
//     // return user.id;
// }
//
// function errorFunction() {
//     alert('An Error Occured');
// }
