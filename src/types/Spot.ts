export type PublishStatus = 'draft' | 'published'

export type Region = {
  regionId: string
  nameZh: string
}

export type Spot = {
  spotId: string
  regionId: string
  townName: string
  nameZh: string
  shortIntro: string
  viewHighlight: string
  visitTip: string
  latitude?: number
  longitude?: number
  sourceNote: string
  lastVerifiedOn: string
  status: PublishStatus
}

export type SpotPhoto = {
  photoId: string
  spotId: string
  imagePath: string
  altText: string
  credit: string
  license: string
}

export type SpotBundle = {
  regions: Region[]
  spots: Spot[]
  photos: SpotPhoto[]
}

export type SpotDetail = Spot & {
  regionNameZh: string
  photoList: SpotPhoto[]
}
