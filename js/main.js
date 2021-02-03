(()=>{
  let yOffset = 0;
  let prevScrollHeight = 0;
  let currentScene = 0;
  let enterNewScene = false;
  let acc = 0.07;
  let delayedYOffset = 0;
  let rafId;
  let rafState;


  const sceneInfo = [
    {
      //scene 0
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs:{
        container: document.querySelector("#scroll-section-0"),
        messageA: document.querySelector("#scroll-section-0 .main-message.a"),
        messageB: document.querySelector("#scroll-section-0 .main-message.b"),
        messageC: document.querySelector('#scroll-section-0 .main-message.c'),
        canvas: document.querySelector('#video-canvas-0'),
        context: document.querySelector('#video-canvas-0').getContext('2d'),
        videoImages: []
      },
      values:{
        videoImageCount: 87,
        imageSequence: [0,86],
        canvas_opacity: [1, 0.5, {
          start: 0.9,
          end: 1
        }],
        messageA_opacity_in: [0, 1, {
          start: 0.1,
          end: 0.2
        }],
        messageA_opacity_out: [1, 0, {
          start: 0.25,
          end: 0.35
        }],
        messageA_translateY_in: [20, 0, {
          start: 0.1,
          end: 0.2
        }],
        messageA_translateY_out: [0, -20, {
          start: 0.25,
          end: 0.35
        }],
        messageB_opacity_in: [0, 1, {
          start: 0.35,
          end: 0.45
        }],
        messageB_opacity_out: [1, 0, {
          start: 0.5,
          end: 0.6
        }],
        messageB_translateY_in: [20, 0, {
          start: 0.35,
          end: 0.45
        }],
        messageB_translateY_out: [0, -20, {
          start: 0.5,
          end: 0.6
        }],
        messageC_opacity_in: [0, 1, {
          start: 0.6,
          end: 0.7
        }],
        messageC_opacity_out: [1, 0, {
          start: 0.75,
          end: 0.85
        }],
        messageC_translateY_in: [20, 0, {
          start: 0.6,
          end: 0.7
        }],
        messageC_translateY_out: [0, -20, {
          start: 0.75,
          end: 0.85
        }]
      }
    //end of scene 0
    },
    {
      //scene 1
      type: 'normal',
      scrollHeight: 0,
      objs:{
        container: document.querySelector('#scroll-section-1')
      }
      //end of scene 1
    }
  ];

  function setLayout(){
    //type에 따라 scrollheight 조절
    for(let i = 0;i<sceneInfo.length; i++){
      if(sceneInfo[i].type === 'sticky'){
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
        console.log(`scrollHeight scene ${i} : ${sceneInfo[i].scrollHeight}`);
      }else if(sceneInfo[i].type === 'normal'){
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
        console.log(`scrollHeight scene ${i} : ${sceneInfo[i].scrollHeight}`);
      }
      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    //현재 scene 설정
    let totalScrollHeight = 0;
    for(let i = 0; i<sceneInfo.length; i++){
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if(totalScrollHeight>= pageYOffset){
        currentScene = i;
        break;
      }
    }
    document.body.setAttribute('id', `show-scene-${currentScene}`);

    //window 비율에 따라 canvas 이동 및 스케일 조정
    const heightRatio = window.innerHeight / 1080;
    sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
  }

  //objs에 이미지 로드
  function setCanvasImages(){
    let imgElem;
    for(let i=0; i<sceneInfo[0].values.videoImageCount;i++){
        imgElem = new Image();
        imgElem.src = `images/${i+1}.png`;
        sceneInfo[0].objs.videoImages.push(imgElem);
    }
    console.log('Image Load on canvas: OK');
  }



  function calcValues(values, currentYOffset){
    let rv;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    if(values.length === 3){

      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if(currentYOffset >= partScrollStart && currentYOffset <=partScrollEnd){
        rv = (currentYOffset - partScrollStart) / partScrollHeight *(values[1] - values[0]) + values[0];
      }else if(currentYOffset <=partScrollStart){
        rv = values[0];
      }else if(currentYOffset >=partScrollEnd){
        rv = values[1];
      }
    }else{
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }

    return rv;
  }

  function playAnimation(){
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    //현재 씬에서의 스크롤 높이
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;


    switch (currentScene) {
      case 0:
        console.log('currentScene: 0');
        objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
        if(scrollRatio <= 0.22){
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
          objs.messageA.style.transform = `translate3d(0,${calcValues(values.messageA_translateY_in, currentYOffset)}%,0)`;
        } else{
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
          objs.messageA.style.transform = `translate3d(0,${calcValues(values.messageA_translateY_out, currentYOffset)}%,0)`;
        }

        if(scrollRatio <= 0.42){
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in,currentYOffset)}%,0)`;
        }else{
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out,currentYOffset)}%,0)`;
        }

        if(scrollRatio <= 0.72){
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in,currentYOffset)}%,0)`;
        }else{
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out,currentYOffset)}%,0)`;
        }
        break;
      case 1:
      console.log('currentScene: 1');
        break;
    }
  }

  function loop(){
    delayedYOffset = delayedYOffset + (yOffset - delayedYOffset)*acc;
    // console.log(`delayedYOffset: ${Math.round(delayedYOffset)}`);
    // console.log(`yOffset: ${yOffset}`);

    if(!enterNewScene){

      if(currentScene === 0){
        const currentYOffset = delayedYOffset - prevScrollHeight;
        const values = sceneInfo[currentScene].values;
        const objs = sceneInfo[currentScene].objs;
        let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));

        if(objs.videoImages[sequence]){
          objs.context.clearRect(0, 0, objs.canvas.width, objs.canvas.height);
          objs.context.drawImage(objs.videoImages[sequence],0,0);
        }
      }
    }

    rafId = requestAnimationFrame(loop);

    if (Math.abs(yOffset - delayedYOffset) < 1) {
      cancelAnimationFrame(rafId);
      rafState = false;
    }
  }

  function scrollLoop(){
    enterNewScene = false;
    prevScrollHeight = 0;

    for(let i = 0;i<currentScene;i++){
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }
    //다음씬으로 넘어갈 경우

    if(delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){
      enterNewScene = true;
      currentScene++;
      document.body.setAttribute('id',`show-scene-${currentScene}`);
      console.log(`now, you r in scene${currentScene}`);
    }
    //이전씬으로 돌아갈 경우
    if(delayedYOffset < prevScrollHeight){
      enterNewScene = true;
      if( currentScene === 0) return;
      currentScene--;
      document.body.setAttribute('id',`show-scene-${currentScene}`);
      console.log(`now, you r in scene${currentScene}`);
    }

    if(enterNewScene) return;

    playAnimation();
  }

  window.addEventListener('load', () => {

    setLayout();
    sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);

    window.addEventListener('scroll', ()=>{
      yOffset = window.pageYOffset;
      scrollLoop();

      if (!rafState) {
        rafId = requestAnimationFrame(loop);
        rafState = true;
      }
    });

    window.addEventListener('resize', ()=>{
      if(window.innerWidth > 900){
        setLayout();
      }
    });

    window.addEventListener('orientationchange',()=>{
      setTimeout(setLayout, 500);
    });


  });

  setCanvasImages();



})();
