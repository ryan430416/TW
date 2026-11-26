import type { Region } from '../types/Spot'

/** 全台 22 縣市，regionId 供網址與地圖共用 */
export const regionList: Region[] = [
  { regionId: 'keelung', nameZh: '基隆市' },
  { regionId: 'taipei', nameZh: '臺北市' },
  { regionId: 'newtaipei', nameZh: '新北市' },
  { regionId: 'taoyuan', nameZh: '桃園市' },
  { regionId: 'hsinchu_city', nameZh: '新竹市' },
  { regionId: 'hsinchu_county', nameZh: '新竹縣' },
  { regionId: 'miaoli', nameZh: '苗栗縣' },
  { regionId: 'taichung', nameZh: '臺中市' },
  { regionId: 'changhua', nameZh: '彰化縣' },
  { regionId: 'nantou', nameZh: '南投縣' },
  { regionId: 'yunlin', nameZh: '雲林縣' },
  { regionId: 'chiayi_city', nameZh: '嘉義市' },
  { regionId: 'chiayi_county', nameZh: '嘉義縣' },
  { regionId: 'tainan', nameZh: '臺南市' },
  { regionId: 'kaohsiung', nameZh: '高雄市' },
  { regionId: 'pingtung', nameZh: '屏東縣' },
  { regionId: 'yilan', nameZh: '宜蘭縣' },
  { regionId: 'hualien', nameZh: '花蓮縣' },
  { regionId: 'taitung', nameZh: '臺東縣' },
  { regionId: 'penghu', nameZh: '澎湖縣' },
  { regionId: 'kinmen', nameZh: '金門縣' },
  { regionId: 'lienchiang', nameZh: '連江縣' },
]

export const regionById = Object.fromEntries(
  regionList.map((region) => [region.regionId, region]),
) as Record<string, Region>

export const validRegionIdSet = new Set(regionList.map((region) => region.regionId))
