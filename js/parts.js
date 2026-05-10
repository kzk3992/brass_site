/* ================================================================
   以下、Builder で選択したパーツのJS（自動連結）
   ================================================================ */

/* ---- カレンダー（ui-tools-calender1） (ui-tools-calender1) ---- */
//===============================================================
// カレンダー（2026年〜2027年）
//===============================================================
$(function() {
  // リンクで移動可能な期間（例：2026年～2027年）
  const minYear = 2026;
  const maxYear = 2027;
  
  // 祝日（年ごとに指定）削除、追加できます。
  // ※2026/2027 は内閣府の「国民の祝日・休日」一覧に合わせています。
  const holidays = {
    "2026": {
      "01-01": true, // 元日
      "01-12": true, // 成人の日
      "02-11": true, // 建国記念の日
      "02-23": true, // 天皇誕生日
      "03-20": true, // 春分の日
      "04-29": true, // 昭和の日
      "05-03": true, // 憲法記念日
      "05-04": true, // みどりの日
      "05-05": true, // こどもの日
      "05-06": true, // 休日（祝日法第3条第2項による休日）
      "07-20": true, // 海の日
      "08-11": true, // 山の日
      "09-21": true, // 敬老の日
      "09-22": true, // 休日（祝日法第3条第3項による休日）
      "09-23": true, // 秋分の日
      "10-12": true, // スポーツの日
      "11-03": true, // 文化の日
      "11-23": true, // 勤労感謝の日
    },
    "2027": {
      "01-01": true, // 元日
      "01-11": true, // 成人の日
      "02-11": true, // 建国記念の日
      "02-23": true, // 天皇誕生日
      "03-21": true, // 春分の日
      "03-22": true, // 休日（祝日法第3条第2項による休日）
      "04-29": true, // 昭和の日
      "05-03": true, // 憲法記念日
      "05-04": true, // みどりの日
      "05-05": true, // こどもの日
      "07-19": true, // 海の日
      "08-11": true, // 山の日
      "09-20": true, // 敬老の日
      "09-23": true, // 秋分の日
      "10-11": true, // スポーツの日
      "11-03": true, // 文化の日
      "11-23": true, // 勤労感謝の日
    },
  };

  // 練習日（不定期 - window._mgPracticeDates で管理）
  const storeClosedWeekDays = {};

  // 練習日（特定日）
  const practiceDates = (function() {
    const _dates = window._mgPracticeDates || [];
    const _result = {};
    _dates.forEach(function(e) {
      const yr = e.date.substring(0, 4);
      const md = e.date.substring(5, 7) + "-" + e.date.substring(8, 10);
      if (!_result[yr]) _result[yr] = {};
      _result[yr][md] = true;
    });
    return _result;
  })();

  // イベント・演奏会日（template.html のインラインscriptで window._mgCalendarEvents を設定）
  const storeClosedDates = (function() {
    const _dates = window._mgCalendarEvents || [];
    const _result = {};
    _dates.forEach(function(e) {
      const yr = e.date.substring(0, 4);
      const md = e.date.substring(5, 7) + "-" + e.date.substring(8, 10);
      if (!_result[yr]) _result[yr] = {};
      _result[yr][md] = true;
    });
    return _result;
  })();

  // 練習日から外す日（祝日など）
  const storeOpenDates = {
    "2026": {
    },
    "2027": {
    }
  };

  // 現在の年月（グローバル変数として管理）
  const today = new Date();
  let currentYear = today.getFullYear();
  let currentMonth = today.getMonth(); // 0～11
  
  // 範囲外の場合は、設定範囲内に補正
  if(currentYear < minYear){
    currentYear = minYear;
    currentMonth = 0;
  } else if(currentYear > maxYear){
    currentYear = maxYear;
    currentMonth = 11;
  }

  // カレンダー描画用の関数
  function renderCalendar(year, month) {
    // 対象年の祝日、特別な日、営業日オーバーライドのオブジェクト
    const currentHolidays = holidays[year] || {};
    const currentStoreClosedDates = storeClosedDates[year] || {};
    const currentStoreOpenDates = storeOpenDates[year] || {};
    const currentPracticeDates = practiceDates[year] || {};
    
    // 曜日の名称（日本語）
    const weekDays = ["日", "月", "火", "水", "木", "金", "土"];
    
    // 当月初日・最終日
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const numDays = lastDay.getDate();
    const startDay = firstDay.getDay();
    
    let html = "<table class='ui-tools-calender1-parts'>";
    
    // キャプションに前月・翌月のリンクを配置
    html += "<caption>";
    // 前月の計算
    const prevMonth = (month === 0) ? 11 : month - 1;
    const prevYear = (month === 0) ? year - 1 : year;
    if(prevYear >= minYear) {
      html += "<a href='#' id='prevMonth'><i class=\"fa-solid fa-angles-left\"></i></a>";
    } else {
      html += "<i class=\"fa-solid fa-angles-left\"></i>";
    }
    html += year + "年 " + (month + 1) + "月";
    // 翌月の計算
    const nextMonth = (month === 11) ? 0 : month + 1;
    const nextYear = (month === 11) ? year + 1 : year;
    if(nextYear <= maxYear) {
      html += "<a href='#' id='nextMonth'><i class=\"fa-solid fa-angles-right\"></i></a>";
    } else {
      html += "<i class=\"fa-solid fa-angles-right\"></i>";
    }
    html += "</caption>";
    
    // 曜日ヘッダー
    html += "<tr>";
    for (let i = 0; i < weekDays.length; i++){
      html += "<th>" + weekDays[i] + "</th>";
    }
    html += "</tr>";
    
    // 日付セルの生成
    let day = 1;
    for (let i = 0; i < 6; i++){
      html += "<tr>";
      for (let j = 0; j < 7; j++){
        if(i === 0 && j < startDay) {
          html += "<td></td>";
        } else if(day > numDays) {
          html += "<td></td>";
        } else {
          const m = ("0" + (month + 1)).slice(-2);
          const d = ("0" + day).slice(-2);
          const key = m + "-" + d;
          
          if(currentPracticeDates[key]){
            // 練習日（不定期）
            html += "<td class='store-weekly-parts'>" + day + "</td>";
          } else if(currentStoreClosedDates[key]){
            html += "<td class='store-specific-parts'>" + day + "</td>";
          } else if(currentStoreOpenDates[key]){
            if(currentHolidays[key]){
              html += "<td class='holiday-parts'>" + day + "</td>";
            } else if(j === 0){
              html += "<td class='sunday-parts'>" + day + "</td>";
            } else if(j === 6){
              html += "<td class='saturday-parts'>" + day + "</td>";
            } else {
              html += "<td>" + day + "</td>";
            }
          } else if(storeClosedWeekDays[j]){
            // 毎週指定された定休日（現在は未使用）
            html += "<td class='store-weekly-parts'>" + day + "</td>";
          } else if(currentHolidays[key]){
            // 祝日
            html += "<td class='holiday-parts'>" + day + "</td>";
          } else if(j === 0) {
            // 日曜日
            html += "<td class='sunday-parts'>" + day + "</td>";
          } else if(j === 6) {
            // 土曜日
            html += "<td class='saturday-parts'>" + day + "</td>";
          } else {
            html += "<td>" + day + "</td>";
          }
          day++;
        }
      }
      html += "</tr>";
      if(day > numDays) break;
    }
    html += "</table>";
    
    // カレンダー領域に出力
    $("#ui-tools-calender1-parts").html(html);
    
    // 前月リンクのクリックイベント
    $("#prevMonth").click(function(e){
      e.preventDefault();
      if(prevYear < minYear) return;
      currentYear = prevYear;
      currentMonth = prevMonth;
      renderCalendar(currentYear, currentMonth);
    });
    
    // 翌月リンクのクリックイベント
    $("#nextMonth").click(function(e){
      e.preventDefault();
      if(nextYear > maxYear) return;
      currentYear = nextYear;
      currentMonth = nextMonth;
      renderCalendar(currentYear, currentMonth);
    });
  }
  
  // 初期描画
  renderCalendar(currentYear, currentMonth);
});
