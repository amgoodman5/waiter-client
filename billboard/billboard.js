const JOB_URL = getUrl();

$(document).ready(()=>{
  getJob()
  .then((jobs)=>{
    jobs.forEach((job) => {
      $(".container").append(`<h4>${job.id}</h4> <h4>${job.date}</h4> <h4>${job.time}</h4> <h4>$${job.rate}</h4>`)
      });
      // `<div class="card-block" <h4 class="card-title" ${result.name}</h4> <p class="card-text"></p> `;
      //   $('.collection').append(menu);

      //
      // <img class="card-img-top" src="..." alt="Card image cap">
      // <div class="card-block">
      //   <h4 class="card-title"></h4>
      //   <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
      //   <a href="#" class="btn btn-primary">Go somewhere</a>


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
