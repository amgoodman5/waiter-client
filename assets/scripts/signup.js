const SERVER_URL = getUrl1();
const CLIENT_URL = getUrl2();

$.ajaxSetup({
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    }
});

$(document).ready(function() {
    $("#signup-form").on("submit", function(event) {
        event.preventDefault();
        var userData = $(this).serialize();
        postNewUser(userData)
            .then((data) => {
                console.log(data);
                window.location.replace(`${CLIENT_URL}/dashboard.html`);
            });
    });
});

function postNewUser(formData) {
    console.log('try to post');
    return $.post(`${SERVER_URL}/authAPI/new`, formData);
}

function getUrl1() {
    if (window.location.host.indexOf('localhost') != -1) {
        return 'http://localhost:3000';
    } else {
        return 'https://line-waiter-db.herokuapp.com';
    }
};

function getUrl2() {
    if (window.location.host.indexOf('localhost') != -1) {
        return 'http://localhost:8080';
    } else {
        return 'https://line-waiter.firebaseapp.com';
    }
};
