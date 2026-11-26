import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RegionMap } from '../components/RegionMap'
import { RegionSelect } from '../components/RegionSelect'
import { SpotList } from '../components/SpotList'
import { validRegionIdSet } from '../data/regions'

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [hoverRegionId, setHoverRegionId] = useState<string | null>(null)

  const activeRegionId = useMemo(() => {
    const regionFromUrl = searchParams.get('region')
    if (regionFromUrl && validRegionIdSet.has(regionFromUrl)) {
      return regionFromUrl
    }
    return null
  }, [searchParams])

  const handleSelectRegion = useCallback(
    (regionId: string) => {
      setSearchParams({ region: regionId }, { replace: false })
    },
    [setSearchParams],
  )

  return (
    <section className="home-layout" aria-label="私房景點探索">
      <div className="home-map-pane">
        <div className="map-toolbar">
          <p className="map-heading">本島與離島</p>
          <RegionSelect
            activeRegionId={activeRegionId}
            onSelectRegion={handleSelectRegion}
          />
        </div>
        <RegionMap
          activeRegionId={activeRegionId}
          hoverRegionId={hoverRegionId}
          onHoverRegion={setHoverRegionId}
          onSelectRegion={handleSelectRegion}
        />
      </div>
      <aside className="home-list-pane" aria-live="polite">
        <SpotList activeRegionId={activeRegionId} />
      </aside>
    </section>
  )
}
