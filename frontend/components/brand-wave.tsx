type BrandWaveProps = {
  barCount?: number
  maxHeight?: number
}

export function BrandWave({ barCount = 17, maxHeight = 40 }: BrandWaveProps) {
  const bars = [18, 30, 42, 28, 36, 46, 32, 26, 40, 34, 44, 30, 36, 42, 28, 38, 24, 32, 26, 40, 34, 44, 30, 36]

  return (
    <div className="flex items-center justify-center gap-[3px]" aria-hidden="true">
      {bars.slice(0, barCount).map((height, index) => (
        <span
          key={`${height}-${index}`}
          className="w-[2.5px] rounded-full bg-primary/90"
          style={{ height: `${Math.min(height, maxHeight)}px` }}
        />
      ))}
    </div>
  )
}
