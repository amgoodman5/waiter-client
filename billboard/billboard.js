const JOB_URL = getUrl();

$(document).ready(()=>{
  getJob()
  .then((jobs)=>{
    jobs.forEach((job) => {
      console.log(job);

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
