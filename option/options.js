(() => {
  "use strict";
  
  // 공통 유틸리티 참조 (지연 로딩)
  let SettingsManager, MessageManager, getBrowserAPI, browserAPI;
  
  // 유틸리티 초기화 함수
  function initializeUtils() {
    if (!window.FortyTwoTimeUtils) {
      throw new Error('FortyTwoTimeUtils가 로드되지 않았습니다.');
    }
    
    ({ SettingsManager, MessageManager, getBrowserAPI } = window.FortyTwoTimeUtils);
    browserAPI = getBrowserAPI();
  }
  
  // DOM 요소들
  let elements = {};
  
  // UI에 설정값 적용 함수
  function applySettingsToUI(settings) {
    console.log('[42time] 설정 적용 중:', settings);
    
    if (elements.themeSelect) {
      elements.themeSelect.value = settings.theme;
      console.log('[42time] 테마 설정됨:', settings.theme);
    }
    
    if (elements.usernameInput) {
      elements.usernameInput.value = settings.username || '';
      console.log('[42time] 사용자명 설정됨:', settings.username);
    }
    
    if (elements.showTotalTime) {
      console.log('[42time] showTotalTime 설정 전 상태:', elements.showTotalTime.checked);
      elements.showTotalTime.checked = settings.showTotalTime;
      console.log('[42time] showTotalTime 설정 후 상태:', elements.showTotalTime.checked, '(설정값:', settings.showTotalTime, ')');
    } else {
      console.error('[42time] showTotalTime 요소를 찾을 수 없음');
    }
    
    if (elements.showTodayTime) {
      console.log('[42time] showTodayTime 설정 전 상태:', elements.showTodayTime.checked);
      elements.showTodayTime.checked = settings.showTodayTime;
      console.log('[42time] showTodayTime 설정 후 상태:', elements.showTodayTime.checked, '(설정값:', settings.showTodayTime, ')');
    } else {
      console.error('[42time] showTodayTime 요소를 찾을 수 없음');
    }
    
    if (elements.showDailyAverage) {
      console.log('[42time] showDailyAverage 설정 전 상태:', elements.showDailyAverage.checked);
      elements.showDailyAverage.checked = settings.showDailyAverage;
      console.log('[42time] showDailyAverage 설정 후 상태:', elements.showDailyAverage.checked, '(설정값:', settings.showDailyAverage, ')');
    } else {
      console.error('[42time] showDailyAverage 요소를 찾을 수 없음');
    }
    
    if (elements.showDailyLimit) {
      console.log('[42time] showDailyLimit 설정 전 상태:', elements.showDailyLimit.checked);
      elements.showDailyLimit.checked = settings.showDailyLimit;
      console.log('[42time] showDailyLimit 설정 후 상태:', elements.showDailyLimit.checked, '(설정값:', settings.showDailyLimit, ')');
    } else {
      console.error('[42time] showDailyLimit 요소를 찾을 수 없음');
    }
    
    if (elements.showWeeklyLearning) {
      console.log('[42time] showWeeklyLearning 설정 전 상태:', elements.showWeeklyLearning.checked);
      elements.showWeeklyLearning.checked = settings.showWeeklyLearning;
      console.log('[42time] showWeeklyLearning 설정 후 상태:', elements.showWeeklyLearning.checked, '(설정값:', settings.showWeeklyLearning, ')');
    } else {
      console.error('[42time] showWeeklyLearning 요소를 찾을 수 없음');
    }
    
    // 테마 즉시 적용
    SettingsManager.applyTheme(settings.theme);
    console.log('[42time] 테마 적용 완료:', settings.theme);
  }
  
  // UI에서 설정값 가져오기 함수
  function getSettingsFromUI() {
    return {
      theme: elements.themeSelect.value,
      username: elements.usernameInput.value.trim(),
      showTotalTime: elements.showTotalTime.checked,
      showTodayTime: elements.showTodayTime.checked,
      showDailyAverage: elements.showDailyAverage.checked,
      showDailyLimit: elements.showDailyLimit.checked,
      showWeeklyLearning: elements.showWeeklyLearning.checked
    };
  }
  
  // 상태 메시지 표시 함수
  function showStatusMessage(message, type = 'success') {
    elements.statusMessage.textContent = message;
    elements.statusMessage.className = `status-message ${type}`;
    
    // 3초 후 메시지 제거
    setTimeout(() => {
      elements.statusMessage.textContent = '';
      elements.statusMessage.className = 'status-message';
    }, 3000);
  }
  
  // 저장 버튼 클릭 핸들러
  async function handleSave() {
    const settings = getSettingsFromUI();
    const success = await SettingsManager.save(settings);
    
    if (success) {
      showStatusMessage('설정이 저장되었습니다.', 'success');
      // 다른 탭/팝업에 설정 변경 알림
      await MessageManager.broadcastSettingsUpdate(settings);
    } else {
      showStatusMessage('설정 저장에 실패했습니다.', 'error');
    }
  }
  
  // 재설정 버튼 클릭 핸들러
  async function handleReset() {
    if (confirm('모든 설정을 기본값으로 재설정하시겠습니까?')) {
      const success = await SettingsManager.save(SettingsManager.DEFAULT_SETTINGS);
      
      if (success) {
        applySettingsToUI(SettingsManager.DEFAULT_SETTINGS);
        showStatusMessage('설정이 기본값으로 재설정되었습니다.', 'success');
      } else {
        showStatusMessage('재설정에 실패했습니다.', 'error');
      }
    }
  }
  
  // 테마 변경 실시간 미리보기
  function handleThemeChange() {
    const theme = elements.themeSelect.value;
    SettingsManager.applyTheme(theme);
  }
  
  // i18n 메시지 로드
  function loadI18nMessages() {
    const messageMap = {
      'options-title': 'optionsTitle',
      'settings-title': 'settingsTitle',
      'settings-subtitle': 'settingsSubtitle',
      'appearance-title': 'appearanceTitle',
      'theme-label': 'themeLabel',
      'theme-light': 'themeLight',
      'theme-dark': 'themeDark',
      'theme-auto': 'themeAuto',
      'profile-title': 'profileTitle',
      'username-label': 'usernameLabel',
      'username-help': 'usernameHelp',
      'display-title': 'displayTitle',
      'show-total-time-label': 'showTotalTimeLabel',
      'show-today-time-label': 'showTodayTimeLabel',
      'show-daily-average-label': 'showDailyAverageLabel',
      'show-daily-limit-label': 'showDailyLimitLabel',
      'show-weekly-learning-label': 'showWeeklyLearningLabel',
      'save-button': 'saveButton',
      'reset-button': 'resetButton'
    };
    
    for (const [elementId, messageKey] of Object.entries(messageMap)) {
      const element = document.getElementById(elementId);
      if (element) {
        const message = browserAPI.i18n.getMessage(messageKey);
        if (message) {
          if (element.tagName === 'INPUT' && element.type === 'text') {
            element.placeholder = message;
          } else {
            element.textContent = message;
          }
        }
      }
    }
  }
  
  // DOM 요소 캐싱
  function cacheElements() {
    console.log('[42time] DOM 요소 캐싱 시작');
    
    elements = {
      themeSelect: document.getElementById('theme-select'),
      usernameInput: document.getElementById('username-input'),
      showTotalTime: document.getElementById('show-total-time'),
      showTodayTime: document.getElementById('show-today-time'),
      showDailyAverage: document.getElementById('show-daily-average'),
      showDailyLimit: document.getElementById('show-daily-limit'),
      showWeeklyLearning: document.getElementById('show-weekly-learning'),
      saveButton: document.getElementById('save-button'),
      resetButton: document.getElementById('reset-button'),
      statusMessage: document.getElementById('status-message')
    };
    
    // 누락된 요소 확인
    const missingElements = [];
    for (const [key, element] of Object.entries(elements)) {
      if (!element) {
        missingElements.push(key);
      }
    }
    
    if (missingElements.length > 0) {
      console.error('[42time] 누락된 DOM 요소들:', missingElements);
      // 실제 DOM에서 요소 존재 여부 확인
      missingElements.forEach(key => {
        const id = key.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
        const actualElement = document.querySelector(`#${id}`);
        console.log(`[42time] ${key} (id: ${id}) 실제 존재:`, !!actualElement);
      });
    }
    
    // 디버깅: 체크박스 요소 확인
    console.log('[42time] 캐시된 요소들:', {
      showTotalTime: elements.showTotalTime,
      showTodayTime: elements.showTodayTime,
      showDailyAverage: elements.showDailyAverage,
      showDailyLimit: elements.showDailyLimit,
      showTotalTimeExists: !!elements.showTotalTime,
      showTodayTimeExists: !!elements.showTodayTime,
      showDailyAverageExists: !!elements.showDailyAverage,
      showDailyLimitExists: !!elements.showDailyLimit
    });
    
    // 각 체크박스의 상세 정보
    if (elements.showTotalTime) {
      console.log('[42time] showTotalTime 요소 정보:', {
        id: elements.showTotalTime.id,
        type: elements.showTotalTime.type,
        checked: elements.showTotalTime.checked,
        tagName: elements.showTotalTime.tagName
      });
    }
    
    if (elements.showTodayTime) {
      console.log('[42time] showTodayTime 요소 정보:', {
        id: elements.showTodayTime.id,
        type: elements.showTodayTime.type,
        checked: elements.showTodayTime.checked,
        tagName: elements.showTodayTime.tagName
      });
    }
    
    if (elements.showDailyAverage) {
      console.log('[42time] showDailyAverage 요소 정보:', {
        id: elements.showDailyAverage.id,
        type: elements.showDailyAverage.type,
        checked: elements.showDailyAverage.checked,
        tagName: elements.showDailyAverage.tagName
      });
    }
    
    if (elements.showDailyLimit) {
      console.log('[42time] showDailyLimit 요소 정보:', {
        id: elements.showDailyLimit.id,
        type: elements.showDailyLimit.type,
        checked: elements.showDailyLimit.checked,
        tagName: elements.showDailyLimit.tagName
      });
    }
    
    // 누락된 요소 확인
    for (const [key, element] of Object.entries(elements)) {
      if (!element) {
        console.warn(`[42time] 요소를 찾을 수 없음: ${key}`);
      }
    }
  }
  
  // 이벤트 리스너 등록
  function setupEventListeners() {
    elements.saveButton.addEventListener('click', handleSave);
    elements.resetButton.addEventListener('click', handleReset);
    elements.themeSelect.addEventListener('change', handleThemeChange);
    
    // 키보드 단축키 (Ctrl+S로 저장)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    });
    
    // 사용자명 입력 필드 검증
    elements.usernameInput.addEventListener('input', (e) => {
      const value = e.target.value;
      // 42 사용자명 검증 (영문, 숫자, 하이픈만 허용)
      const validUsername = /^[a-zA-Z0-9-]*$/.test(value);
      
      if (!validUsername && value.length > 0) {
        e.target.style.borderColor = '#dc3545';
        showStatusMessage('사용자명은 영문, 숫자, 하이픈만 사용할 수 있습니다.', 'error');
      } else {
        e.target.style.borderColor = '';
        if (elements.statusMessage.classList.contains('error')) {
          elements.statusMessage.textContent = '';
          elements.statusMessage.className = 'status-message';
        }
      }
    });
  }
  
  // 초기화 함수
  async function init() {
    try {
      // 유틸리티 초기화
      initializeUtils();
      
      // DOM 요소 캐싱
      cacheElements();
      
      // i18n 메시지 로드 (기본값으로 폴백)
      loadI18nMessages();
      
      // 저장된 설정 로드 및 적용
      const settings = await SettingsManager.load();
      applySettingsToUI(settings);
      
      // 이벤트 리스너 등록
      setupEventListeners();
      
      console.log('[42time] 옵션 페이지 초기화 완료');
    } catch (error) {
      console.error('[42time] 옵션 페이지 초기화 실패:', error);
      showStatusMessage('페이지 로드 중 오류가 발생했습니다.', 'error');
    }
  }
  
  // DOM이 로드되면 초기화 실행
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
  
  // 익스포트 (다른 스크립트에서 사용할 수 있도록)
  window.FortyTwoTimeOptions = {
    SettingsManager,
    MessageManager
  };
})();