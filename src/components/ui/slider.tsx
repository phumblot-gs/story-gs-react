import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"
import { useBgContext } from "@/components/layout/BgContext"

export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /** Label for the minimum value */
  labelMin?: string
  /** Label for the maximum value */
  labelMax?: string
  /**
   * Label positionné au-dessus du point de la valeur sélectionnée (suit le thumb).
   * Non affiché lorsque la valeur atteint le min si `labelMin` est défini,
   * ni au max si `labelMax` est défini (pour éviter le chevauchement).
   */
  labelCurrent?: string
  /** Debug mode - adds visual indicators and console logs */
  debug?: boolean
  /**
   * Liste des valeurs autorisées (paliers discrets), ex: [2, 3, 6, 10].
   * Quand elle est fournie, le slider n'accepte que ces valeurs (les paliers
   * sont répartis de façon régulière visuellement, quelle que soit leur valeur).
   * `value` / `defaultValue` et `onValueChange` s'expriment alors dans ces
   * valeurs réelles ; ignore `min` / `max` / `step`.
   */
  steps?: number[]
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, labelMin, labelMax, labelCurrent, debug, disabled, onValueChange, steps, value, defaultValue, min, max, step, ...props }, ref) => {
  const bg = useBgContext()

  // Mode "paliers discrets" : on pilote Radix sur des index (0..n-1) et on
  // mappe vers/depuis les valeurs réelles du tableau `steps`.
  const useSteps = Array.isArray(steps) && steps.length > 0

  // Valeur réelle -> index du palier le plus proche
  const toIndices = React.useCallback(
    (vals?: number[]) =>
      vals?.map((v) => {
        let bestIndex = 0
        let bestDist = Infinity
        steps!.forEach((s, i) => {
          const dist = Math.abs(s - v)
          if (dist < bestDist) {
            bestDist = dist
            bestIndex = i
          }
        })
        return bestIndex
      }),
    [steps]
  )

  const rootMin = useSteps ? 0 : min
  const rootMax = useSteps ? steps!.length - 1 : max
  const rootStep = useSteps ? 1 : step
  const rootValue = useSteps ? toIndices(value) : value
  const rootDefaultValue = useSteps ? toIndices(defaultValue) : defaultValue

  // Suivi de la ou les valeur(s) courante(s) (en valeurs réelles) pour
  // positionner `labelCurrent`. Contrôlé -> on suit `value` ; non contrôlé -> état interne.
  const [internalValues, setInternalValues] = React.useState<number[]>(
    () => value ?? defaultValue ?? []
  )
  React.useEffect(() => {
    if (value !== undefined) setInternalValues(value)
  }, [value])
  const currentValues = value ?? internalValues

  // Position (en %) d'une valeur réelle le long de la piste.
  const getPercent = React.useCallback(
    (v: number) => {
      if (useSteps) {
        const idx = toIndices([v])![0]
        return steps!.length > 1 ? (idx / (steps!.length - 1)) * 100 : 0
      }
      const lo = min ?? 0
      const hi = max ?? 100
      return hi > lo ? ((v - lo) / (hi - lo)) * 100 : 0
    },
    [useSteps, steps, toIndices, min, max]
  )

  // Alignement des labels sur le centre réel du thumb.
  // Radix rentre les thumbs dans la piste ("in-bounds offset") : la position
  // effective est `calc(P% + offset)` avec offset = (thumbWidth/2)*(1 - P/50).
  // Le thumb fait 10px (cf. classe ci-dessous) => demi-largeur = 5px.
  const HALF_THUMB = 5
  const alignedLeft = React.useCallback((percent: number) => {
    const offset = HALF_THUMB * (1 - percent / 50)
    const sign = offset >= 0 ? "+" : "-"
    return `calc(${percent}% ${sign} ${Math.abs(offset)}px)`
  }, [])

  // Determine colors based on data-bg context
  const getSliderStyles = () => {
    const isDisabled = disabled

    if (bg === "black") {
      return {
        rail: "bg-black-secondary",
        track: isDisabled ? "bg-grey-stronger" : "bg-white",
        thumb: isDisabled ? "bg-grey-stronger" : "bg-white",
        thumbBorder: isDisabled ? "border-grey-stronger" : "border-white",
        labelColor: isDisabled ? "text-grey-stronger" : "text-white",
      }
    } else if (bg === "grey") {
      return {
        rail: "bg-white",
        track: isDisabled ? "bg-grey-stronger" : "bg-black",
        thumb: isDisabled ? "bg-grey-stronger" : "bg-black",
        thumbBorder: isDisabled ? "border-grey-stronger" : "border-black",
        labelColor: isDisabled ? "text-grey-stronger" : "text-black",
      }
    } else {
      // Default: white background
      return {
        rail: "bg-grey-lighter",
        track: isDisabled ? "bg-grey-stronger" : "bg-black",
        thumb: isDisabled ? "bg-grey-stronger" : "bg-black",
        thumbBorder: isDisabled ? "border-grey-stronger" : "border-black",
        labelColor: isDisabled ? "text-grey-stronger" : "text-black",
      }
    }
  }

  const styles = getSliderStyles()

  // Debug mode: wrapper for onValueChange with log.
  // En mode `steps`, Radix renvoie des index qu'on retraduit en valeurs réelles.
  const handleValueChange = React.useCallback(
    (raw: number[]) => {
      const mapped = useSteps ? raw.map((i) => steps![i]) : raw
      // Non contrôlé : on mémorise pour positionner labelCurrent.
      if (value === undefined) setInternalValues(mapped)
      if (debug) {
        console.log("[Slider ValueChange]", {
          value: mapped,
          rawIndices: useSteps ? raw : undefined,
          bg,
          disabled,
          labelMin,
          labelMax,
          min: rootMin,
          max: rootMax,
          step: rootStep,
          steps,
        })
      }
      onValueChange?.(mapped)
    },
    [debug, bg, disabled, labelMin, labelMax, rootMin, rootMax, rootStep, useSteps, steps, value, onValueChange]
  )

  return (
    <div
      className={cn(
        "relative flex flex-col gap-2 items-center py-1",
        debug && "ring-2 ring-pink ring-offset-2",
        className
      )}
      data-bg={bg || undefined}
    >
      {/* Labels : chacun est centré sur l'extrémité correspondante de la piste
          (labelMin sur le point de gauche, labelMax sur le point de droite).
          labelCurrent est centré au-dessus du point de la valeur sélectionnée. */}
      {(labelMin !== undefined || labelMax !== undefined || labelCurrent !== undefined) && (
        <div className="relative w-full min-h-[1.5em]">
          {labelMin !== undefined && (
            <p
              className={cn(
                "absolute -translate-x-1/2 font-regular text-center whitespace-pre",
                styles.labelColor
              )}
              style={{ left: alignedLeft(0) }}
            >
              {labelMin}
            </p>
          )}
          {labelMax !== undefined && (
            <p
              className={cn(
                "absolute -translate-x-1/2 font-regular text-center whitespace-pre",
                styles.labelColor
              )}
              style={{ left: alignedLeft(100) }}
            >
              {labelMax}
            </p>
          )}
          {labelCurrent !== undefined &&
            currentValues.map((v, i) => {
              const percent = getPercent(v)
              // Masqué s'il tombe sur une extrémité déjà étiquetée.
              if (percent <= 0 && labelMin !== undefined) return null
              if (percent >= 100 && labelMax !== undefined) return null
              return (
                <p
                  key={i}
                  className={cn(
                    "absolute -translate-x-1/2 font-regular text-center whitespace-pre",
                    styles.labelColor
                  )}
                  style={{ left: alignedLeft(percent) }}
                >
                  {labelCurrent}
                </p>
              )
            })}
        </div>
      )}

      {/* Slider */}
      <SliderPrimitive.Root
        ref={ref}
        className={cn("relative flex w-full touch-none select-none items-baseline", debug && "ring-1 ring-pink")}
        disabled={disabled}
        min={rootMin}
        max={rootMax}
        step={rootStep}
        value={rootValue}
        defaultValue={rootDefaultValue}
        onValueChange={handleValueChange}
        {...props}
      >
        <SliderPrimitive.Track
          className={cn(
            "relative h-[2px] w-full grow overflow-visible rounded-[1px]",
            styles.rail
          )}
        >
          <SliderPrimitive.Range
            className={cn("absolute h-full", styles.track)}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className={cn(
            "block h-[10px] w-[10px] rounded-full border-0 transition-colors",
            "absolute top-1/2 -translate-x-1/2 -translate-y-1/2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
            styles.thumb
          )}
        />
      </SliderPrimitive.Root>

      {/* Debug indicator */}
      {debug && (
        <span className="absolute -top-6 left-0 text-xs bg-pink text-white px-1 rounded whitespace-nowrap z-10">
          {bg || "no-bg"}
        </span>
      )}
    </div>
  )
})

Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
