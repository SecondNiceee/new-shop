"use client"

import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Autoplay from "embla-carousel-autoplay"
import { useSiteSettings } from "@/entities/siteSettings/SiteSettingsStore"
import type { Media } from "@/payload-types"
import Link from "next/link"

export default function HeroSlider() {
  const siteSettings = useSiteSettings((state) => state.siteSettings)
  const slides = siteSettings?.slider?.slides || []

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      containScroll: "trimSnaps",
      skipSnaps: false,
      dragFree: false,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })],
  )

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(false)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index)
    },
    [emblaApi],
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [emblaApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
  }, [emblaApi, onSelect])

  if (!slides || slides.length === 0) {
    return null
  }

  const getTextColorClass = (color: string) => {
    switch (color) {
      case "black":
        return "text-black"
      case "gray":
        return "text-gray-600"
      case "red":
        return "text-red-500"
      case "blue":
        return "text-blue-500"
      case "green":
        return "text-green-500"
      case "yellow":
        return "text-yellow-500"
      case "white":
      default:
        return "text-white"
    }
  }

  const getButtonVariant = (style: string) => {
    switch (style) {
      case "secondary":
        return "secondary"
      case "outline":
        return "outline"
      case "primary":
      default:
        return "default"
    }
  }

  return (
    <section className="relative max-w-7xl mx-auto px-4 md:py-4 py-2 w-full overflow-hidden">
      <div className="embla w-full overflow-hidden" ref={emblaRef}>
        <div className="embla__container w-full flex">
          {slides.map((slide, index) => {
            const imageUrl = (slide.image as Media).url
            const titleColor = getTextColorClass(slide.titleColor || "white")
            const subtitleColor = getTextColorClass(slide.subtitleColor || "white")
            const hasContent = slide.title || slide.subtitle || slide.button?.text

            return (
              <div key={index} className="embla__slide flex-[0_0_100%] min-w-0 relative">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={(slide.image as Media).alt}
                  className="w-full rounded-lg aspect-[1280/200] object-cover"
                />

                {hasContent && (
                  <div className="absolute inset-0 flex items-center my-auto">
                    <div className="px-4 max-w-2xl">
                      {slide.title && (
                        <h2 className={`text-2xl md:text-4xl lg:text-5xl font-bold mb-4 ${titleColor} drop-shadow-lg`}>
                          {slide.title}
                        </h2>
                      )}

                      {slide.subtitle && (
                        <p className={`text-lg md:text-xl font-semibold mb-6 ${subtitleColor} drop-shadow-md`}>{slide.subtitle}</p>
                      )}

                      {slide.button?.text && (
                        <div className="mt-6">
                          {slide.button.link ? (
                            <Link href={slide.button.link}>
                              <Button
                                variant={getButtonVariant(slide.button.style || "primary")}
                                size="lg"
                                className="shadow-lg"
                              >
                                {slide.button.text}
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              variant={getButtonVariant(slide.button.style || "primary")}
                              size="lg"
                              className="shadow-lg"
                            >
                              {slide.button.text}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white border-white/50 shadow-lg"
        onClick={scrollPrev}
        disabled={prevBtnDisabled}
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white border-white/50 shadow-lg"
        onClick={scrollNext}
        disabled={nextBtnDisabled}
      >
        <ChevronRight className="h-6 w-6 text-gray-800" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === selectedIndex ? "bg-white shadow-lg" : "bg-white/50 hover:bg-white/70"
            }`}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </section>
  )
}
