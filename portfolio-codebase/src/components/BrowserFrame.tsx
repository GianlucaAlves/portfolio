import { useEffect, useState } from "react";

type BrowserFrameProps = {
  screenshots: string[];
  url: string;
  alt: string;
};

export default function BrowserFrame({
  screenshots,
  url,
  alt,
}: BrowserFrameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const currentScreenshot = screenshots[currentIndex];
  const hasSrc = Boolean(currentScreenshot);
  const hasMultipleScreenshots = screenshots.length > 1;
  const controlsClassName =
    "text-green-600 hover:text-green-400 font-mono text-xs sm:text-sm px-3 py-1 border border-green-500/30 hover:border-green-500/60 bg-transparent transition-colors";

  useEffect(() => {
    if (!isLightboxOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen]);

  const showPrevious = () => {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  };

  const showNext = () => {
    setCurrentIndex((index) => Math.min(index + 1, screenshots.length - 1));
  };

  const renderControls = () => (
    <div className="flex items-center justify-between px-3 py-2 border-t border-green-500/20">
      <button
        type="button"
        onClick={showPrevious}
        className={controlsClassName}
      >
        {"\u2190"}
      </button>
      <span className="text-green-700 text-xs font-mono">
        {currentIndex + 1} / {screenshots.length}
      </span>
      <button type="button" onClick={showNext} className={controlsClassName}>
        {"\u2192"}
      </button>
    </div>
  );

  return (
    <>
      <div className="bg-black border border-green-500/40 shadow-[0_0_12px_rgba(0,255,65,0.15)] font-mono mt-3 mb-3">
        <div className="flex items-center gap-3 px-3 py-2 border-b border-green-500/30 bg-green-950/20">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-900 border border-green-700/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-900 border border-green-700/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-900 border border-green-700/50" />
          </div>
          <div className="flex-1 bg-black/40 border border-green-500/20 px-2 py-0.5 text-[10px] text-green-600 truncate">
            {url}
          </div>
        </div>
        {hasSrc ? (
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="group relative block w-full cursor-zoom-in"
          >
            <img
              src={currentScreenshot}
              alt={alt}
              className="w-full block object-cover"
              loading="lazy"
            />
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 text-green-700 text-[10px] font-mono opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
              // click to expand
            </span>
          </button>
        ) : (
          <div className="w-full aspect-video bg-green-950/20 flex items-center justify-center text-green-800 text-xs font-mono">
            // screenshot coming soon
          </div>
        )}
        {hasMultipleScreenshots ? renderControls() : null}
      </div>
      {isLightboxOpen && hasSrc ? (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-green-500 hover:text-green-300 font-mono text-xs sm:text-sm border border-green-500/30 hover:border-green-400 px-3 py-1 bg-black/60 transition-colors"
          >
            [X]
          </button>
          <div
            className="relative flex items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={currentScreenshot}
              alt={alt}
              className="max-w-[90vw] max-h-[85vh] object-contain block"
            />
          </div>
          {hasMultipleScreenshots ? (
            <div
              className="absolute bottom-4 left-1/2 w-[min(90vw,28rem)] -translate-x-1/2 bg-black/60"
              onClick={(event) => event.stopPropagation()}
            >
              {renderControls()}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
