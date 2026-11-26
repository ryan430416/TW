import { regionList } from '../data/regions'

type RegionSelectProps = {
  activeRegionId: string | null
  onSelectRegion: (regionId: string) => void
}

export function RegionSelect({ activeRegionId, onSelectRegion }: RegionSelectProps) {
  return (
    <div className="region-select-bar">
      <label htmlFor="region-select">地區選單</label>
      <select
        id="region-select"
        value={activeRegionId ?? ''}
        onChange={(event) => {
          if (event.target.value) {
            onSelectRegion(event.target.value)
          }
        }}
      >
        <option value="" disabled>
          選擇縣市
        </option>
        {regionList.map((region) => (
          <option key={region.regionId} value={region.regionId}>
            {region.nameZh}
          </option>
        ))}
      </select>
    </div>
  )
}
