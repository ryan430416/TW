import { Link, useParams } from 'react-router-dom'
import { spotRepo } from '../repos/SpotRepo'

export function SpotDetailPage() {
  const { spotId = '' } = useParams()
  const spotDetail = spotRepo.getById(spotId)

  if (!spotDetail) {
    return (
      <section className="page-not-found">
        <div className="not-found-box">
          <h1>找不到這個景點</h1>
          <p>網址中的景點不存在，或尚未發布。</p>
          <p className="spot-actions">
            <Link className="btn btn-primary" to="/">
              回首頁
            </Link>
          </p>
        </div>
      </section>
    )
  }

  const backToRegionPath = `/?region=${encodeURIComponent(spotDetail.regionId)}`
  const hasCoords =
    typeof spotDetail.latitude === 'number' && typeof spotDetail.longitude === 'number'
  const mapUrl = hasCoords
    ? `https://www.openstreetmap.org/?mlat=${spotDetail.latitude}&mlon=${spotDetail.longitude}#map=16/${spotDetail.latitude}/${spotDetail.longitude}`
    : null
  const mainPhoto = spotDetail.photoList[0]

  return (
    <article className="page-spot">
      <header className="spot-detail-header">
        <div>
          <h1 className="spot-detail-title">{spotDetail.nameZh}</h1>
          <p className="spot-detail-place">
            {spotDetail.regionNameZh} · {spotDetail.townName}
          </p>
        </div>
        <Link className="btn" to={backToRegionPath}>
          返回這個縣市
        </Link>
      </header>

      <div className="spot-detail-grid">
        <div>
          {mainPhoto ? (
            <figure className="spot-photo-frame">
              <img src={mainPhoto.imagePath} alt={mainPhoto.altText} />
              <figcaption>
                攝影：{mainPhoto.credit}｜授權：{mainPhoto.license}
              </figcaption>
            </figure>
          ) : null}

          <section className="spot-section">
            <h2>簡介</h2>
            <p>{spotDetail.shortIntro}</p>
          </section>
        </div>

        <div>
          <section className="spot-section">
            <h2>這裡值得看什麼</h2>
            <p>{spotDetail.viewHighlight}</p>
          </section>

          <section className="spot-section">
            <h2>當地人會提醒你的事</h2>
            <p>{spotDetail.visitTip}</p>
          </section>

          <div className="spot-actions">
            {mapUrl ? (
              <a className="btn btn-primary" href={mapUrl} target="_blank" rel="noreferrer">
                查看地圖位置
              </a>
            ) : null}
            <Link className="btn" to={backToRegionPath}>
              返回這個縣市
            </Link>
          </div>

          <p className="spot-meta">
            資料來源：{spotDetail.sourceNote}
            <br />
            最後確認：{spotDetail.lastVerifiedOn}
          </p>
        </div>
      </div>
    </article>
  )
}
