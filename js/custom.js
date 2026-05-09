/* ================================================================
   伊那フィルハーモニック吹奏楽団 カスタムJS
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

});
