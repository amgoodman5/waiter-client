const JOB_URL = getUrl();

$(document).ready(()=>{
  getJob()
  .then((jobs)=>{
    jobs.forEach((job) => {
      var card = `<div class = "billboard-card">
          <h4>Job: ${job.id}</h4> 
          <h4>Date: ${job.date}</h4>
          <h4>Time: ${job.time}</h4>
          <h4>Payout: $${job.rate}.00</h4>
          <h4>Starts: ${job.start_time}</h4>
          <h4> <a href="#" class="card-link">WAIT UP!</a></div>`;
       $(".job_cards").append(card)
      });


  });

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
  // $.get(JOB_URL).then(job =>{
  //   job.forEach((job) => {
  //     console.log(job);
  //   })
  //   getUrl()
  // })
