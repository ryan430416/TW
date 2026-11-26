# 地圖資料來源與授權

## 原始資料

- 名稱：直轄市、縣（市）界線（TWD97經緯度）
- 機關：內政部國土測繪中心
- 檔案版本：COUNTY_MOI_1140318（2025-03-18）
- 授權：[政府資料開放授權條款第 1 版](https://data.gov.tw/license)
- 資料集：https://data.gov.tw/dataset/7442

## 本專案使用的衍生檔

- `county-source.svg`：取自 [pdmaptw v2.4.0](https://github.com/plotdb/pdmaptw/releases/tag/v2.4.0) 的 `county-2025-03-18.svg`
- 網站實際繪製使用 `src/data/taiwan-map.json`（由 `npm run build:map` 自上述 SVG 轉換）

## 注意

澎湖、金門、連江等離島在 SVG 中經過位移，方便與台灣本島同畫面呈現，**不是真實地理位置**。
需要真實座標請使用同一份 release 的 GeoJSON，或政府原始資料。
