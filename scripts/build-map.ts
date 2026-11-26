/**
 * 將 pdmaptw 縣市 SVG 轉成網站使用的地圖路徑資料。
 * 來源：內政部國土測繪中心 COUNTY_MOI_1140318，政府資料開放授權條款第 1 版
 * 衍生：pdmaptw v2.4.0（離島已位移以便同畫面呈現）
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const rootDir = join(scriptDir, '..')

const moiCodeToRegionId: Record<string, string> = {
  '09007': 'lienchiang',
  '09020': 'kinmen',
  '10002': 'yilan',
  '10004': 'hsinchu_county',
  '10005': 'miaoli',
  '10007': 'changhua',
  '10008': 'nantou',
  '10009': 'yunlin',
  '10010': 'chiayi_county',
  '10013': 'pingtung',
  '10014': 'taitung',
  '10015': 'hualien',
  '10016': 'penghu',
  '10017': 'keelung',
  '10018': 'hsinchu_city',
  '10020': 'chiayi_city',
  '63000': 'taipei',
  '64000': 'kaohsiung',
  '65000': 'newtaipei',
  '66000': 'taichung',
  '67000': 'tainan',
  '68000': 'taoyuan',
}

type MapPath = {
  regionId: string
  moiCode: string
  nameZh: string
  pathD: string
}

type InsetFrame = {
  regionId: string
  label: string
  x: number
  y: number
  width: number
  height: number
}

type IslandMarker = {
  id: string
  label: string
  regionId: string
  cx: number
  cy: number
}

type MapData = {
  viewBox: string
  source: {
    name: string
    agency: string
    file: string
    license: string
    derivedFrom: string
    note: string
  }
  paths: MapPath[]
  insetFrames: InsetFrame[]
  islandMarkers: IslandMarker[]
}

function parseViewBox(svgText: string): string {
  const match = svgText.match(/viewBox="([^"]+)"/)
  if (!match) {
    throw new Error('找不到 SVG viewBox')
  }
  return match[1]
}

function parsePaths(svgText: string): MapPath[] {
  const pathRegex =
    /<path\s+id="(\d+)"\s+data-name="([^"]+)"\s+d="([^"]+)"\s*\/>/g
  const paths: MapPath[] = []
  let match: RegExpExecArray | null

  while ((match = pathRegex.exec(svgText)) !== null) {
    const moiCode = match[1]
    const nameZh = match[2]
    const pathD = match[3]
    const regionId = moiCodeToRegionId[moiCode]
    if (!regionId) {
      throw new Error(`未知縣市代碼：${moiCode}（${nameZh}）`)
    }
    paths.push({ regionId, moiCode, nameZh, pathD })
  }

  if (paths.length !== 22) {
    throw new Error(`預期 22 個縣市路徑，實際取得 ${paths.length}`)
  }

  return paths
}

function buildMapData(svgText: string): MapData {
  return {
    viewBox: parseViewBox(svgText),
    source: {
      name: '直轄市、縣（市）界線（TWD97經緯度）',
      agency: '內政部國土測繪中心',
      file: 'COUNTY_MOI_1140318（2025-03-18）',
      license: '政府資料開放授權條款第 1 版（Open Government Data License, version 1.0）',
      derivedFrom: 'pdmaptw v2.4.0 county-2025-03-18.svg',
      note: '澎湖、金門、連江等離島位置經位移，以便與本島同畫面呈現；非真實地理位置。',
    },
    paths: parsePaths(svgText),
    insetFrames: [
      {
        regionId: 'lienchiang',
        label: '連江縣（馬祖）',
        x: 200,
        y: 20,
        width: 250,
        height: 185,
      },
      {
        regionId: 'kinmen',
        label: '金門縣',
        x: 20,
        y: 110,
        width: 250,
        height: 260,
      },
      {
        regionId: 'penghu',
        label: '澎湖縣',
        x: 95,
        y: 560,
        width: 145,
        height: 245,
      },
    ],
    islandMarkers: [
      {
        id: 'island-liuqiu',
        label: '小琉球',
        regionId: 'pingtung',
        cx: 386,
        cy: 1090,
      },
      {
        id: 'island-green',
        label: '綠島',
        regionId: 'taitung',
        cx: 788,
        cy: 975,
      },
      {
        id: 'island-orchid',
        label: '蘭嶼',
        regionId: 'taitung',
        cx: 808,
        cy: 1195,
      },
    ],
  }
}

const svgPath = join(rootDir, 'public', 'map', 'county-source.svg')
const outPath = join(rootDir, 'src', 'data', 'taiwan-map.json')

const svgText = readFileSync(svgPath, 'utf8')
const mapData = buildMapData(svgText)

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, `${JSON.stringify(mapData, null, 2)}\n`, 'utf8')

console.log(`已寫入 ${outPath}（${mapData.paths.length} 縣市）`)
