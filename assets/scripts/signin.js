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
  $.post('http://localhost:3000/userAPI',formData)
  .then((data)=>{
    window.location.replace("http://localhost:8080");
    console.log(data);
  });
}
