const CLIENT_URL = getUrl2();
const SERVER_URL = getUrl1();

$.ajaxSetup({
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    }
});

$( document ).ready(function() {
  $( "#signin-form" ).on( "submit", function( event ) {
    event.preventDefault();
    var userData = $( this ).serialize();
    console.log(userData);
    checkUser(userData);
  });
});



function checkUser(formData){
  //error keeps triggering but it posts to db... is it because it is asynchronous?
  $.post(`${SERVER_URL}/userAPI`,formData)
  .then((data)=>{
    // window.location.replace(`${CLIENT_URL}`);
    console.log(data);
  });
}

function getUrl1(){
  if (window.location.host.indexOf('localhost') != -1) {
    return 'http://localhost:3000';
  } else {
    return 'https://line-waiter-db.herokuapp.com';
  }
};
function getUrl2(){
  if (window.location.host.indexOf('localhost') != -1) {
    return 'http://localhost:8080';
  } else {
    return 'https://line-waiter.firebaseapp.com/';
  }
};
