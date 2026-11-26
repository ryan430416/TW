import { SpotCard } from './SpotCard'
import { spotRepo } from '../repos/SpotRepo'

type SpotListProps = {
  activeRegionId: string | null
}

export function SpotList({ activeRegionId }: SpotListProps) {
  if (!activeRegionId) {
    return (
      <div>
        <h2 className="list-heading">選擇想探索的地區</h2>
        <p className="list-prompt">在地圖上點一個縣市開始探索。手機也可使用地區選單。</p>
      </div>
    )
  }

  const region = spotRepo.getRegion(activeRegionId)
  const spotList = spotRepo.listByRegion(activeRegionId)
  const regionQuery = `?region=${encodeURIComponent(activeRegionId)}`

  return (
    <div>
      <h2 className="list-heading">{region?.nameZh ?? activeRegionId}</h2>
      <p className="list-meta">私房景點 {spotList.length} 處</p>

      {spotList.length === 0 ? (
        <p className="list-empty">這個地區的私房景點正在採集中</p>
      ) : (
        <ul className="spot-list">
          {spotList.map((spot) => {
            const photoList = spotRepo.listPhotosBySpot(spot.spotId)
            return (
              <SpotCard
                key={spot.spotId}
                spot={spot}
                photo={photoList[0]}
                regionQuery={regionQuery}
              />
            )
          })}
        </ul>
      )}
    </div>
  )
}
