const JOB_URL = getUrl();

$.ajaxSetup({
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    }
});

$(document).ready(()=>{
  getJob()
  .then((jobs)=>{

    jobs.forEach((job) => {
      var card = `<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="false">
      <div class="panel panel-default"> <div class="panel-heading" role="tab" id="headingOne">
       <h4 class="panel-title"> <a role="button" data-toggle="collapse" data-parent="#accordion" href="${job.id}" aria-expanded="false" aria-controls="collapseOne">
       <h4>Location: ${job.name}</a></h4></div>
      <div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="${job.id}">
      <div class="panel-body">  <h4>Address: ${job.address}</h4><h4>Starts: ${job.start_time}</h4>
      <h4> <a href="#" class="card-link">WAIT UP!</a></div> <div class="panel-body">  </div>  </div></div>`;



       $(".job_cards").append(card)
      });
  });
});

//     <div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">

function getJob(){
  return $.get(`${JOB_URL}/users/jobs`)
}
function getUrl(){
  if (window.location.host.indexOf('localhost') != -1) {
    return 'http://localhost:3000';
  } else {
    return 'https://line-waiter-db.herokuapp.com';
  }
};
  // $.get(JOB_URL).then(job =>{
  //   job.forEach((job) => {
  //     console.log(job);
  //   })
  //   getUrl()
  // })
