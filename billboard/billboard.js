const JOB_URL = getUrl();

$(document).ready(()=>{
  getJob();
});

function getJob(){
  return $.get(`${JOB_URL}/api`)
}
function getUrl(){
  if (window.location.host.indexOf('localhost') != -1) {
    return 'http://localhost:3000';
  } else {
    return 'https://line-waiter-db.herokuapp.com';
  }
};
