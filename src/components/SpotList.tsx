import { SpotCard } from './SpotCard'
import { spotRepo } from '../repos/SpotRepo'

type SpotListProps = {
  activeRegionId: string | null
}

export function SpotList({ activeRegionId }: SpotListProps) {
  if (!activeRegionId) {
    return (
      <div className="list-welcome">
        <p className="list-eyebrow">台灣風土採集冊</p>
        <h1 className="welcome-heading">選一個地方，<br />看看那裡<br /><span>藏著什麼。</span></h1>
        <p className="list-prompt">從地圖選擇縣市，發現值得停留的私房風景。</p>
        <figure className="welcome-photo">
          <img src="/images/taiwan-coast.jpg" alt="台灣海岸旁的翠綠山巒、濱海道路與藍色海洋" width="1200" height="794" />
          <figcaption>
            <span>沿著山海，慢慢發現。</span>
            <a href="https://www.pexels.com/photo/a-road-between-mountain-and-sea-7895493/" target="_blank" rel="noreferrer">攝影 Alix Lee ↗</a>
          </figcaption>
        </figure>
      </div>
    )
  }

  const region = spotRepo.getRegion(activeRegionId)
  const spotList = spotRepo.listByRegion(activeRegionId)
  const regionQuery = `?region=${encodeURIComponent(activeRegionId)}`

  return (
    <div className="region-results" key={activeRegionId}>
      <p className="list-eyebrow">地方採集</p>
      <div className="list-title-row">
        <h1 className="list-heading">{region?.nameZh ?? activeRegionId}</h1>
        <span className="region-result-mark" aria-hidden="true">私房</span>
      </div>
      <p className="list-meta">已採集 <strong>{spotList.length}</strong> 處私房景點</p>

      {spotList.length === 0 ? (
        <div className="list-empty">
          <span className="empty-motif" aria-hidden="true">山海之間</span>
          <h2>風景，正在路上。</h2>
          <p>這個地區的私房景點正在採集中。</p>
          <p>先到地圖上，看看其他地方吧。</p>
        </div>
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
