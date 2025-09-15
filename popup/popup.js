(() => {
  "use strict";
  
  // 공통 유틸리티 참조 (지연 로딩)
  let SettingsManager, APIManager, MessageManager, getBrowserAPI, browserAPI;
  
  // 유틸리티 초기화 함수
  function initializeUtils() {
    if (!window.FortyTwoTimeUtils) {
      throw new Error('FortyTwoTimeUtils가 로드되지 않았습니다.');
    }
    
    ({ SettingsManager, APIManager, MessageManager, getBrowserAPI } = window.FortyTwoTimeUtils);
    browserAPI = getBrowserAPI();
  }
  
  // 시간 표시 함수들
  function displayCurrentMonthTime(timeData, settings) {
    const timeContainer = document.getElementById('current-month-time');
    
    if (!settings.showTotalTime || !timeData) {
      timeContainer.style.display = 'none';
      return;
    }
    
    const timeValue = document.getElementById('time-value');
    const monthLabel = document.getElementById('month-label');
    const excessContainer = document.getElementById('current-month-excess');
    
    if (timeValue && monthLabel) {
      const { hours, minutes, excessHours, excessMinutes, isLimited } = timeData;
      timeValue.textContent = `${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m`;
      
      // 현재 월 이름 설정
      const currentDate = new Date();
      const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', 
                         '7월', '8월', '9월', '10월', '11월', '12월'];
      monthLabel.textContent = monthNames[currentDate.getMonth()];
      
      // 초과 시간 표시
      if (isLimited && settings.showDailyLimit && excessContainer) {
        const excessValueElement = excessContainer.querySelector('.excess-value');
        if (excessValueElement) {
          excessValueElement.textContent = `${excessHours.toString().padStart(2, "0")}h ${excessMinutes.toString().padStart(2, "0")}m`;
          excessContainer.style.display = 'block';
        }
      } else if (excessContainer) {
        excessContainer.style.display = 'none';
      }
      
      timeContainer.style.display = 'block';
    }
  }
  
  function displayTodayTime(timeData, settings) {
    const timeContainer = document.getElementById('today-time');
    
    if (!settings.showTodayTime || !timeData) {
      timeContainer.style.display = 'none';
      return;
    }
    
    const timeValue = document.getElementById('today-time-value');
    const excessContainer = document.getElementById('today-excess');
    
    if (timeValue) {
      const { hours, minutes, excessHours, excessMinutes, isLimited } = timeData;
      timeValue.textContent = `${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m`;
      
      // 초과 시간 표시
      if (isLimited && settings.showDailyLimit && excessContainer) {
        const excessValueElement = excessContainer.querySelector('.excess-value');
        if (excessValueElement) {
          excessValueElement.textContent = `${excessHours.toString().padStart(2, "0")}h ${excessMinutes.toString().padStart(2, "0")}m`;
          excessContainer.style.display = 'block';
        }
      } else if (excessContainer) {
        excessContainer.style.display = 'none';
      }
      
      timeContainer.style.display = 'block';
    }
  }
  
  function displayDailyAverage(timeData, settings) {
    const timeContainer = document.getElementById('daily-average');
    
    if (!settings.showDailyAverage || !timeData) {
      timeContainer.style.display = 'none';
      return;
    }
    
    const timeValue = document.getElementById('daily-average-value');
    const excessContainer = document.getElementById('daily-average-excess');
    
    if (timeValue) {
      const { hours, minutes, excessHours, excessMinutes, isLimited } = timeData;
      timeValue.textContent = `${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m`;
      
      // 초과 시간 표시
      if (isLimited && settings.showDailyLimit && excessContainer) {
        const excessValueElement = excessContainer.querySelector('.excess-value');
        if (excessValueElement) {
          excessValueElement.textContent = `${excessHours.toString().padStart(2, "0")}h ${excessMinutes.toString().padStart(2, "0")}m`;
          excessContainer.style.display = 'block';
        }
      } else if (excessContainer) {
        excessContainer.style.display = 'none';
      }
      
      timeContainer.style.display = 'block';
    }
  }
  
  function displayWeeklyLearning(timeData, settings) {
    const timeContainer = document.getElementById('weekly-learning');
    
    if (!settings.showWeeklyLearning || !timeData) {
      timeContainer.style.display = 'none';
      return;
    }
    
    const timeValue = document.getElementById('weekly-learning-value');
    const excessContainer = document.getElementById('weekly-learning-excess');
    
    if (timeValue) {
      const { hours, minutes, excessHours, excessMinutes, isLimited } = timeData;
      timeValue.textContent = `${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m`;
      
      // 초과 시간 표시
      if (isLimited && settings.showDailyLimit && excessContainer) {
        const excessValueElement = excessContainer.querySelector('.excess-value');
        if (excessValueElement) {
          excessValueElement.textContent = `${excessHours.toString().padStart(2, "0")}h ${excessMinutes.toString().padStart(2, "0")}m`;
          excessContainer.style.display = 'block';
        }
      } else if (excessContainer) {
        excessContainer.style.display = 'none';
      }
      
      timeContainer.style.display = 'block';
    }
  }
  
  // 모든 시간 데이터 로드 및 표시
  async function loadAndDisplayTimeData(username, settings) {
    if (!username) {
      // 사용자명이 없으면 모든 시간 표시 숨김
      displayCurrentMonthTime(null, settings);
      displayTodayTime(null, settings);
      displayDailyAverage(null, settings);
      displayWeeklyLearning(null, settings);
      return;
    }
    
    try {
      // 병렬로 데이터 가져오기 (12시간 제한 설정 적용)
      const [monthTimeData, todayTimeData, dailyAverageData, weeklyLearningData] = await Promise.all([
        settings.showTotalTime ? APIManager.fetchCurrentMonthTime(username, settings.showDailyLimit) : null,
        settings.showTodayTime ? APIManager.fetchTodayTime(username, settings.showDailyLimit) : null,
        settings.showDailyAverage ? APIManager.fetchDailyAverage(username, settings.showDailyLimit) : null,
        settings.showWeeklyLearning ? APIManager.fetchWeeklyLearning(username, settings.showDailyLimit) : null
      ]);
      
      // 각 시간 표시 업데이트
      displayCurrentMonthTime(monthTimeData, settings);
      displayTodayTime(todayTimeData, settings);
      displayDailyAverage(dailyAverageData, settings);
      displayWeeklyLearning(weeklyLearningData, settings);
      
    } catch (error) {
      console.error('[42time] 시간 데이터 로드 실패:', error);
      // 에러 시 모든 표시 숨김
      displayCurrentMonthTime(null, settings);
      displayTodayTime(null, settings);
      displayDailyAverage(null, settings);
      displayWeeklyLearning(null, settings);
    }
  }
  
  // 초기화 함수
  async function init() {
    try {
      // 유틸리티 초기화
      initializeUtils();
      
      // 설정 로드 및 테마 적용
      const settings = await SettingsManager.load();
      SettingsManager.applyTheme(settings.theme);
      
      // 사용자명이 설정되어 있으면 표시
      if (settings.username) {
        const subtitle = document.getElementById("app-subtitle");
        if (subtitle) {
          subtitle.textContent = `${settings.username}님의 학습시간`;
        }
      }
      
      // 시간 데이터 로드 및 표시
      await loadAndDisplayTimeData(settings.username, settings);
      
      // i18n 메시지 로드
      function loadI18nMessages() {
        const elements = {
          "app-name": "appName",
          "app-subtitle": settings.username ? null : "appSubtitle", // 사용자명이 있으면 기본 텍스트 유지
          "go-to-profile": "goToProfile"
        };
        
        for (const [elementId, messageKey] of Object.entries(elements)) {
          if (!messageKey) continue;
          const element = document.getElementById(elementId);
          if (element) {
            const message = browserAPI.i18n.getMessage(messageKey);
            if (message) {
              element.textContent = message;
            }
          }
        }
      }
      
      loadI18nMessages();
      
      // 링크 이벤트 리스너
      const intraLink = document.getElementById("intra-link");
      intraLink?.addEventListener("click", () => {
        browserAPI.tabs.create({ url: "https://intra.42.fr" });
      });
      
      // 설정 버튼 이벤트 리스너
      const settingsButton = document.getElementById("settings-button");
      settingsButton?.addEventListener("click", () => {
        browserAPI.runtime.openOptionsPage();
      });
      
      // 설정 변경 메시지 수신
      browserAPI.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        if (message.type === 'SETTINGS_UPDATED') {
          SettingsManager.applyTheme(message.settings.theme);
          
          // 사용자명 업데이트
          const subtitle = document.getElementById("app-subtitle");
          if (subtitle) {
            if (message.settings.username) {
              subtitle.textContent = `${message.settings.username}님의 학습시간`;
            } else {
              subtitle.textContent = browserAPI.i18n.getMessage("appSubtitle") || "월별 학습시간 확인하기";
            }
          }
          
          // 시간 데이터 업데이트
          await loadAndDisplayTimeData(message.settings.username, message.settings);
        }
      });
      
      console.log('[42time] 팝업 초기화 완료');
    } catch (error) {
      console.error('[42time] 팝업 초기화 실패:', error);
    }
  }
  
  // FortyTwoTimeUtils 로딩 대기
  function waitForUtils() {
    if (window.FortyTwoTimeUtils) {
      init();
    } else {
      console.log('[42time] FortyTwoTimeUtils 로딩 대기 중...');
      setTimeout(waitForUtils, 100);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForUtils);
  } else {
    waitForUtils();
  }
})();
