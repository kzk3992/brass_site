/* ================================================================
   Musical Gifts カスタムJS
   ================================================================ */

$(function() {

  /* --- イベントタブ フィルタリング --- */
  $('.event-tab').on('click', function() {
    $('.event-tab').removeClass('active');
    $(this).addClass('active');
    var filter = $(this).data('filter');
    if (filter === 'all') {
      $('.event-item').removeClass('hidden');
    } else {
      $('.event-item').each(function() {
        if ($(this).data('type') === filter) {
          $(this).removeClass('hidden');
        } else {
          $(this).addClass('hidden');
        }
      });
    }
  });

  /* --- カレンダー設定上書き ---
     parts.jsのカレンダーが生成された後に
     練習日（毎週土曜）とイベント日を色分けする。
     parts.jsのstoreClosedWeekDays / storeClosedDatesを
     練習日・イベント日として流用。
     ※ parts.jsのstoreClosedWeekDaysを土曜(6)に変更することを推奨。
     ここでは生成後のDOMを補正する形で対応。
  --- */

  // カレンダー生成後にイベント日セルにクラスを付与
  // parts.jsのstoreClosedDates（特別な日）をイベント日として使用済み
  // → parts.cssのstore-specific-partsの色をgreen系に上書き済み（custom.css）

  /* --- サイドバー：次回イベント自動選択 --- */
  (function() {
    var monthMap = {JAN:0,FEB:1,MAR:2,APR:3,MAY:4,JUN:5,JUL:6,AUG:7,SEP:8,OCT:9,NOV:10,DEC:11};
    var dayNames = ['日','月','火','水','木','金','土'];
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var nextDate = null;
    var $nextEl = null;

    $('.event-item').each(function() {
      var monthStr = $(this).find('.event-month').text().trim().toUpperCase();
      var day = parseInt($(this).find('.event-day').text().trim(), 10);
      var month = monthMap[monthStr];
      if (month === undefined || isNaN(day)) return;

      var year = today.getFullYear();
      var d = new Date(year, month, day);
      if (d < today) d = new Date(year + 1, month, day);

      if (!nextDate || d < nextDate) {
        nextDate = d;
        $nextEl = $(this);
      }
    });

    if (!$nextEl) return;

    var dateStr = nextDate.getFullYear() + '年' + (nextDate.getMonth() + 1) + '月' + nextDate.getDate() + '日（' + dayNames[nextDate.getDay()] + '）';
    var title = $nextEl.find('.event-title').clone().find('.event-tag').remove().end().text().trim();
    var $metaClone = $nextEl.find('.event-meta').clone();
    $metaClone.find('i').remove();
    var metaParts = $metaClone.text().split('\u3000').map(function(s){ return s.trim(); }).filter(Boolean);
    var place = metaParts[0] || '';
    var timeNote = metaParts.slice(1).join('\u3000');

    $('.side-event-date').text(dateStr);
    $('.side-event-title').text(title);
    if (place) $('.side-event-place').html('<i class="fa-solid fa-location-dot"></i> ' + place);
    if (timeNote) $('.side-event-time').html('<i class="fa-regular fa-clock"></i> ' + timeNote);
    else $('.side-event-time').text('');
  })();

});
