const CLIENT_URL = getUrl2();
const SERVER_URL = getUrl1();

$(document).ready(function() {
    $("#signin-form").on("submit", function(event) {
        event.preventDefault();
        var userData = $(this).serialize();
        console.log(userData);
        checkUser(userData)
            .then((data) => {
                console.log(data);
                window.location.replace(`${CLIENT_URL}/dashboard.html`);
            })
            // .catch(errorFunction);
    });
});



function checkUser(formData) {
    //error keeps triggering but it posts to db... is it because it is asynchronous?
    return $.post(`${SERVER_URL}/authAPI`, formData)
        //
        // .catch(function(error){
        //   console.log(error,'testttt');
        // });
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

function errorFunction(err) {
    if (err.status === 401) {
        window.location = '/signin.html';
    } else {
        console.log(err);
    }
}
