import spotsBundle from '../data/spots.json'
import { regionById, regionList } from '../data/regions'
import type { Region, Spot, SpotBundle, SpotDetail, SpotPhoto } from '../types/Spot'

/**
 * 景點資料層：畫面只透過這裡讀資料，之後可替換成正式資料庫。
 * 公開網站只回傳 published 狀態。
 */
export class SpotRepo {
  private readonly regionList: Region[]
  private readonly publishedSpotList: Spot[]
  private readonly photoList: SpotPhoto[]

  constructor(bundle: SpotBundle = spotsBundle as SpotBundle) {
    this.regionList = bundle.regions.length > 0 ? bundle.regions : regionList
    this.publishedSpotList = bundle.spots.filter((spot) => spot.status === 'published')
    this.photoList = bundle.photos.filter((photo) =>
      this.publishedSpotList.some((spot) => spot.spotId === photo.spotId),
    )
  }

  listRegions(): Region[] {
    return this.regionList
  }

  getRegion(regionId: string): Region | undefined {
    return this.regionList.find((region) => region.regionId === regionId) ?? regionById[regionId]
  }

  listByRegion(regionId: string): Spot[] {
    return this.publishedSpotList.filter((spot) => spot.regionId === regionId)
  }

  countByRegion(regionId: string): number {
    return this.listByRegion(regionId).length
  }

  getById(spotId: string): SpotDetail | undefined {
    const spot = this.publishedSpotList.find((item) => item.spotId === spotId)
    if (!spot) {
      return undefined
    }

    const region = this.getRegion(spot.regionId)
    return {
      ...spot,
      regionNameZh: region?.nameZh ?? spot.regionId,
      photoList: this.listPhotosBySpot(spot.spotId),
    }
  }

  listPhotosBySpot(spotId: string): SpotPhoto[] {
    return this.photoList.filter((photo) => photo.spotId === spotId)
  }
}

export const spotRepo = new SpotRepo()
