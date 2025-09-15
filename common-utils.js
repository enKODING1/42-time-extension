(() => {
  "use strict";
  
  // ================================================
  // 브라우저 호환성 유틸리티
  // ================================================
  
  /**
   * Firefox와 Chrome 모두 호환되는 브라우저 API 반환
   * @returns {Object} browser API object
   */
  function getBrowserAPI() {
    return typeof browser !== 'undefined' ? browser : chrome;
  }
  
  // ================================================
  // 스토리지 관리 클래스 (통합된 버전)
  // ================================================
  
  class StorageManager {
    
    // 1. Local Storage - 로컬에만 저장 (빠름)
    static async saveLocal(key, value) {
      try {
        const browserAPI = getBrowserAPI();
        const data = {};
        data[key] = value;
        await browserAPI.storage.local.set(data);
        console.log(`[42time] 로컬에 저장됨: ${key}`, value);
        return true;
      } catch (error) {
        console.error('[42time] 로컬 저장 실패:', error);
        return false;
      }
    }
    
    static async getLocal(key) {
      try {
        const browserAPI = getBrowserAPI();
        const result = await browserAPI.storage.local.get(key);
        return result[key];
      } catch (error) {
        console.error('[42time] 로컬 로드 실패:', error);
        return null;
      }
    }
    
    static async removeLocal(key) {
      try {
        const browserAPI = getBrowserAPI();
        await browserAPI.storage.local.remove(key);
        console.log(`[42time] 로컬에서 삭제됨: ${key}`);
        return true;
      } catch (error) {
        console.error('[42time] 로컬 삭제 실패:', error);
        return false;
      }
    }
    
    static async clearLocal() {
      try {
        const browserAPI = getBrowserAPI();
        await browserAPI.storage.local.clear();
        console.log('[42time] 로컬 스토리지 전체 삭제됨');
        return true;
      } catch (error) {
        console.error('[42time] 로컬 전체 삭제 실패:', error);
        return false;
      }
    }
    
    // 2. Sync Storage - 계정과 동기화 (Chrome만 지원, Firefox는 local로 fallback)
    static async saveSync(key, value) {
      try {
        const browserAPI = getBrowserAPI();
        const data = {};
        data[key] = value;
        
        // Firefox에서는 sync 스토리지가 제한적이므로 local 사용
        if (typeof browser !== 'undefined') {
          await browserAPI.storage.local.set(data);
        } else {
          await browserAPI.storage.sync.set(data);
        }
        console.log(`[42time] 동기화 저장됨: ${key}`, value);
        return true;
      } catch (error) {
        console.error('[42time] 동기화 저장 실패:', error);
        return false;
      }
    }
    
    static async getSync(key) {
      try {
        const browserAPI = getBrowserAPI();
        let result;
        if (typeof browser !== 'undefined') {
          result = await browserAPI.storage.local.get(key);
        } else {
          result = await browserAPI.storage.sync.get(key);
        }
        return result[key];
      } catch (error) {
        console.error('[42time] 동기화 로드 실패:', error);
        return null;
      }
    }
    
    // 3. 복잡한 객체 저장
    static async saveObject(key, object) {
      try {
        const serialized = JSON.stringify(object);
        return await this.saveLocal(key, serialized);
      } catch (error) {
        console.error('[42time] 객체 저장 실패:', error);
        return false;
      }
    }
    
    static async getObject(key) {
      try {
        const serialized = await this.getLocal(key);
        if (serialized) {
          return JSON.parse(serialized);
        }
        return null;
      } catch (error) {
        console.error('[42time] 객체 로드 실패:', error);
        return null;
      }
    }
    
    // 4. 캐시 관리 (만료시간 포함)
    static async saveCache(key, data, expirationMinutes = 60) {
      const cacheData = {
        data: data,
        timestamp: Date.now(),
        expiration: expirationMinutes * 60 * 1000
      };
      return await this.saveLocal(`cache_${key}`, cacheData);
    }
    
    static async getCache(key) {
      const cacheData = await this.getLocal(`cache_${key}`);
      if (!cacheData) return null;
      
      const now = Date.now();
      if (now - cacheData.timestamp > cacheData.expiration) {
        // 캐시 만료됨
        await this.removeLocal(`cache_${key}`);
        return null;
      }
      
      return cacheData.data;
    }
    
    // 5. 스토리지 사용량 확인
    static async getStorageUsage() {
      try {
        const browserAPI = getBrowserAPI();
        if (browserAPI.storage.local.getBytesInUse) {
          const bytes = await browserAPI.storage.local.getBytesInUse();
          return {
            bytes: bytes,
            kb: Math.round(bytes / 1024 * 100) / 100,
            mb: Math.round(bytes / (1024 * 1024) * 100) / 100
          };
        }
        return null;
      } catch (error) {
        console.error('[42time] 스토리지 사용량 확인 실패:', error);
        return null;
      }
    }
    
    // 6. 스토리지 변경 이벤트 리스너
    static addStorageListener(callback) {
      const browserAPI = getBrowserAPI();
      browserAPI.storage.onChanged.addListener((changes, areaName) => {
        callback(changes, areaName);
      });
    }
    
    // 7. 모든 데이터 내보내기
    static async exportAllData() {
      try {
        const browserAPI = getBrowserAPI();
        const allData = await browserAPI.storage.local.get();
        return allData;
      } catch (error) {
        console.error('[42time] 데이터 내보내기 실패:', error);
        return null;
      }
    }
    
    // 8. 데이터 가져오기
    static async importData(data) {
      try {
        const browserAPI = getBrowserAPI();
        await browserAPI.storage.local.set(data);
        console.log('[42time] 데이터 가져오기 완료');
        return true;
      } catch (error) {
        console.error('[42time] 데이터 가져오기 실패:', error);
        return false;
      }
    }
  }
  
  // ================================================
  // 설정 관리 클래스 (StorageManager 기반으로 개선)
  // ================================================
  
  class SettingsManager {
    static DEFAULT_SETTINGS = {
      theme: 'auto',
      username: '',
      showTotalTime: true,
      showTodayTime: true,
      showDailyAverage: true,
      showDailyLimit: true,
      showWeeklyLearning: true
    };
    
    /**
     * 설정 로드
     * @returns {Promise<Object>} 설정 객체
     */
    static async load() {
      try {
        const saved = await StorageManager.getObject('app_settings');
        return { ...this.DEFAULT_SETTINGS, ...saved };
      } catch (error) {
        console.error('[42time] 설정 로드 실패:', error);
        return this.DEFAULT_SETTINGS;
      }
    }
    
    /**
     * 설정 저장
     * @param {Object} settings - 저장할 설정 객체
     * @returns {Promise<boolean>} 성공 여부
     */
    static async save(settings) {
      return await StorageManager.saveObject('app_settings', settings);
    }
    
    /**
     * 특정 설정 값 저장
     * @param {string} key - 설정 키
     * @param {*} value - 설정 값
     * @returns {Promise<boolean>} 성공 여부
     */
    static async saveSetting(key, value) {
      const settings = await this.load();
      settings[key] = value;
      return await this.save(settings);
    }
    
    /**
     * 특정 설정 값 가져오기
     * @param {string} key - 설정 키
     * @returns {Promise<*>} 설정 값
     */
    static async getSetting(key) {
      const settings = await this.load();
      return settings[key];
    }
    
    /**
     * 테마 적용
     * @param {string} theme - 'light', 'dark', 'auto' 중 하나
     */
    static applyTheme(theme) {
      const root = document.documentElement;
      
      if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
      } else if (theme === 'light') {
        root.setAttribute('data-theme', 'light');
      } else { // auto
        root.setAttribute('data-theme', 'auto');
      }
    }
    
    // 하위 호환성을 위한 메서드들 (기존 인터페이스 유지)
    static async loadLegacy() {
      try {
        const browserAPI = getBrowserAPI();
        const result = await browserAPI.storage.sync.get(this.DEFAULT_SETTINGS);
        return result;
      } catch (error) {
        console.error('[42time] 레거시 설정 로드 실패:', error);
        return this.DEFAULT_SETTINGS;
      }
    }
    
    static async saveLegacy(settings) {
      try {
        const browserAPI = getBrowserAPI();
        await browserAPI.storage.sync.set(settings);
        return true;
      } catch (error) {
        console.error('[42time] 레거시 설정 저장 실패:', error);
        return false;
      }
    }
  }
  
  // ================================================
  // API 관리 클래스
  // ================================================
  
  class APIManager {
    /**
     * 42 API에서 사용자 데이터 가져오기
     * @param {string} username - 42 사용자명
     * @returns {Promise<Object|null>} 사용자 데이터 또는 null
     */
    static async fetchUserData(username) {
      if (!username) return null;
      
      try {
        const response = await fetch(`https://translate.intra.42.fr/users/${username}/locations_stats.json`, {
          credentials: "include"
        });
        
        if (!response.ok) {
          console.error('[42time] API 응답 실패:', response.status, response.statusText);
          return null;
        }
        
        const data = await response.json();
        console.log('[42time] API 데이터 수신:', data);
        return data;
        
      } catch (error) {
        console.error('[42time] API 요청 실패:', error);
        return null;
      }
    }
    
    /**
     * 현재 월 시간 데이터 계산
     * @param {string} username - 42 사용자명
     * @param {boolean} applyDailyLimit - 하루 12시간 제한 적용 여부
     * @returns {Promise<Object|null>} {hours, minutes, excessHours, excessMinutes, isLimited} 형태의 객체 또는 null
     */
    static async fetchCurrentMonthTime(username, applyDailyLimit = false) {
      const rawData = await this.fetchUserData(username);
      if (!rawData) return null;
      
      // 현재 월 데이터만 추출
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
      const currentMonthKey = `${currentYear}-${currentMonth}`;
      
      let totalHours = 0;
      let totalMinutes = 0;
      let totalExcessHours = 0;
      let totalExcessMinutes = 0;
      let hasLimitedDays = false;
      let originalTotalHours = 0;
      let originalTotalMinutes = 0;
      
      // 현재 월의 모든 일자 데이터 합산
      for (const dateKey in rawData) {
        if (dateKey.startsWith(currentMonthKey)) {
          const timeString = rawData[dateKey].split(".")[0];
          let [hours, minutes] = timeString.split(":").map(Number);
          
          // 원본 시간 누적
          originalTotalHours += hours;
          originalTotalMinutes += minutes;
          
          // 하루 12시간 제한 적용
          if (applyDailyLimit) {
            const dailyTotalMinutes = (hours * 60) + minutes;
            const limitMinutes = 12 * 60; // 12시간 = 720분
            
            if (dailyTotalMinutes > limitMinutes) {
              // 초과 시간 계산
              const excessMinutes = dailyTotalMinutes - limitMinutes;
              totalExcessHours += Math.floor(excessMinutes / 60);
              totalExcessMinutes += excessMinutes % 60;
              
              hours = 12;
              minutes = 0;
              hasLimitedDays = true;
            }
          }
          
          totalHours += hours;
          totalMinutes += minutes;
        }
      }
      
      // 분을 시간으로 변환
      totalHours += Math.floor(totalMinutes / 60);
      totalMinutes = totalMinutes % 60;
      
      totalExcessHours += Math.floor(totalExcessMinutes / 60);
      totalExcessMinutes = totalExcessMinutes % 60;
      
      originalTotalHours += Math.floor(originalTotalMinutes / 60);
      originalTotalMinutes = originalTotalMinutes % 60;
      
      return { 
        hours: totalHours, 
        minutes: totalMinutes,
        excessHours: totalExcessHours,
        excessMinutes: totalExcessMinutes,
        isLimited: hasLimitedDays,
        originalHours: originalTotalHours,
        originalMinutes: originalTotalMinutes
      };
    }
    
    /**
     * 오늘 학습 시간 계산
     * @param {string} username - 42 사용자명
     * @param {boolean} applyDailyLimit - 하루 12시간 제한 적용 여부
     * @returns {Promise<Object|null>} {hours, minutes, excessHours, excessMinutes, isLimited} 형태의 객체 또는 null
     */
    static async fetchTodayTime(username, applyDailyLimit = false) {
      const rawData = await this.fetchUserData(username);
      if (!rawData) return null;
      
      // 오늘 날짜 생성
      const today = new Date();
      const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      if (rawData[todayKey]) {
        const timeString = rawData[todayKey].split(".")[0];
        let [originalHours, originalMinutes] = timeString.split(":").map(Number);
        let hours = originalHours;
        let minutes = originalMinutes;
        let excessHours = 0;
        let excessMinutes = 0;
        let isLimited = false;
        
        // 하루 12시간 제한 적용
        if (applyDailyLimit) {
          const totalMinutes = (originalHours * 60) + originalMinutes;
          const limitMinutes = 12 * 60; // 12시간 = 720분
          
          if (totalMinutes > limitMinutes) {
            hours = 12;
            minutes = 0;
            
            // 초과 시간 계산
            const excessTotalMinutes = totalMinutes - limitMinutes;
            excessHours = Math.floor(excessTotalMinutes / 60);
            excessMinutes = excessTotalMinutes % 60;
            isLimited = true;
          }
        }
        
        return { 
          hours, 
          minutes, 
          excessHours, 
          excessMinutes, 
          isLimited,
          originalHours,
          originalMinutes 
        };
      }
      
      return { 
        hours: 0, 
        minutes: 0, 
        excessHours: 0, 
        excessMinutes: 0, 
        isLimited: false,
        originalHours: 0,
        originalMinutes: 0 
      };
    }
    
    /**
     * 일평균 시간 계산 (미기록 제외)
     * @param {string} username - 42 사용자명
     * @param {boolean} applyDailyLimit - 하루 12시간 제한 적용 여부
     * @returns {Promise<Object|null>} {hours, minutes, excessHours, excessMinutes, isLimited} 형태의 객체 또는 null
     */
    static async fetchDailyAverage(username, applyDailyLimit = false) {
      const rawData = await this.fetchUserData(username);
      if (!rawData) return null;
      
      // 현재 월 데이터만 추출
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
      const currentMonthKey = `${currentYear}-${currentMonth}`;
      
      let totalHours = 0;
      let totalMinutes = 0;
      let totalExcessHours = 0;
      let totalExcessMinutes = 0;
      let recordedDays = 0;
      let hasLimitedDays = false;
      let originalTotalHours = 0;
      let originalTotalMinutes = 0;
      
      // 현재 월의 기록된 일자들만 계산
      for (const dateKey in rawData) {
        if (dateKey.startsWith(currentMonthKey)) {
          const timeString = rawData[dateKey].split(".")[0];
          let [hours, minutes] = timeString.split(":").map(Number);
          
          // 0시간 0분이 아닌 경우만 카운트
          if (hours > 0 || minutes > 0) {
            // 원본 시간 누적
            originalTotalHours += hours;
            originalTotalMinutes += minutes;
            
            // 하루 12시간 제한 적용
            if (applyDailyLimit) {
              const dailyTotalMinutes = (hours * 60) + minutes;
              const limitMinutes = 12 * 60; // 12시간 = 720분
              
              if (dailyTotalMinutes > limitMinutes) {
                // 초과 시간 계산
                const excessMinutes = dailyTotalMinutes - limitMinutes;
                totalExcessHours += Math.floor(excessMinutes / 60);
                totalExcessMinutes += excessMinutes % 60;
                
                hours = 12;
                minutes = 0;
                hasLimitedDays = true;
              }
            }
            
            totalHours += hours;
            totalMinutes += minutes;
            recordedDays++;
          }
        }
      }
      
      if (recordedDays === 0) {
        return { 
          hours: 0, 
          minutes: 0, 
          excessHours: 0, 
          excessMinutes: 0, 
          isLimited: false,
          originalHours: 0,
          originalMinutes: 0
        };
      }
      
      // 평균 계산
      const totalMinutesSum = (totalHours * 60) + totalMinutes;
      const avgMinutes = Math.round(totalMinutesSum / recordedDays);
      const avgHours = Math.floor(avgMinutes / 60);
      const remainingMinutes = avgMinutes % 60;
      
      // 초과 시간 평균 계산
      const totalExcessMinutesSum = (totalExcessHours * 60) + totalExcessMinutes;
      const avgExcessMinutes = Math.round(totalExcessMinutesSum / recordedDays);
      const avgExcessHours = Math.floor(avgExcessMinutes / 60);
      const remainingExcessMinutes = avgExcessMinutes % 60;
      
      // 원본 시간 평균 계산
      const originalTotalMinutesSum = (originalTotalHours * 60) + originalTotalMinutes;
      const originalAvgMinutes = Math.round(originalTotalMinutesSum / recordedDays);
      const originalAvgHours = Math.floor(originalAvgMinutes / 60);
      const originalRemainingMinutes = originalAvgMinutes % 60;
      
      return { 
        hours: avgHours, 
        minutes: remainingMinutes,
        excessHours: avgExcessHours,
        excessMinutes: remainingExcessMinutes,
        isLimited: hasLimitedDays,
        originalHours: originalAvgHours,
        originalMinutes: originalRemainingMinutes
      };
    }
    
    /**
     * 주간 학습 시간 계산 (이번 주 월요일부터 현재까지)
     * @param {string} username - 42 사용자명
     * @param {boolean} applyDailyLimit - 하루 12시간 제한 적용 여부
     * @returns {Promise<Object|null>} {hours, minutes, excessHours, excessMinutes, isLimited} 형태의 객체 또는 null
     */
    static async fetchWeeklyLearning(username, applyDailyLimit = false) {
      const rawData = await this.fetchUserData(username);
      if (!rawData) return null;
      
      // 이번 주 월요일 날짜 계산
      const currentDate = new Date();
      const dayOfWeek = currentDate.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
      const mondayDate = new Date(currentDate);
      
      // 월요일로 조정 (일요일이면 -6, 월요일이면 0, 화요일이면 -1, ...)
      const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      mondayDate.setDate(currentDate.getDate() - daysToSubtract);
      
      let totalHours = 0;
      let totalMinutes = 0;
      let totalExcessHours = 0;
      let totalExcessMinutes = 0;
      let hasLimitedDays = false;
      let originalTotalHours = 0;
      let originalTotalMinutes = 0;
      
      // 이번 주 월요일부터 오늘까지의 데이터 합산
      for (let i = 0; i <= (currentDate.getTime() - mondayDate.getTime()) / (1000 * 60 * 60 * 24); i++) {
        const targetDate = new Date(mondayDate);
        targetDate.setDate(mondayDate.getDate() + i);
        
        const dateKey = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;
        
        if (rawData[dateKey]) {
          const timeString = rawData[dateKey].split(".")[0];
          let [hours, minutes] = timeString.split(":").map(Number);
          
          // 원본 시간 누적
          originalTotalHours += hours;
          originalTotalMinutes += minutes;
          
          // 하루 12시간 제한 적용
          if (applyDailyLimit) {
            const dailyTotalMinutes = (hours * 60) + minutes;
            const limitMinutes = 12 * 60; // 12시간 = 720분
            
            if (dailyTotalMinutes > limitMinutes) {
              // 초과 시간 계산
              const excessMinutes = dailyTotalMinutes - limitMinutes;
              totalExcessHours += Math.floor(excessMinutes / 60);
              totalExcessMinutes += excessMinutes % 60;
              
              hours = 12;
              minutes = 0;
              hasLimitedDays = true;
            }
          }
          
          totalHours += hours;
          totalMinutes += minutes;
        }
      }
      
      // 분을 시간으로 변환
      totalHours += Math.floor(totalMinutes / 60);
      totalMinutes = totalMinutes % 60;
      
      totalExcessHours += Math.floor(totalExcessMinutes / 60);
      totalExcessMinutes = totalExcessMinutes % 60;
      
      originalTotalHours += Math.floor(originalTotalMinutes / 60);
      originalTotalMinutes = originalTotalMinutes % 60;
      
      return { 
        hours: totalHours, 
        minutes: totalMinutes,
        excessHours: totalExcessHours,
        excessMinutes: totalExcessMinutes,
        isLimited: hasLimitedDays,
        originalHours: originalTotalHours,
        originalMinutes: originalTotalMinutes
      };
    }
    
    /**
     * 원시 시간 데이터를 월별로 처리
     * @param {Object} rawData - API에서 받은 원시 데이터
     * @param {boolean} applyDailyLimit - 하루 12시간 제한 적용 여부
     * @returns {Object} 월별로 처리된 시간 데이터
     */
    static processTimeData(rawData, applyDailyLimit = false) {
      const monthNames = {
        "01": "jan", "02": "feb", "03": "mar", "04": "apr", 
        "05": "may", "06": "jun", "07": "jul", "08": "aug", 
        "09": "sep", "10": "oct", "11": "nov", "12": "dec"
      };
      
      const processedData = {};
      
      for (const dateKey in rawData) {
        const [, month] = dateKey.split("-");
        const monthName = monthNames[month];
        const timeString = rawData[dateKey].split(".")[0];
        let [hours, minutes] = timeString.split(":").map(Number);
        
        // 하루 12시간 제한 적용
        if (applyDailyLimit) {
          const dailyTotalMinutes = (hours * 60) + minutes;
          const limitMinutes = 12 * 60; // 12시간 = 720분
          
          if (dailyTotalMinutes > limitMinutes) {
            hours = 12;
            minutes = 0;
          }
        }
        
        if (!processedData[monthName]) {
          processedData[monthName] = { hour: 0, min: 0 };
        }
        
        processedData[monthName].hour += hours;
        processedData[monthName].min += minutes;
        
        if (processedData[monthName].min >= 60) {
          processedData[monthName].hour += Math.floor(processedData[monthName].min / 60);
          processedData[monthName].min = processedData[monthName].min % 60;
        }
      }
      
      console.log('[42time] 처리된 데이터 (12시간 제한:', applyDailyLimit, '):', processedData);
      return processedData;
    }
  }
  
  // ================================================
  // 메시지 유틸리티 클래스
  // ================================================
  
  class MessageManager {
    /**
     * 다른 확장 프로그램 컨텍스트로 메시지 전송
     * @param {Object} message - 전송할 메시지
     * @returns {Promise<boolean>} 성공 여부
     */
    static async sendMessage(message) {
      try {
        const browserAPI = getBrowserAPI();
        await browserAPI.runtime.sendMessage(message);
        return true;
      } catch (error) {
        // 메시지 전송 실패는 무시 (다른 탭이 없을 수 있음)
        console.log('[42time] 메시지 전송 실패 (무시됨):', error.message);
        return false;
      }
    }
    
    /**
     * 설정 변경 메시지 브로드캐스트
     * @param {Object} settings - 변경된 설정
     */
    static async broadcastSettingsUpdate(settings) {
      await this.sendMessage({
        type: 'SETTINGS_UPDATED',
        settings: settings
      });
    }
  }
  
  // ================================================
  // 사용자 검색 유틸리티 (content.js 전용)
  // ================================================
  
  class UserSearchManager {
    /**
     * DOM에서 사용자명 찾기
     * @param {number} retryCount - 재시도 횟수
     * @returns {string|null} 사용자명 또는 null
     */
    static getUserName(retryCount = 30) {
      // 방법 1: .login 클래스 엘리먼트에서
      const loginElement = document.querySelector(".login");
      if (loginElement?.dataset.login) {
        console.log('[42time] Found login via .login element:', loginElement.dataset.login);
        return loginElement.dataset.login;
      }
      
      // 방법 2: mail 링크에서 추출
      const emailLink = document.querySelector('a[href*="mailto"]');
      if (emailLink) {
        const email = emailLink.textContent?.split("@");
        if (email && email.length > 0) {
          console.log('[42time] Found login via email:', email[0]);
          return email[0];
        }
      }
      
      // 방법 3: URL에서 추출 시도
      const urlMatch = window.location.pathname.match(/\/users\/([^\/]+)/);
      if (urlMatch && urlMatch[1]) {
        console.log('[42time] Found login via URL:', urlMatch[1]);
        return urlMatch[1];
      }
      
      // 방법 4: 프로필 정보에서 추출 시도
      const profileElements = document.querySelectorAll('[class*="login"], [data-login], .user-login');
      for (const element of profileElements) {
        const login = element.textContent?.trim() || element.dataset.login;
        if (login && login.length > 0) {
          console.log('[42time] Found login via profile element:', login);
          return login;
        }
      }
      
      return null;
    }
    
    /**
     * 재시도를 통한 사용자 검색
     * @param {Function} callback - 사용자를 찾았을 때 실행할 콜백
     * @param {number} retryCount - 재시도 횟수
     */
    static findUserWithRetry(callback, retryCount = 30) {
      const user = this.getUserName(retryCount);
      
      if (user) {
        callback(user);
      } else if (retryCount > 0) {
        console.log('[42time] User not found, retrying in 500ms...');
        setTimeout(() => this.findUserWithRetry(callback, retryCount - 1), 500);
      } else {
        console.log('[42time] Failed to find user after all retries');
      }
    }
  }
  
  // ================================================
  // 전역 노출
  // ================================================
  
  // 브라우저 환경에서 전역 객체로 노출
  if (typeof window !== 'undefined') {
    window.FortyTwoTimeUtils = {
      getBrowserAPI,
      StorageManager,
      SettingsManager,
      APIManager,
      MessageManager,
      UserSearchManager
    };
    
    console.log('[42time] FortyTwoTimeUtils 로드 완료');
  }
  
  // Node.js 환경에서 모듈로 노출
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      getBrowserAPI,
      StorageManager,
      SettingsManager,
      APIManager,
      MessageManager,
      UserSearchManager
    };
  }
  
})();