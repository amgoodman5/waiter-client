const SERVER_URL = getUrl1();
const CLIENT_URL = getUrl2();

$(document).ready(function() {
    $("#signup-form").on("submit", function(event) {
        event.preventDefault();
        var userData = $(this).serialize();
        postNewUser(userData)
            .then((data) => {
                window.location.replace(`${CLIENT_URL}/dashboard.html`);
            });
    });
});

function postNewUser(formData) {
    return $.post(`${SERVER_URL}/authAPI/new`, formData);
}

function getUrl1() {
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
