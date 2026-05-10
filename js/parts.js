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

  // 練習日（不定期 - window._mgPracticeDetails で管理）
  const storeClosedWeekDays = {};

  // 練習日（特定日）
  const practiceDates = (function() {
    const _dates = window._mgPracticeDetails || [];
    const _result = {};
    _dates.forEach(function(e) {
      if (!e.date) return;
      const yr = e.date.substring(0, 4);
      const md = e.date.substring(5, 7) + "-" + e.date.substring(8, 10);
      if (!_result[yr]) _result[yr] = {};
      _result[yr][md] = e;
    });
    return _result;
  })();

  // イベント・演奏会日（template.html のインラインscriptで window._mgEventDetails を設定）
  const storeClosedDates = (function() {
    const _dates = window._mgEventDetails || [];
    const _result = {};
    _dates.forEach(function(e) {
      if (!e.date) return;
      const yr = e.date.substring(0, 4);
      const md = e.date.substring(5, 7) + "-" + e.date.substring(8, 10);
      if (!_result[yr]) _result[yr] = {};
      _result[yr][md] = e;
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
            html += "<td class='store-weekly-parts cal-clickable' data-type='practice' data-datekey='" + year + "-" + m + "-" + d + "'>" + day + "</td>";
          } else if(currentStoreClosedDates[key]){
            html += "<td class='store-specific-parts cal-clickable' data-type='event' data-datekey='" + year + "-" + m + "-" + d + "'>" + day + "</td>";
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

  // カレンダー詳細ポップアップモーダル
  $('body').append(
    '<div id="cal-detail-modal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.55);z-index:9998;">' +
    '<div style="background:#fff;max-width:340px;width:90%;margin:28vh auto;padding:24px 20px;border-radius:12px;position:relative;box-shadow:0 6px 30px rgba(0,0,0,0.25);">' +
    '<button id="cal-modal-close-btn" style="position:absolute;top:8px;right:12px;background:none;border:none;font-size:24px;cursor:pointer;color:#999;line-height:1;">&times;</button>' +
    '<div id="cal-detail-body" style="font-size:15px;line-height:1.8;"></div>' +
    '</div></div>'
  );
  $('#cal-detail-modal').on('click', function(e) {
    if ($(e.target).is('#cal-detail-modal')) $(this).hide();
  });
  $('#cal-modal-close-btn').on('click', function() { $('#cal-detail-modal').hide(); });

  var tagMap = {concert: '演奏会', open: '一般公開', recruit: '参加募集'};
  var tagColor = {concert: '#1a73e8', open: '#e65100', recruit: '#7b1fa2'};

  $(document).on('click', '.cal-clickable', function() {
    var type = $(this).data('type');
    var datekey = $(this).data('datekey');
    var yr = datekey.substring(0, 4);
    var md = datekey.substring(5, 7) + '-' + datekey.substring(8, 10);
    var bodyHtml = '';

    if (type === 'event') {
      var ev = (storeClosedDates[yr] || {})[md];
      if (ev && typeof ev === 'object') {
        bodyHtml += '<p style="margin:0 0 4px;font-size:12px;color:#999;">' + datekey + '</p>';
        var tColor = tagColor[ev.tag] || '#555';
        if (ev.tag && tagMap[ev.tag]) {
          bodyHtml += '<span style="display:inline-block;background:' + tColor + ';color:#fff;font-size:11px;padding:2px 10px;border-radius:20px;margin-bottom:8px;">' + tagMap[ev.tag] + '</span>';
        }
        bodyHtml += '<p style="margin:0 0 10px;font-size:17px;font-weight:bold;">' + (ev.title || '') + '</p>';
        if (ev.place) bodyHtml += '<p style="margin:3px 0;"><i class="fa-solid fa-location-dot"></i> ' + ev.place + '</p>';
        if (ev.time)  bodyHtml += '<p style="margin:3px 0;"><i class="fa-regular fa-clock"></i> ' + ev.time + '</p>';
        if (ev.note)  bodyHtml += '<p style="margin:6px 0 0;font-size:13px;color:#666;">' + ev.note + '</p>';
      }
    } else if (type === 'practice') {
      var pr = (practiceDates[yr] || {})[md];
      if (pr && typeof pr === 'object') {
        bodyHtml += '<p style="margin:0 0 4px;font-size:12px;color:#999;">' + datekey + '</p>';
        bodyHtml += '<span style="display:inline-block;background:#388e3c;color:#fff;font-size:11px;padding:2px 10px;border-radius:20px;margin-bottom:8px;">練習日</span>';
        if (pr.time)  bodyHtml += '<p style="margin:3px 0;"><i class="fa-regular fa-clock"></i> ' + pr.time + '</p>';
        if (pr.place) bodyHtml += '<p style="margin:3px 0;"><i class="fa-solid fa-location-dot"></i> ' + pr.place + '</p>';
        if (pr.note)  bodyHtml += '<p style="margin:6px 0 0;font-size:13px;color:#666;">' + pr.note + '</p>';
      }
    }

    if (bodyHtml) {
      $('#cal-detail-body').html(bodyHtml);
      $('#cal-detail-modal').fadeIn(150);
    }
  });
});
