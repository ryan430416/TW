import { Link } from 'react-router-dom'
import type { Spot, SpotPhoto } from '../types/Spot'

type SpotCardProps = {
  spot: Spot
  photo?: SpotPhoto
  regionQuery: string
}

export function SpotCard({ spot, photo, regionQuery }: SpotCardProps) {
  return (
    <li>
      <Link
        className={['spot-card-link', photo ? '' : 'is-no-photo'].filter(Boolean).join(' ')}
        to={`/spots/${spot.spotId}${regionQuery}`}
      >
        {photo ? (
          <img
            className="spot-card-thumb"
            src={photo.imagePath}
            alt={photo.altText}
            loading="lazy"
          />
        ) : null}
        <div>
          <h3 className="spot-card-title">{spot.nameZh}</h3>
          <p className="spot-card-town">{spot.townName}</p>
          <p className="spot-card-intro">{spot.shortIntro}</p>
        </div>
      </Link>
    </li>
  )
}
