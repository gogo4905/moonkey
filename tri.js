

(function(){

  const stageElem = document.querySelector('.stage');
  let maxScrollValue = document.body.offsetHeight- window.innerHeight;
  window.addEventListener('scroll', function(){
    let zMove = pageYOffset/maxScrollValue * 980 + 540;
    stageElem.style.transform = 'translateZ('+ zMove +'vw)';

  });

})();
