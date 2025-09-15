(() => {
	"use strict";

	// 공통 유틸리티에서 필요한 클래스들 가져오기
	const { APIManager, UserSearchManager, SettingsManager, getBrowserAPI } = window.FortyTwoTimeUtils;
	const browserAPI = getBrowserAPI();

	let currentSettings = null;

	function addTimeRowToTable(timeData) {
		console.log('[42time] Adding time rows to tables...', timeData);

		document.querySelectorAll("table.table-fixed").forEach(table => {
			const thead = table.querySelector("thead");
			if (!thead) return;

			const headerRow = thead.querySelector("tr");
			if (!headerRow) return;

			const headers = headerRow.querySelectorAll("th");
			if (thead.querySelector("tr[data-logtime]")) return; // 이미 추가됨

			const timeRow = document.createElement("tr");
			timeRow.setAttribute("data-logtime", "true");

			headers.forEach(header => {
				let monthKey = null;
				const headerText = header.textContent?.trim().toLowerCase();

				// APIManager의 monthNames 사용
				const monthNames = {
					"01": "jan", "02": "feb", "03": "mar", "04": "apr", 
					"05": "may", "06": "jun", "07": "jul", "08": "aug", 
					"09": "sep", "10": "oct", "11": "nov", "12": "dec"
				};

				for (const key in monthNames) {
					if (monthNames[key] === headerText) {
						monthKey = monthNames[key];
						break;
					}
				}

				const cell = document.createElement("td");
				cell.colSpan = header.colSpan || 1;
				cell.style.textAlign = "center";

				if (monthKey && timeData[monthKey]) {
					const { hour, min } = timeData[monthKey];
					cell.textContent = `${hour.toString().padStart(2, "0")}h ${min.toString().padStart(2, "0")}m`;
					cell.style.color = "#007B7C";
					cell.style.fontWeight = "bold";
				} else {
					cell.textContent = "-";
				}

				timeRow.appendChild(cell);
			});

			thead.appendChild(timeRow);
			console.log('[42time] Time row added to table');
		});
	}

	function addTimeToSVG(timeData) {
		console.log('[42time] Adding time to SVG elements...');

		const svgElement = document.getElementById("user-locations");
		if (!svgElement) {
			console.log('[42time] SVG element not found');
			return;
		}

		svgElement.querySelectorAll("text").forEach(textElement => {
			const text = textElement.textContent?.trim().toLowerCase();
			if (text && timeData[text]) {
				const { hour, min } = timeData[text];
				const x = textElement.getAttribute("x");
				const y = textElement.getAttribute("y");
				
				// 이미 시간 텍스트가 있는지 확인
				const existingTimeText = Array.from(svgElement.querySelectorAll("text")).find(el => 
					el !== textElement && 
					el.getAttribute("x") === x && 
					el.getAttribute("y") === (parseInt(y) + 12).toString() && 
					el.textContent?.match(/\d+h \d+m/)
				);
				
				if (!existingTimeText) {
					const timeText = document.createElementNS("http://www.w3.org/2000/svg", "text");
					timeText.setAttribute("x", x);
					timeText.setAttribute("y", (parseInt(y) + 12).toString());
					timeText.setAttribute("fill", "#007B7C");
					timeText.setAttribute("font-size", "10");
					timeText.setAttribute("font-family", "sans-serif");
					timeText.textContent = `${hour.toString().padStart(2, "0")}h ${min.toString().padStart(2, "0")}m`;
					
					if (textElement.nextSibling) {
						textElement.parentNode.insertBefore(timeText, textElement.nextSibling);
					} else {
						textElement.parentNode.appendChild(timeText);
					}
					
					console.log('[42time] Time added to SVG for month:', text);
				}
			}
		});
	}

	function setupMutationObserver(timeData) {
		console.log('[42time] Setting up mutation observer...');

		const observer = new MutationObserver((mutations, observer) => {
			const tables = document.querySelectorAll("table.table-fixed");
			let shouldUpdate = false;

			tables.forEach(table => {
				const thead = table.querySelector("thead");
				if (!thead) return;

				const headerRow = thead.querySelector("tr");
				if (!headerRow) return;

				const headers = headerRow.querySelectorAll("th");
				if (!thead.querySelector("tr[data-logtime]") && headers.length > 0) {
					shouldUpdate = true;
				}
			});

			if (shouldUpdate) {
				console.log('[42time] Table detected, adding time data...');
				addTimeRowToTable(timeData);
				observer.disconnect();
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}

	// 메인 실행 함수
	async function initializeExtension() {
		console.log('[42time] Initializing content script...');
		
		try {
			// 설정 로드
			currentSettings = await SettingsManager.load();
			console.log('[42time] Settings loaded:', currentSettings);
			
			UserSearchManager.findUserWithRetry(async (username) => {
				console.log('[42time] Processing user:', username);

				const rawData = await APIManager.fetchUserData(username);
				if (!rawData) {
					console.log('[42time] No data received, aborting');
					return;
				}

				const processedTimeData = APIManager.processTimeData(rawData, currentSettings.showDailyLimit);
				addTimeToSVG(processedTimeData);
				addTimeRowToTable(processedTimeData);
				setupMutationObserver(processedTimeData);
			});
			
		} catch (error) {
			console.error('[42time] Initialization failed:', error);
			// 설정 로드 실패 시 기본값으로 진행
			UserSearchManager.findUserWithRetry(async (username) => {
				console.log('[42time] Processing user with default settings:', username);

				const rawData = await APIManager.fetchUserData(username);
				if (!rawData) {
					console.log('[42time] No data received, aborting');
					return;
				}

				const processedTimeData = APIManager.processTimeData(rawData, false); // 기본값: 제한 없음

				addTimeToSVG(processedTimeData);
				addTimeRowToTable(processedTimeData);
				setupMutationObserver(processedTimeData);
			});
		}
	}

	// 페이지 로드 완료 후 실행
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initializeExtension);
	} else {
		initializeExtension();
	}

	browserAPI.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
		if (message.type === 'SETTINGS_UPDATED') {
			console.log('[42time] Settings updated in content script:', message.settings);
			currentSettings = message.settings;
			
			location.reload();
		}
	});

})();