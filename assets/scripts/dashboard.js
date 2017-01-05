const SERVER_URL = getUrl();

$(document).ready(function() {
  $('.collapse').collapse();
  getJob()
    .then((data)=>{
      console.log(data);
    });
});

function getUrl(){
  if (window.location.host.indexOf('localhost') != -1) {
    return 'http://localhost:3000';
  } else {
    return 'https://line-waiter-db.herokuapp.com';
  }
};

function getJob(){
  return $.get(`${SERVER_URL}/userAPI/1/job`);
}
