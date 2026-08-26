"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

export type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
  width?: number;
  height?: number;
  fileSize?: string;
  isCover?: boolean;
};

export function ProjectGallery({ images }: { images: GalleryImage[] }) {
  const defaultVisible = 5;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const visibleImages = images.slice(0, defaultVisible);
  const hiddenCount = Math.max(images.length - defaultVisible, 0);

  useEffect(() => {
    if (openIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenIndex(null);
      if (event.key === "ArrowRight") stepGallery(1);
      if (event.key === "ArrowLeft") stepGallery(-1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openIndex, images.length]);

  const openGallery = (index: number) => {
    setZoom(1);
    setOpenIndex(index);
  };

  const stepGallery = (direction: number) => {
    setOpenIndex((current) => {
      if (current === null) return 0;
      const next = current + direction;
      if (next < 0) return images.length - 1;
      if (next >= images.length) return 0;
      return next;
    });
    setZoom(1);
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
      } catch {
        // Ignore if fullscreen is unavailable.
      }
      return;
    }

    try {
      await document.exitFullscreen();
    } catch {
      // Ignore if fullscreen cannot be exited.
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null || touchStartY === null) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY)) {
      stepGallery(deltaX > 0 ? -1 : 1);
    }

    setTouchStartX(null);
    setTouchStartY(null);
  };

  return (
    <>
      <div className="project-gallery-grid">
        {visibleImages.map((image, index) => (
          <button
            key={`${image.src}-${index}`}
            type="button"
            className={image.isCover ? "project-gallery-item cover" : "project-gallery-item"}
            onClick={() => openGallery(index)}
          >
            <img src={image.src} alt={image.alt} />
            <span className="project-gallery-caption">
              <strong>{image.caption}</strong>
              <small>{image.fileSize ?? "Image asset"}</small>
            </span>
          </button>
        ))}
      </div>

      {hiddenCount > 0 ? (
        <div className="gallery-more">
          <button type="button" onClick={() => openGallery(0)}>
            +{hiddenCount} More
          </button>
        </div>
      ) : null }

      {openIndex !== null && images[openIndex] ? (
        <div
          className="project-lightbox"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setOpenIndex(null);
            }
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="project-lightbox-shell">
            <button
              type="button"
              className="project-lightbox-close"
              aria-label="Close gallery"
              onClick={() => setOpenIndex(null)}
            >
              <X size={18} />
            </button>

            <div className="project-lightbox-toolbar">
              <button type="button" aria-label="Previous image" onClick={() => stepGallery(-1)}>
                <ChevronLeft size={18} />
              </button>
              <span>
                {openIndex + 1} / {images.length}
              </span>
              <div className="project-lightbox-actions">
                <button type="button" aria-label="Zoom out" onClick={() => setZoom((level) => Math.max(level - 0.25, 1))}>
                  −
                </button>
                <button type="button" aria-label="Zoom in" onClick={() => setZoom((level) => Math.min(level + 0.25, 2))}>
                  +
                </button>
                <button type="button" aria-label="Toggle fullscreen" onClick={toggleFullscreen}>
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>

            <div className="project-lightbox-media">
              <img
                src={images[openIndex].src}
                alt={images[openIndex].alt}
                style={{ transform: `scale(${zoom})` }}
              />
            </div>

            <div className="project-lightbox-footer">
              <div>
                <p>{images[openIndex].caption}</p>
              </div>
              <div className="project-lightbox-nav">
                <button type="button" aria-label="Previous image" onClick={() => stepGallery(-1)}>
                  <ChevronLeft size={18} /> Previous
                </button>
                <button type="button" aria-label="Next image" onClick={() => stepGallery(1)}>
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
