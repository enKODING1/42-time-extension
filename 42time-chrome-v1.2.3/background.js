(()=>{
  "use strict";
  
  // Firefox와 Chrome 모두 호환
  const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
  
  browserAPI.runtime.onInstalled.addListener((details) => {
    console.log("42 time 익스텐션이 설치되었습니다!");
    
    // 설치나 업데이트 시 설정 페이지 열기
    if (details.reason === 'install' || details.reason === 'update') {
      browserAPI.runtime.openOptionsPage();
    }
  });

  // Firefox에서 웹 요청 처리를 위한 추가 설정
  if (typeof browser !== 'undefined') {
    // Firefox 전용 설정
    console.log("Firefox 환경에서 실행 중");
  }
})();
