/**
 * 將學生填寫的 UTF-8 CSV 驗證後轉成 src/data/spots.json。
 * 驗證失敗時保留原 JSON，不覆寫。
 *
 * 用法：npm run import:spots -- data/spot-collect-template.csv
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { validRegionIdSet } from '../src/data/regions'
import type { Spot, SpotBundle, SpotPhoto, PublishStatus } from '../src/types/Spot'

type CsvRow = Record<string, string>

const requiredHeaders = [
  '景點ID',
  '地區ID',
  '鄉鎮市區',
  '景點名稱',
  '短介紹',
  '觀景特色',
  '到訪提醒',
  '緯度',
  '經度',
  '資料來源',
  '最後確認日期',
  '發布狀態',
  '照片路徑',
  '照片替代文字',
  '攝影署名',
  '照片授權',
] as const

const csvPathArg = process.argv[2]
if (!csvPathArg) {
  console.error('請提供 CSV 路徑，例如：npm run import:spots -- data/spot-collect-template.csv')
  process.exit(1)
}

const csvPath = resolve(csvPathArg)
const jsonPath = resolve('src/data/spots.json')

if (!existsSync(csvPath)) {
  console.error(`找不到 CSV：${csvPath}`)
  process.exit(1)
}

if (!existsSync(jsonPath)) {
  console.error(`找不到既有 JSON：${jsonPath}`)
  process.exit(1)
}

function parseCsv(text: string): CsvRow[] {
  const normalized = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const lines = normalized.split('\n').filter((line) => line.trim().length > 0)
  if (lines.length === 0) {
    throw new Error('CSV 是空的')
  }

  const headers = splitCsvLine(lines[0])
  for (const header of requiredHeaders) {
    if (!headers.includes(header)) {
      throw new Error(`缺少欄位「${header}」`)
    }
  }

  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line)
    const row: CsvRow = {}
    headers.forEach((header, index) => {
      row[header] = (cells[index] ?? '').trim()
    })
    return row
  })
}

function splitCsvLine(line: string): string[] {
  const cells: string[] = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const nextChar = line[index + 1]

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"'
      index += 1
      continue
    }

    if (char === '"') {
      inQuotes = !inQuotes
      continue
    }

    if (char === ',' && !inQuotes) {
      cells.push(current)
      current = ''
      continue
    }

    current += char
  }

  cells.push(current)
  return cells
}

function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function parseOptionalNumber(value: string): number | undefined {
  if (value === '') {
    return undefined
  }
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : Number.NaN
}

const existingBundle = JSON.parse(readFileSync(jsonPath, 'utf8')) as SpotBundle
const errorList: string[] = []

let rows: CsvRow[]
try {
  rows = parseCsv(readFileSync(csvPath, 'utf8'))
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`CSV 解析失敗：${message}`)
  console.error('已保留原本的 spots.json，未覆寫。')
  process.exit(1)
}

const spotList: Spot[] = []
const photoList: SpotPhoto[] = []
const spotIdSet = new Set<string>()
const photoIdSet = new Set<string>()

rows.forEach((row, rowIndex) => {
  const sheetRow = rowIndex + 2
  const spotId = row['景點ID']
  const regionId = row['地區ID']
  const townName = row['鄉鎮市區']
  const nameZh = row['景點名稱']
  const shortIntro = row['短介紹']
  const viewHighlight = row['觀景特色']
  const visitTip = row['到訪提醒']
  const sourceNote = row['資料來源']
  const lastVerifiedOn = row['最後確認日期']
  const statusRaw = row['發布狀態']
  const latitudeRaw = row['緯度']
  const longitudeRaw = row['經度']
  const imagePath = row['照片路徑']
  const altText = row['照片替代文字']
  const credit = row['攝影署名']
  const license = row['照片授權']

  const requiredFields: Array<[string, string]> = [
    ['景點ID', spotId],
    ['地區ID', regionId],
    ['鄉鎮市區', townName],
    ['景點名稱', nameZh],
    ['短介紹', shortIntro],
    ['觀景特色', viewHighlight],
    ['到訪提醒', visitTip],
    ['資料來源', sourceNote],
    ['最後確認日期', lastVerifiedOn],
    ['發布狀態', statusRaw],
  ]

  requiredFields.forEach(([fieldName, fieldValue]) => {
    if (!fieldValue) {
      errorList.push(`第 ${sheetRow} 列：欄位「${fieldName}」必填`)
    }
  })

  if (spotId) {
    if (spotIdSet.has(spotId)) {
      errorList.push(`第 ${sheetRow} 列：欄位「景點ID」重複（${spotId}）`)
    }
    spotIdSet.add(spotId)
  }

  if (regionId && !validRegionIdSet.has(regionId)) {
    errorList.push(`第 ${sheetRow} 列：欄位「地區ID」不是有效縣市（${regionId}）`)
  }

  if (lastVerifiedOn && !isValidDate(lastVerifiedOn)) {
    errorList.push(`第 ${sheetRow} 列：欄位「最後確認日期」須為 YYYY-MM-DD`)
  }

  if (statusRaw && statusRaw !== 'draft' && statusRaw !== 'published') {
    errorList.push(`第 ${sheetRow} 列：欄位「發布狀態」只能是 draft 或 published`)
  }

  const latitude = parseOptionalNumber(latitudeRaw)
  const longitude = parseOptionalNumber(longitudeRaw)
  const hasLat = latitudeRaw !== ''
  const hasLng = longitudeRaw !== ''

  if (hasLat !== hasLng) {
    errorList.push(`第 ${sheetRow} 列：緯度與經度必須成對填寫或同時留空`)
  }

  if (hasLat && Number.isNaN(latitude)) {
    errorList.push(`第 ${sheetRow} 列：欄位「緯度」不是有效數字`)
  }

  if (hasLng && Number.isNaN(longitude)) {
    errorList.push(`第 ${sheetRow} 列：欄位「經度」不是有效數字`)
  }

  if (typeof latitude === 'number' && !Number.isNaN(latitude) && (latitude < -90 || latitude > 90)) {
    errorList.push(`第 ${sheetRow} 列：欄位「緯度」超出範圍（-90～90）`)
  }

  if (
    typeof longitude === 'number' &&
    !Number.isNaN(longitude) &&
    (longitude < -180 || longitude > 180)
  ) {
    errorList.push(`第 ${sheetRow} 列：欄位「經度」超出範圍（-180～180）`)
  }

  const hasAnyPhotoField = Boolean(imagePath || altText || credit || license)
  if (hasAnyPhotoField) {
    if (!imagePath) {
      errorList.push(`第 ${sheetRow} 列：有填照片相關欄位時，「照片路徑」必填`)
    }
    if (!altText) {
      errorList.push(`第 ${sheetRow} 列：有填照片相關欄位時，「照片替代文字」必填`)
    }
    if (!credit) {
      errorList.push(`第 ${sheetRow} 列：有填照片相關欄位時，「攝影署名」必填`)
    }
    if (!license) {
      errorList.push(`第 ${sheetRow} 列：有填照片相關欄位時，「照片授權」必填`)
    }
  }

  if (errorList.some((message) => message.startsWith(`第 ${sheetRow} 列`))) {
    return
  }

  const spot: Spot = {
    spotId,
    regionId,
    townName,
    nameZh,
    shortIntro,
    viewHighlight,
    visitTip,
    sourceNote,
    lastVerifiedOn,
    status: statusRaw as PublishStatus,
  }

  if (hasLat && hasLng) {
    spot.latitude = latitude
    spot.longitude = longitude
  }

  spotList.push(spot)

  if (imagePath) {
    const photoId = `photo-${spotId}-1`
    if (photoIdSet.has(photoId)) {
      errorList.push(`第 ${sheetRow} 列：產生的照片 ID 重複（${photoId}）`)
      return
    }
    photoIdSet.add(photoId)
    photoList.push({
      photoId,
      spotId,
      imagePath,
      altText,
      credit,
      license,
    })
  }
})

if (errorList.length > 0) {
  console.error('驗證失敗，已保留原本的 spots.json：')
  errorList.forEach((message) => console.error(`- ${message}`))
  process.exit(1)
}

const nextBundle: SpotBundle = {
  regions: existingBundle.regions,
  spots: spotList,
  photos: photoList,
}

writeFileSync(jsonPath, `${JSON.stringify(nextBundle, null, 2)}\n`, 'utf8')
console.log(`已匯入 ${spotList.length} 筆景點、${photoList.length} 筆照片 → ${jsonPath}`)
