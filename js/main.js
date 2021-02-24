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
      heightNum: 6,
      scrollHeight: 0,
      objs:{
        container: document.querySelector("#scroll-section-0"),
        messageA: document.querySelector("#scroll-section-0 .main-message"),
        messageB: document.querySelector("#scroll-section-0 .sub-message.a"),
        messageC: document.querySelector("#scroll-section-0 .sub-message.b"),
        circlePathA: document.querySelector('.circle-path.a circle'),
        circlePathB: document.querySelector('.circle-path.b circle'),
      },
      values:{
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
          start: 0.6,
          end: 0.7
        }],
        messageB_translateY_in: [20, 0, {
          start: 0.35,
          end: 0.45
        }],
        messageB_translateY_out: [0, -20, {
          start: 0.6,
          end: 0.7
        }],
        messageC_opacity_in: [0, 1, {
          start: 0.37,
          end: 0.47
        }],
        messageC_opacity_out: [1, 0, {
          start: 0.61,
          end: 0.71
        }],
        messageC_translateY_in: [20, 0, {
          start: 0.37,
          end: 0.47
        }],
        messageC_translateY_out: [0, -20, {
          start: 0.61,
          end: 0.71
        }],
        path_dashoffset_in: [2000, 0, {
          start: 0.05,
          end: 0.4
        }],
        path_dashoffset_out: [0, -2000, {
          start: 0.47,
          end: 0.8
        }],
        path2_dashoffset_in: [3200, 0, {
          start: 0.2,
          end: 0.47
        }],
        path2_dashoffset_out: [0, -3200, {
          start: 0.51,
          end: 0.8
        }]
      }
    //end of scene 0
    },
    {
      //scene 1
      type: 'sticky',
      scrollHeight: 0,
      heightNum:5,
      objs:{
        container: document.querySelector('#scroll-section-1'),
        works: document.querySelector('#scroll-section-1 .works-title'),
        titleA: document.querySelector('#scroll-section-1 .title.a'),
        titleB: document.querySelector('#scroll-section-1 .title.b'),
        canvas: document.querySelector('#scroll-section-1 #video-canvas'),
        background: document.querySelector('#scroll-section-1 .background-bk'),
        context: document.querySelector('#scroll-section-1 #video-canvas').getContext('2d'),
        videoImages: []
      },
      values:{
        videoImageCount: 100,
        imageSequence: [0,99,{
          start: 0.2,
          end: 0.8
        }],
        canvas_opacity_in: [0,1,{
          start:0.2,
          end: 0.6
        }],
        canvas_opacity_out: [1, 0, {
          start: 0.6,
          end: 0.8
        }],
        titleA_opacity_in: [0, 1, {
          start: 0.1,
          end: 0.3
        }],
        titleA_opacity_out: [1, 0, {
          start: 0.7,
          end: 0.9
        }],
        titleA_translateX_in: [10, 0,{
          start: 0.05,
          end:0.35
        }],
        titleA_translateX_out: [0, -50,{
          start: 0.65,
          end:0.9
        }],
        titleB_opacity_in: [0, 1, {
          start: 0.1,
          end: 0.3
        }],
        titleB_opacity_out: [1, 0, {
          start: 0.7,
          end: 0.9
        }],
        titleB_translateX_in: [-10, 0,{
          start: 0.05,
          end:0.35
        }],
        titleB_translateX_out: [0, 50,{
          start: 0.65,
          end:0.9
        }],
        bk_opacity_in: [0, 1, {
          start: 0,
          end: 0.2
        }],
        bk_opacity_out: [1, 0, {
          start: 0.8,
          end: 1
        }],
        bk_translateY_in: [window.innerHeight, 0, {
          start: 0,
          end: 0.2
        }],
        bk_translateY_out: [0, window.innerHeight, {
          start: 0.8,
          end: 1
        }]
      }
      //end of scene 1
    },
    {
      //scene 2
      type: 'sticky',
      scrollHeight: 0,
      heightNum: 5,
      objs:{
        container: document.querySelector('#scroll-section-2')
      }
      //end of scene 2
    },
    {
      //scene 3
      type: 'sticky',
      scrollHeight: 0,
      heightNum: 5,
      objs:{
        container: document.querySelector('#scroll-section-3')
      }
      //end of scene 3
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
    const heightRatio = window.innerHeight / 1080 *1.4;
    // sceneInfo[1].objs.canvas.style.transform = `translate3d(-50%, -40%,0) scale(${heightRatio})`;

    sceneInfo[0].objs.messageA.style.opacity = '0';
    sceneInfo[0].objs.messageB.style.opacity = '0';
    sceneInfo[0].objs.messageC.style.opacity = '0';
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
        console.log(`현재 씬 yOffset: ${currentYOffset} 전체 yOffset: ${yOffset}`);
        // objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
        if(scrollRatio <= 0.22){
          sceneInfo[0].objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
          sceneInfo[0].objs.messageA.style.transform = `translate3d(0,${calcValues(values.messageA_translateY_in, currentYOffset)}%,0)`;
        } else{
          sceneInfo[0].objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
          sceneInfo[0].objs.messageA.style.transform = `translate3d(0,${calcValues(values.messageA_translateY_out, currentYOffset)}%,0)`;
        }

        if(scrollRatio <= 0.49){
          sceneInfo[0].objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
          sceneInfo[0].objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in,currentYOffset)}%,0)`;
          sceneInfo[0].objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
          sceneInfo[0].objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in,currentYOffset)}%,0)`;
        }else{
          sceneInfo[0].objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
          sceneInfo[0].objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out,currentYOffset)}%,0)`;
          sceneInfo[0].objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
          sceneInfo[0].objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out,currentYOffset)}%,0)`;
        }

        if(scrollRatio <= 0.46){
          sceneInfo[0].objs.circlePathA.style.strokeDashoffset = calcValues(values.path_dashoffset_in, currentYOffset);
          sceneInfo[0].objs.circlePathB.style.strokeDashoffset = calcValues(values.path2_dashoffset_in, currentYOffset);

        }else{
          sceneInfo[0].objs.circlePathA.style.strokeDashoffset = calcValues(values.path_dashoffset_out, currentYOffset);
          sceneInfo[0].objs.circlePathB.style.strokeDashoffset = calcValues(values.path2_dashoffset_out, currentYOffset);
        }


        break;
      case 1:
      // console.log('currentScene: 1');
        if(scrollRatio < 0.5){
          sceneInfo[1].objs.canvas.style.opacity = calcValues(sceneInfo[1].values.canvas_opacity_in, currentYOffset);
          sceneInfo[1].objs.background.style.opacity = calcValues(sceneInfo[1].values.bk_opacity_in, currentYOffset);
          sceneInfo[1].objs.titleA.style.opacity = calcValues(sceneInfo[1].values.titleA_opacity_in,currentYOffset);
          sceneInfo[1].objs.titleB.style.opacity = calcValues(sceneInfo[1].values.titleB_opacity_in,currentYOffset);
          sceneInfo[1].objs.titleA.style.transform = `translate3d(${calcValues(sceneInfo[1].values.titleA_translateX_in,currentYOffset)}%,0,0)`;
          sceneInfo[1].objs.titleB.style.transform = `translate3d(${calcValues(sceneInfo[1].values.titleB_translateX_in,currentYOffset)}%,0,0)`;

        }else{

          sceneInfo[1].objs.canvas.style.opacity = calcValues(sceneInfo[1].values.canvas_opacity_out, currentYOffset);
          sceneInfo[1].objs.background.style.opacity = calcValues(sceneInfo[1].values.bk_opacity_out, currentYOffset);
          sceneInfo[1].objs.titleA.style.opacity = calcValues(sceneInfo[1].values.titleA_opacity_out,currentYOffset);
          sceneInfo[1].objs.titleB.style.opacity = calcValues(sceneInfo[1].values.titleB_opacity_out,currentYOffset);
          sceneInfo[1].objs.titleA.style.transform = `translate3d(${calcValues(sceneInfo[1].values.titleA_translateX_out,currentYOffset)}%,0,0)`;
          sceneInfo[1].objs.titleB.style.transform = `translate3d(${calcValues(sceneInfo[1].values.titleB_translateX_out,currentYOffset)}%,0,0)`;

        }

        // let sequence = Math.round(calcValues(sceneInfo[1].values.imageSequence, yOffset));
        // sceneInfo[1].objs.context.drawImage(sceneInfo[1].objs.videoImages[sequence],0,0);


        break;
      case 2:
        break;
      case 3:
        break;
    }
  }

  function loop(){

    // 현재 위치에서 yOffset까지 남은 거리의 0.07까지 그리고 그 남은 거리에서 0.07까지 이동하면서 ease-out motion을 구현
    delayedYOffset = delayedYOffset + (yOffset - delayedYOffset)*acc;
    // console.log(`delayedYOffset: ${Math.round(delayedYOffset)}`);
    // console.log(`yOffset: ${yOffset}`);

    // 마이너스 값으로 떨어지지 않게 만드는 코드
    if(!enterNewScene){

      if(currentScene === 1){
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

  function setCanvasImages(){
    let imgElem;
    for(let i = 0; i<sceneInfo[1].values.videoImageCount;i++){
      imgElem = new Image();
      imgElem.src =`./images_netflix/${1+i}.png`;
      sceneInfo[1].objs.videoImages.push(imgElem);
    }

    console.log('now, the image is drawing');
  }



  window.addEventListener('load', () => {
    //로딩 페이지 제거
    document.body.classList.remove('before-load');

    //각 scene의 높이 설정 및 현재 씬 위치 확인(새로고침되어도 오류가 발생하지 않게)
    setLayout();


    window.addEventListener('scroll', ()=>{
      yOffset = window.pageYOffset;

      //스크롤에 따라 새로운 씬에 들어갔는지 + DOM object에 id 추가
      scrollLoop();

      // 스크롤 되는 순간 루프를 탄다. 모든 루프가 끝나면 빠져나와서 rafState가 true가 되면서 빠져나옴
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

    document.querySelector('.loading').addEventListener('transitionend', (e) => {
      document.body.removeChild(e.currentTarget);
    });

    // const logoElem = document.querySelector('.logo .logo_svg1');
  	// const svglength = logoElem.getTotalLength();
  	// console.log(svglength);
  });

setCanvasImages();



})();
