# 台灣私房景點地圖

第一版主架構：以互動縣市地圖探索全台私房景點。介面為繁體中文，支援電腦與手機。景點資料目前由本機 JSON 驅動，之後可替換成正式資料庫。

## 啟動

```bash
npm install
npm run dev
```

建置正式檔：

```bash
npm run build
npm run preview
```

## CSV 匯入

1. 用 Excel 或 Google 試算表開啟 `data/spot-collect-template.csv`（UTF-8）。
2. 依欄位填寫後另存，再執行：

```bash
npm run import:spots -- data/你的檔案.csv
```

驗證成功會**整份覆寫** `src/data/spots.json` 的 `spots` 與 `photos`（`regions` 保留）。驗證失敗時會列出「第幾列／哪個欄位」，並**保留**原本檔案。

### 填寫示例（一列）

| 景點ID | 地區ID | 鄉鎮市區 | 景點名稱 | 短介紹 | 觀景特色 | 到訪提醒 | 緯度 | 經度 | 資料來源 | 最後確認日期 | 發布狀態 | 照片路徑 | 照片替代文字 | 攝影署名 | 照片授權 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| demo-yilan-bridge | yilan | 頭城鎮 | 【展示】橋頭看海點 | 這是 CSV 範例列… | 適合練習填寫觀景特色欄位。 | 展示資料：請勿當成真實到訪建議。 | 24.8603 | 121.8236 | 學生採集範例 | 2026-03-01 | published | /photos/demo-paper.svg | 展示用插圖 | 專案展示圖 | CC0 |

### 欄位對照

| CSV 欄名 | JSON／型別欄位 | 說明 |
| --- | --- | --- |
| 景點ID | `spotId` | 穩定唯一 ID |
| 地區ID | `regionId` | 見下方縣市 ID |
| 鄉鎮市區 | `townName` | 例如「西區」 |
| 景點名稱 | `nameZh` | 顯示名稱 |
| 短介紹 | `shortIntro` | 清單與詳情簡介 |
| 觀景特色 | `viewHighlight` | 「這裡值得看什麼」 |
| 到訪提醒 | `visitTip` | 「當地人會提醒你的事」 |
| 緯度／經度 | `latitude`／`longitude` | 選填，須成對 |
| 資料來源 | `sourceNote` | 採集來源說明 |
| 最後確認日期 | `lastVerifiedOn` | `YYYY-MM-DD` |
| 發布狀態 | `status` | `draft` 或 `published` |
| 照片路徑 | `SpotPhoto.imagePath` | 選填；有填則署名與授權必填 |
| 照片替代文字 | `altText` | |
| 攝影署名 | `credit` | |
| 照片授權 | `license` | |

公開網站只讀取 `published`。草稿請不要放進會被打包的公開資料。

### 縣市 `regionId`

`keelung` `taipei` `newtaipei` `taoyuan` `hsinchu_city` `hsinchu_county` `miaoli` `taichung` `changhua` `nantou` `yunlin` `chiayi_city` `chiayi_county` `tainan` `kaohsiung` `pingtung` `yilan` `hualien` `taitung` `penghu` `kinmen` `lienchiang`

## 地圖資料來源

- 原始：內政部國土測繪中心《直轄市、縣（市）界線》，`COUNTY_MOI_1140318`
- 授權：政府資料開放授權條款第 1 版
- 衍生 SVG：pdmaptw v2.4.0（離島已位移以便同畫面）
- 說明檔：`public/map/ATTRIBUTION.md`
- 重新產生地圖 JSON：`npm run build:map`

## 主要 CSS 位置

視覺變數與樣式集中在：

- `src/styles/tokens.css`：色彩、字體、間距、圓角、浮動幅度
- `src/styles/base.css`：全站基礎
- `src/styles/home.css`：首頁左右版面與清單
- `src/styles/map.css`：地圖 hover／focus／selected
- `src/styles/spot.css`：景點詳情
- 入口：`src/index.css`

地圖顏色與動畫請改 CSS，不要寫死在元件邏輯裡。

## 之後要新增景點改哪裡

1. **建議流程**：編輯 CSV → `npm run import:spots -- 你的檔案.csv`
2. **或直接改** `src/data/spots.json`（`spots`／`photos`）
3. 照片放到 `public/photos/`，路徑寫成 `/photos/檔名`
4. 讀取邏輯在 `src/repos/SpotRepo.ts`；畫面元件不要直接散落讀檔

## 展示資料說明

內建少量標示為「【展示】」的虛構景點（臺中、澎湖、臺東），僅供測試流程，**不是真實開放資訊或到訪建議**。彰化等未放資料的縣市可測「正在採集中」狀態。

## 後續擴充方向（本版不做）

未來交通只考慮：

1. **自行開車**
2. **合作司機媒合**

本版不建立交通頁面、假按鈕或媒合流程。

## 驗收流程建議

1. 首頁 → 選臺中市 → 點進展示景點 → 返回後仍選中臺中市（網址含 `?region=taichung`）
2. 點澎湖放大框或離島標記，確認清單更新
3. 選一個沒有景點的縣市（例如彰化），應看到「正在採集中」
