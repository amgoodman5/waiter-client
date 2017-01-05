const SERVER_URL = getUrl();

$( document ).ready(function() {
  $( "#signup-form" ).on( "submit", function( event ) {
    event.preventDefault();
    var userData = $( this ).serialize()
    postNewUser(userData);
  });
});

function postNewUser(formData){
  //error keeps triggering but it posts to db... is it because it is asynchronous?
  var request = $.ajax({
    url: `${SERVER_URL}/users`,
    method: 'POST',
    data: formData,
    dataType: 'application/json',
    success:function(msg){
      console.log(msg);
      console.log('done!');
    },
    error:function(msg){
      console.log('error!');
      console.log(msg);
    }
  });
}

function getUrl(){
  if (window.location.host.indexOf('localhost') != -1) {
    return 'http://localhost:3000';
  } else {
    return 'https://line-waiter-db.herokuapp.com';
  }
};
