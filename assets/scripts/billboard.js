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
    console.log(jobs)
    jobs.forEach((job) => {
      var card = `<div class = "billboard-card">
          <h4>Location: ${job.name}</h4>
          <h4>Address: ${job.address}</h4>
          <h4>Starts: ${job.start_time}</h4>
          <h4> <a href="#" class="card-link">WAIT UP!</a></div>`;
       $(".job_cards").append(card)
      });


  });

});


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
