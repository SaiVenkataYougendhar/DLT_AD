import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Activity } from "lucide-react";

export interface CarouselSlide {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  badge: string;
  accuracy: string;
}

const defaultSlides: CarouselSlide[] = [
  {
    src: "/samples/sample-meningioma.jpg",
    alt: "Meningioma Cranial MRI",
    title: "Meningioma Dural Sign",
    subtitle: "Sharply circumscribed extra-axial mass with homogeneous contrast uptake",
    badge: "Neuro-Oncology",
    accuracy: "82.9% Confidence",
  },
  {
    src: "/samples/sample-glioma.jpg",
    alt: "Glioblastoma Infiltration",
    title: "High-Grade Glioma",
    subtitle: "Infiltrative hyperintensity with necrotic core and surrounding vasogenic edema",
    badge: "Neuro-Oncology",
    accuracy: "87.3% Confidence",
  },
  {
    src: "/samples/sample-pituitary.jpg",
    alt: "Pituitary Macroadenoma",
    title: "Pituitary Adenoma",
    subtitle: "Sellar floor erosion with suprasellar compression of the optic chiasm",
    badge: "Neuro-Endocrine",
    accuracy: "70.8% Confidence",
  },
  {
    src: "/samples/sample-notumor.jpg",
    alt: "Healthy Control Scan",
    title: "Normal Control Brain",
    subtitle: "Symmetric ventricular contours without mass effect or midline shift",
    badge: "Healthy Control",
    accuracy: "94.2% Confidence",
  },
  {
    src: "/samples/sample-meningioma.jpg",
    alt: "Thoracic High-Res CT",
    title: "Thoracic Pulmonary Nodule",
    subtitle: "Ground-glass opacity with peripheral spiculation evaluated via CT radiomics",
    badge: "Pulmonary / Thorax",
    accuracy: "88.5% Confidence",
  },
  {
    src: "/samples/sample-glioma.jpg",
    alt: "Hepatic Dynamic MRI",
    title: "Hepato-Biliary Lesion",
    subtitle: "Arterial phase hyper-enhancement with delayed venous wash-out profiling",
    badge: "Abdominal / Liver",
    accuracy: "81.0% Confidence",
  },
];

interface Skiper54CarouselProps {
  slides?: CarouselSlide[];
  className?: string;
  autoplay?: boolean;
}

/**
 * Skiper54 - Dynamic Clip-Path Carousel
 * Features Embla Carousel integration, Framer Motion dynamic clip-path morphing,
 * blur-fade text transitions, navigation buttons, and responsive breakpoints.
 */
export const Skiper54Carousel: React.FC<Skiper54CarouselProps> = ({
  slides = defaultSlides,
  className = "",
  autoplay = true,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false },
    autoplay ? [Autoplay({ delay: 3500, stopOnInteraction: true })] : []
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((idx: number) => emblaApi && emblaApi.scrollTo(idx), [emblaApi]);

  return (
    <div className={`relative w-full overflow-hidden py-10 ${className}`}>
      {/* Top Header */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row mb-8 px-4 max-w-7xl mx-auto">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-2">
            <Sparkles size={13} />
            <span>Multi-Modal Clinical Library</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            Curated Pathological Modalities Carousel
          </h2>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={scrollPrev}
            aria-label="Previous Slide"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 shadow-sm transition hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next Slide"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 shadow-sm transition hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Embla Viewport */}
      <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex touch-pan-y -ml-4">
          {slides.map((slide, index) => {
            const isActive = selectedIndex === index;
            return (
              <div
                key={index}
                className="flex-none pl-4 w-[85%] sm:w-[60%] md:w-[42%] lg:w-[32%]"
              >
                <div className="relative py-2">
                  <motion.div
                    initial={false}
                    animate={{
                      clipPath: isActive
                        ? "inset(0% 0% 0% 0% round 1.5rem)"
                        : "inset(6% 0% 6% 0% round 1.5rem)",
                      scale: isActive ? 1 : 0.94,
                      opacity: isActive ? 1 : 0.7,
                    }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black shadow-lg"
                  >
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      className="w-full h-full object-contain bg-black transition-transform duration-500 hover:scale-105"
                    />

                    {/* Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur text-[10px] font-mono font-bold text-blue-400 border border-blue-500/30">
                      {slide.badge}
                    </div>

                    {/* Confidence Pill */}
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/75 backdrop-blur text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
                      {slide.accuracy}
                    </div>

                    {/* Bottom gradient overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-end">
                      <h4 className="text-base font-bold text-white leading-tight">
                        {slide.title}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                        {slide.subtitle}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Dot Indicators */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              selectedIndex === index
                ? "w-8 bg-blue-600 dark:bg-blue-400"
                : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

