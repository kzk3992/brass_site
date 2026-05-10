# brass_site site_config.json対応 実装プロンプト

## 作業概要

`brass_site`ディレクトリを、静的サイト管理アプリ（site-manager）から管理できる形に変換する。
具体的には以下の2ファイルを新規作成する。

1. `site_config.json` — サイト定義ファイル
2. `template.html` — Jinja2テンプレート（現在のindex.htmlを変換）
3. `content.json` — 現在のindex.htmlのハードコードされた内容を初期データとして抽出

CSSファイル・JSファイル・画像ファイルは一切変更しない。

---

## 作業対象ディレクトリ

```
brass_site/
├── index.html        ← Jinja2テンプレート化の元ファイル（変更しない）
├── template.html     ← 新規作成（index.htmlをJinja2化したもの）
├── site_config.json  ← 新規作成
├── content.json      ← 新規作成
├── css/
│   ├── style.css
│   ├── custom.css
│   ├── parts.css
│   ├── theme.css
│   └── inview.css
├── js/
│   ├── main.js
│   ├── parts.js
│   ├── custom.js
│   └── jquery.inview_set.js
└── images/
    └── mainimg1.jpg（他画像）
```

---

## Step 1：site_config.json を作成する

以下の内容で `brass_site/site_config.json` を作成する。

```json
{
  "site_name": "伊那フィルハーモニック吹奏楽団",
  "git_remote": "https://github.com/kzk3992/brass_site.git",
  "git_branch": "main",
  "sections": [
    {
      "id": "site_info",
      "label": "基本情報",
      "type": "fields",
      "fields": [
        {"key": "name",           "label": "団体名",               "type": "text"},
        {"key": "sub_name",       "label": "サブタイトル（英語）",   "type": "text"},
        {"key": "catch_copy",     "label": "キャッチコピー",         "type": "text"},
        {"key": "description",    "label": "団体説明文",            "type": "textarea"},
        {"key": "line_url",       "label": "LINE URL",              "type": "url"},
        {"key": "instagram_url",  "label": "Instagram URL",         "type": "url"},
        {"key": "instagram_embed","label": "Instagram埋め込みコード","type": "textarea"}
      ]
    },
    {
      "id": "about",
      "label": "活動概要",
      "type": "fields",
      "fields": [
        {"key": "member_count",  "label": "団員数",         "type": "text"},
        {"key": "concert_count", "label": "年間演奏会数",   "type": "text"},
        {"key": "practice_day",  "label": "練習日",         "type": "text"},
        {"key": "practice_place","label": "練習場所（短）", "type": "text"},
        {"key": "about_text",    "label": "団体説明文（本文）","type": "textarea"}
      ]
    },
    {
      "id": "news",
      "label": "お知らせ",
      "type": "list",
      "item_fields": [
        {"key": "date", "label": "日付",  "type": "date"},
        {"key": "text", "label": "内容",  "type": "text"}
      ]
    },
    {
      "id": "events",
      "label": "イベント情報",
      "type": "list",
      "item_fields": [
        {"key": "month", "label": "月（英字3文字・例：JUN）", "type": "text"},
        {"key": "day",   "label": "日（例：8）",              "type": "text"},
        {"key": "title", "label": "タイトル",                 "type": "text"},
        {"key": "tag",   "label": "タグ",                     "type": "select",
         "options": [
           {"value": "concert", "label": "演奏会"},
           {"value": "open",    "label": "一般公開"},
           {"value": "recruit", "label": "参加募集"}
         ]},
        {"key": "place", "label": "場所",   "type": "text"},
        {"key": "time",  "label": "時間",   "type": "text"},
        {"key": "note",  "label": "備考",   "type": "text"}
      ]
    },
    {
      "id": "calendar_events",
      "label": "カレンダー（イベント日）",
      "type": "list",
      "item_fields": [
        {"key": "date", "label": "日付（YYYY-MM-DD）", "type": "date"}
      ]
    },
    {
      "id": "recruit",
      "label": "団員募集",
      "type": "fields",
      "fields": [
        {"key": "lead",           "label": "リード文",                    "type": "textarea"},
        {"key": "parts",          "label": "募集パート（1行1パート）",     "type": "textarea"},
        {"key": "practice_day",   "label": "練習日",                     "type": "text"},
        {"key": "practice_place", "label": "練習場所",                   "type": "text"},
        {"key": "fee",            "label": "団費",                       "type": "text"},
        {"key": "visit",          "label": "見学について",                "type": "text"}
      ]
    },
    {
      "id": "next_event",
      "label": "次回イベント（サイドバー）",
      "type": "fields",
      "fields": [
        {"key": "date",  "label": "日付テキスト（例：2026年6月8日（日））","type": "text"},
        {"key": "title", "label": "イベント名",                          "type": "text"},
        {"key": "place", "label": "場所",                               "type": "text"},
        {"key": "time",  "label": "時間・入場情報",                      "type": "text"}
      ]
    },
    {
      "id": "hero_image",
      "label": "メイン画像",
      "type": "image",
      "target_path": "images/mainimg1.jpg"
    }
  ]
}
```

---

## Step 2：content.json を作成する

現在の `index.html` のハードコードされた内容を初期値として、
`brass_site/content.json` を作成する。

```json
{
  "site_info": {
    "name": "伊那フィルハーモニック吹奏楽団",
    "sub_name": "INA PHILHARMONIC WINDS",
    "catch_copy": "音楽で、伊那をつなぐ。",
    "description": "地域に根ざした吹奏楽の演奏活動を通じて、市民の皆様に生演奏の喜びをお届けします。",
    "line_url": "#",
    "instagram_url": "#",
    "instagram_embed": ""
  },
  "about": {
    "member_count": "32名",
    "concert_count": "年2回",
    "practice_day": "毎週土",
    "practice_place": "公民館・市民センター",
    "about_text": "伊那フィルハーモニック吹奏楽団は、長野県伊那市を拠点に活動するアマチュア吹奏楽団です。定期演奏会をはじめ、地域のイベントへの出演や小学生向けの楽器体験教室など、音楽を通じた地域貢献活動に積極的に取り組んでいます。"
  },
  "news": [
    {"date": "2026/05/01", "text": "第16回定期演奏会のプログラムを公開しました。"},
    {"date": "2026/04/15", "text": "7月開催の小学生向け楽器体験教室の参加者募集を開始しました。"},
    {"date": "2026/04/01", "text": "2026年度の活動スケジュールを更新しました。"},
    {"date": "2026/03/20", "text": "市民まつりへの出演が決定しました。"},
    {"date": "2026/03/01", "text": "新団員を募集しています。見学はいつでも歓迎しています。"}
  ],
  "events": [
    {
      "month": "JUN", "day": "8",
      "title": "第16回定期演奏会", "tag": "concert",
      "place": "伊那文化会館 大ホール", "time": "開演 14:00", "note": "入場無料"
    },
    {
      "month": "JUN", "day": "22",
      "title": "市民まつり出演", "tag": "open",
      "place": "伊那市中央通り", "time": "10:00〜12:00", "note": ""
    },
    {
      "month": "JUL", "day": "5",
      "title": "小学生向け楽器体験教室", "tag": "recruit",
      "place": "伊那市民体育館", "time": "", "note": "定員20名・参加無料"
    },
    {
      "month": "AUG", "day": "17",
      "title": "サマーコンサート", "tag": "concert",
      "place": "高遠町文化センター", "time": "開演 15:00", "note": ""
    }
  ],
  "calendar_events": [
    {"date": "2026-06-08"},
    {"date": "2026-06-22"},
    {"date": "2026-07-05"},
    {"date": "2026-08-17"}
  ],
  "recruit": {
    "lead": "経験者・未経験者問わず歓迎しています。まずは見学からお気軽にどうぞ。",
    "parts": "フルート・オーボエ・クラリネット・ファゴット\nトランペット・ホルン・トロンボーン・ユーフォニアム・チューバ\nサクソフォン全般\n打楽器全般（マリンバ・ティンパニ等）\n楽器をお持ちでない方も、まずはご相談ください。",
    "practice_day": "毎週土曜日 午後2:00〜5:00",
    "practice_place": "伊那市内の公民館・市民センター（月により変動）",
    "fee": "月額3,000円（学生は相談可）",
    "visit": "事前連絡不要・随時受付"
  },
  "next_event": {
    "date": "2026年6月8日（日）",
    "title": "第16回定期演奏会",
    "place": "伊那文化会館 大ホール",
    "time": "開演 14:00 / 入場無料"
  }
}
```

---

## Step 3：template.html を作成する

`brass_site/index.html` をベースに、ハードコードされた箇所を
Jinja2変数・ループ・条件分岐に置き換えた `brass_site/template.html` を作成する。

### タグラベルの対応表（テンプレート内で使用）

```
concert → 演奏会
open    → 一般公開
recruit → 参加募集
```

### 変換対象箇所と変換内容

以下の箇所を変換する。それ以外のHTML・CSS・JSは一切変更しない。

---

**① `<title>` タグ**
```html
<!-- 変換前 -->
<title>伊那フィルハーモニック吹奏楽団</title>

<!-- 変換後 -->
<title>{{ site_info.name }}</title>
```

---

**② `<meta name="description">`**
```html
<!-- 変換前 -->
<meta name="description" content="伊那フィルハーモニック吹奏楽団の公式サイトです。...">

<!-- 変換後 -->
<meta name="description" content="{{ site_info.description }}">
```

---

**③ ヘッダーロゴ**
```html
<!-- 変換前 -->
<span id="logo-text">伊那フィルハーモニック吹奏楽団<span>INA PHILHARMONIC WINDS</span></span>

<!-- 変換後 -->
<span id="logo-text">{{ site_info.name }}<span>{{ site_info.sub_name }}</span></span>
```

---

**④ ヘッダーLINEボタン**
```html
<!-- 変換前 -->
<a href="#contact" class="header-contact-btn">

<!-- 変換後 -->
<a href="{{ site_info.line_url }}" class="header-contact-btn">
```

---

**⑤ メインビジュアル**
```html
<!-- 変換前 -->
<picture>
  <source media="(max-width: 800px)" srcset="images/mainimg1.jpg">
  <img src="images/mainimg1.jpg" alt="伊那フィルハーモニック吹奏楽団">
</picture>
<p class="hero-sub">INA PHILHARMONIC WINDS</p>
<h2 class="hero-main">音楽で、伊那をつなぐ。</h2>
<p class="hero-desc">地域に根ざした吹奏楽の演奏活動を通じて、<br>市民の皆様に生演奏の喜びをお届けします。</p>

<!-- 変換後 -->
<picture>
  <source media="(max-width: 800px)" srcset="images/mainimg1.jpg">
  <img src="images/mainimg1.jpg" alt="{{ site_info.name }}">
</picture>
<p class="hero-sub">{{ site_info.sub_name }}</p>
<h2 class="hero-main">{{ site_info.catch_copy }}</h2>
<p class="hero-desc">{{ site_info.description }}</p>
```

---

**⑥ 活動概要カード**
```html
<!-- 変換前 -->
<div class="about-num">32<span>名</span></div>
<div class="about-label">団員数（募集中）</div>
...
<div class="about-num">年<span>2</span>回</div>
...
<div class="about-num">毎週<span>土</span></div>
...
伊那市内<br><span style="font-size:0.85rem;">公民館・市民センター</span>

<!-- 変換後 -->
<div class="about-num">{{ about.member_count }}</div>
<div class="about-label">団員数（募集中）</div>
...
<div class="about-num">{{ about.concert_count }}</div>
...
<div class="about-num">{{ about.practice_day }}</div>
...
{{ about.practice_place }}
```

---

**⑦ 団体説明文**
```html
<!-- 変換前 -->
<p>伊那フィルハーモニック吹奏楽団は、長野県伊那市を...</p>

<!-- 変換後 -->
<p>{{ about.about_text }}</p>
```

---

**⑧ イベントリスト**

タグラベルの日本語変換はJinja2のmappingで処理する。

```html
<!-- 変換前（ハードコードされた4件） -->
<div class="event-item" data-type="concert">
  ...
</div>

<!-- 変換後 -->
{% set tag_labels = {"concert": "演奏会", "open": "一般公開", "recruit": "参加募集"} %}
{% for event in events %}
<div class="event-item" data-type="{{ event.tag }}">
  <div class="event-date">
    <span class="event-month">{{ event.month }}</span>
    <span class="event-day">{{ event.day }}</span>
  </div>
  <div class="event-info">
    <div class="event-title">
      {{ event.title }}
      <span class="event-tag tag-{{ event.tag }}">{{ tag_labels[event.tag] }}</span>
    </div>
    <div class="event-meta">
      <i class="fa-solid fa-location-dot"></i> {{ event.place }}
      {% if event.time %}　<i class="fa-regular fa-clock"></i> {{ event.time }}{% endif %}
      {% if event.note %}　{{ event.note }}{% endif %}
    </div>
  </div>
</div>
{% endfor %}
```

---

**⑨ カレンダーのイベント日（JS変数として渡す）**

parts.jsのstoreClosedDatesをJinja2で動的生成する。
`js/parts.js`は変更しない。代わりにテンプレート内のscriptタグより前に
インラインscriptを追加してparts.jsの変数を上書きする。

```html
<!-- テンプレートに追加（</body>直前のscriptタグ群の前に挿入） -->
<script>
// site-managerが生成したイベント日データでparts.jsの設定を上書き
window._siteManagerCalendarEvents = {{ calendar_events | tojson }};
</script>
```

`js/custom.js` に以下を追加して、parts.jsのカレンダー生成後にイベント日を反映する処理を実装する：

```javascript
// custom.jsの末尾に追加
// site-managerのカレンダーイベント日をparts.jsのstoreClosedDatesに統合
if (window._siteManagerCalendarEvents) {
  // parts.jsのstoreClosedDates変数は直接上書きできないため
  // カレンダー生成後にDOMを操作してイベント日のセルにクラスを付与する
  // （parts.jsのstoreClosedDatesを直接書き換えるより安全）
}
```

**注意：** カレンダーのイベント日反映については、parts.jsの実装を確認した上で
最も安全な方法（DOM操作 or parts.js内変数の直接書き換え）を選択すること。

---

**⑩ お知らせリスト**
```html
<!-- 変換前 -->
<dl class="news2-parts">
<dt>2026/05/01</dt><dd>第16回定期演奏会のプログラムを公開しました。</dd>
...
</dl>

<!-- 変換後 -->
<dl class="news2-parts">
{% for item in news %}
<dt>{{ item.date }}</dt><dd>{{ item.text }}</dd>
{% endfor %}
</dl>
```

---

**⑪ 団員募集セクション**
```html
<!-- 変換前 -->
<p class="recruit-lead">経験者・未経験者問わず歓迎しています。...</p>
<ul class="recruit-list">
  <li>..フルート・..</li>
  ...
</ul>
<div class="recruit-detail-item"><span class="recruit-detail-label">練習日</span><span>毎週土曜日 午後2:00〜5:00</span></div>
...

<!-- 変換後 -->
<p class="recruit-lead">{{ recruit.lead }}</p>
<ul class="recruit-list">
{% for part in recruit.parts.split('\n') %}
{% if part.strip() %}
  <li><i class="fa-solid fa-music"></i> {{ part }}</li>
{% endif %}
{% endfor %}
</ul>
<div class="recruit-detail-item"><span class="recruit-detail-label">練習日</span><span>{{ recruit.practice_day }}</span></div>
<div class="recruit-detail-item"><span class="recruit-detail-label">練習場所</span><span>{{ recruit.practice_place }}</span></div>
<div class="recruit-detail-item"><span class="recruit-detail-label">団費</span><span>{{ recruit.fee }}</span></div>
<div class="recruit-detail-item"><span class="recruit-detail-label">見学</span><span>{{ recruit.visit }}</span></div>
```

---

**⑫ お問い合わせリンク**
```html
<!-- 変換前 -->
<a href="#" class="contact-btn-line">
<a href="#" class="contact-btn-instagram">

<!-- 変換後 -->
<a href="{{ site_info.line_url }}" class="contact-btn-line">
<a href="{{ site_info.instagram_url }}" class="contact-btn-instagram">
```

---

**⑬ Instagram埋め込みセクション（お問い合わせセクションの直前に追加）**
```html
{% if site_info.instagram_embed %}
<section id="instagram">
<h2 class="section-title">Instagram<span>SNS</span></h2>
<div class="instagram-embed">
  {{ site_info.instagram_embed | safe }}
</div>
</section>
{% endif %}
```

---

**⑭ サイドバー：SNSリンク**
```html
<!-- 変換前 -->
<a href="#" class="side-line-btn">
<a href="#" class="side-instagram-btn">

<!-- 変換後 -->
<a href="{{ site_info.line_url }}" class="side-line-btn">
<a href="{{ site_info.instagram_url }}" class="side-instagram-btn">
```

---

**⑮ サイドバー：次回イベント**
```html
<!-- 変換前 -->
<p class="side-event-date">2026年6月8日（日）</p>
<p class="side-event-title">第16回定期演奏会</p>
<p class="side-event-place">... 伊那文化会館 大ホール</p>
<p class="side-event-time">... 開演 14:00 / 入場無料</p>

<!-- 変換後 -->
<p class="side-event-date">{{ next_event.date }}</p>
<p class="side-event-title">{{ next_event.title }}</p>
<p class="side-event-place"><i class="fa-solid fa-location-dot"></i> {{ next_event.place }}</p>
<p class="side-event-time"><i class="fa-regular fa-clock"></i> {{ next_event.time }}</p>
```

---

**⑯ フッター**
```html
<!-- 変換前 -->
<div class="footer-logo">伊那フィルハーモニック吹奏楽団<span>INA PHILHARMONIC WINDS</span></div>

<!-- 変換後 -->
<div class="footer-logo">{{ site_info.name }}<span>{{ site_info.sub_name }}</span></div>
```

---

## Step 4：動作確認

以下の順序で確認を行うこと。

### テスト
- `site_config.json` が有効なJSONであることを確認（jsonlint等）
- `content.json` が有効なJSONであることを確認
- `template.html` にJinja2構文エラーがないことを確認

### スモークテスト
Pythonで単体レンダリングを実行して `index.html` が正しく生成されることを確認する。

```python
from jinja2 import Environment, FileSystemLoader
import json

site_dir = "D:/brass_site"  # 実際のパスに変更

with open(f"{site_dir}/content.json", "r", encoding="utf-8") as f:
    content = json.load(f)

env = Environment(loader=FileSystemLoader(site_dir))
template = env.get_template("template.html")
html = template.render(**content)

with open(f"{site_dir}/index_test.html", "w", encoding="utf-8") as f:
    f.write(html)

print("生成完了：index_test.html を確認してください")
```

`index_test.html` をブラウザで開き、以下を確認する：
- 団体名・キャッチコピーが正しく表示される
- イベントリストが4件表示される
- お知らせが5件表示される
- 団員募集のパートリストが正しく表示される
- サイドバーの次回イベントが表示される

### 本番確認
スモークテストで問題がなければ `index_test.html` を `index.html` にリネームして
ブラウザで最終確認する。
