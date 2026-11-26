import { useMemo, useState } from 'react'
import type { FocusEvent, KeyboardEvent, MouseEvent } from 'react'
import taiwanMap from '../data/taiwan-map.json'
import { regionById } from '../data/regions'

type RegionMapProps = {
  activeRegionId: string | null
  hoverRegionId: string | null
  onHoverRegion: (regionId: string | null) => void
  onSelectRegion: (regionId: string) => void
}

type LabelPos = {
  left: number
  top: number
}

export function RegionMap({
  activeRegionId,
  hoverRegionId,
  onHoverRegion,
  onSelectRegion,
}: RegionMapProps) {
  const [labelPos, setLabelPos] = useState<LabelPos | null>(null)

  const hoverNameZh = useMemo(() => {
    if (!hoverRegionId) {
      return null
    }
    return regionById[hoverRegionId]?.nameZh ?? null
  }, [hoverRegionId])

  function handleRegionEnter(
    regionId: string,
    event: MouseEvent<SVGGElement> | FocusEvent<SVGGElement>,
  ) {
    onHoverRegion(regionId)
    const svg = event.currentTarget.ownerSVGElement
    if (!svg) {
      return
    }
    const bounds = svg.getBoundingClientRect()
    if ('clientX' in event) {
      setLabelPos({
        left: event.clientX - bounds.left,
        top: event.clientY - bounds.top,
      })
      return
    }
    const pathBounds = event.currentTarget.getBoundingClientRect()
    setLabelPos({
      left: pathBounds.left + pathBounds.width / 2 - bounds.left,
      top: pathBounds.top - bounds.top,
    })
  }

  function handleRegionMove(event: MouseEvent<SVGGElement>) {
    const svg = event.currentTarget.ownerSVGElement
    if (!svg) {
      return
    }
    const bounds = svg.getBoundingClientRect()
    setLabelPos({
      left: event.clientX - bounds.left,
      top: event.clientY - bounds.top,
    })
  }

  function handleRegionLeave() {
    onHoverRegion(null)
    setLabelPos(null)
  }

  function handleRegionKeyDown(
    regionId: string,
    event: KeyboardEvent<SVGGElement>,
  ) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelectRegion(regionId)
    }
  }

  return (
    <div className="region-map">
      <svg
        className="region-map-svg"
        viewBox={taiwanMap.viewBox}
        role="img"
        aria-label="台灣縣市互動地圖"
      >
        {taiwanMap.insetFrames.map((frame) => (
          <g key={`frame-${frame.regionId}`} aria-hidden="true">
            <rect
              className="map-inset-frame"
              x={frame.x}
              y={frame.y}
              width={frame.width}
              height={frame.height}
            />
            <text className="map-inset-label" x={frame.x + 12} y={frame.y + 28}>
              {frame.label}
            </text>
          </g>
        ))}

        {taiwanMap.paths.map((pathItem) => {
          const isSelected = activeRegionId === pathItem.regionId
          const isHovered = hoverRegionId === pathItem.regionId
          return (
            <g
              key={pathItem.regionId}
              className={[
                'region-group',
                isSelected ? 'is-selected' : '',
                isHovered ? 'is-hovered' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              tabIndex={0}
              role="button"
              aria-pressed={isSelected}
              aria-label={pathItem.nameZh}
              onMouseEnter={(event) => handleRegionEnter(pathItem.regionId, event)}
              onMouseMove={handleRegionMove}
              onMouseLeave={handleRegionLeave}
              onFocus={(event) => handleRegionEnter(pathItem.regionId, event)}
              onBlur={handleRegionLeave}
              onClick={() => onSelectRegion(pathItem.regionId)}
              onKeyDown={(event) => handleRegionKeyDown(pathItem.regionId, event)}
            >
              <path className="region-hit" d={pathItem.pathD} />
              <path className="region-shape" d={pathItem.pathD} />
            </g>
          )
        })}

        {taiwanMap.islandMarkers.map((marker) => {
          const isSelected = activeRegionId === marker.regionId
          return (
            <g
              key={marker.id}
              className={['island-marker', isSelected ? 'is-selected' : '']
                .filter(Boolean)
                .join(' ')}
              tabIndex={0}
              role="button"
              aria-label={`${marker.label}（${regionById[marker.regionId]?.nameZh ?? ''}）`}
              onMouseEnter={(event) => handleRegionEnter(marker.regionId, event)}
              onMouseMove={handleRegionMove}
              onMouseLeave={handleRegionLeave}
              onFocus={(event) => handleRegionEnter(marker.regionId, event)}
              onBlur={handleRegionLeave}
              onClick={() => onSelectRegion(marker.regionId)}
              onKeyDown={(event) => handleRegionKeyDown(marker.regionId, event)}
            >
              <circle className="island-marker-hit" cx={marker.cx} cy={marker.cy} r={18} />
              <circle className="island-marker-dot" cx={marker.cx} cy={marker.cy} r={6} />
              <text
                className="island-marker-label"
                x={marker.cx + 12}
                y={marker.cy + 5}
              >
                {marker.label}
              </text>
            </g>
          )
        })}
      </svg>

      {hoverNameZh && labelPos ? (
        <div
          className="map-hover-label"
          style={{ left: labelPos.left, top: labelPos.top }}
        >
          {hoverNameZh}
        </div>
      ) : null}

      <p className="map-source-note">
        地圖資料：{taiwanMap.source.agency} {taiwanMap.source.file}／
        {taiwanMap.source.license}／衍生自 {taiwanMap.source.derivedFrom}。
        {taiwanMap.source.note}
      </p>
    </div>
  )
}
