import { motion } from "framer-motion";
import { ArrowLeft, Mail, Play } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Use the local worker file from public folder
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PresentationViewerProps {
  title: string;
  presentationUrl?: string;
  pdfUrl?: string;
  slides?: Array<{
    id: number;
    title: string;
    content: React.ReactNode;
  }>;
  videoUrl?: string; // Optional video URL for capstone
  videoThumbnail?: string; // Optional video thumbnail
}

const PresentationViewer = ({
  title,
  presentationUrl,
  pdfUrl: initialPdfUrl,
  slides = [],
  videoUrl,
  videoThumbnail,
}: PresentationViewerProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdfUrl] = useState<string | null>(initialPdfUrl || null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageRendering, setIsPageRendering] = useState(true);
  const [preloadedPages, setPreloadedPages] = useState<Record<number, boolean>>({});

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrentSlide(0);
    setIsLoading(false);
    // start by preloading the next page
    setTimeout(() => preloadNext(currentSlide + 1), 50);
  };

  const onPageRenderSuccess = () => {
    // Called when the visible page finished rendering
    setIsPageRendering(false);
    // preload the following page in background
    preloadNext(currentSlide + 1);
  };

  const preloadNext = (index: number) => {
    // index = zero-based page index to preload
    if (!numPages) return;
    if (index < 0 || index >= numPages) return;
    if (preloadedPages[index]) return;
    // mark as pending (avoid duplicate renders)
    setPreloadedPages((p) => ({ ...p, [index]: false }));
    // actual setting to true happens in the hidden Page onRenderSuccess
  };

  const nextSlide = () => {
    if (isPageRendering || isLoading) return;
    if (pdfUrl && numPages) {
      if (currentSlide < numPages - 1) {
        setIsPageRendering(true);
        setCurrentSlide((s) => s + 1);
      }
    } else if (currentSlide < slides.length - 1) {
      setCurrentSlide((s) => s + 1);
    }
  };

  const prevSlide = () => {
    if (isPageRendering || isLoading) return;
    if (currentSlide > 0) {
      setIsPageRendering(true);
      setCurrentSlide((s) => s - 1);
    }
  };

  const goToSlide = (index: number) => {
    if (isPageRendering || isLoading) return;
    setIsPageRendering(true);
    setCurrentSlide(index);
  };

  const totalSlides = pdfUrl && numPages ? numPages : slides.length;

  const pdfWrapperRef = useRef<HTMLDivElement | null>(null);
  const thumbnailsRef = useRef<HTMLDivElement | null>(null);
  const [pdfWidth, setPdfWidth] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(7);

  useEffect(() => {
    const THUMB_W = 40; // px (w-10)
    const GAP = 12; // px (gap-3)
    const MIN_VISIBLE = 3;
    const updateVisible = () => {
      // prefer the pdf wrapper width so the thumbnail strip always matches the viewer
      const width = (pdfWrapperRef.current?.clientWidth ?? thumbnailsRef.current?.clientWidth) ?? 0;
      setPdfWidth(width || null);
      const possible = Math.floor((width + GAP) / (THUMB_W + GAP));
      const newVisible = Math.max(MIN_VISIBLE, Math.min(possible || MIN_VISIBLE, numPages || MIN_VISIBLE));
      setVisibleCount(newVisible);
    };
    updateVisible();
    const ro = new ResizeObserver(updateVisible);
    if (pdfWrapperRef.current) ro.observe(pdfWrapperRef.current);
    else if (thumbnailsRef.current) ro.observe(thumbnailsRef.current);
    window.addEventListener("resize", updateVisible);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateVisible);
    };
  }, [numPages]);



  const getVisibleRange = () => {
    if (!numPages) return { indices: [] as number[], showFirst: false, showLast: false };
    if (numPages <= visibleCount) return { indices: Array.from({ length: numPages }, (_, i) => i), showFirst: false, showLast: false };

    const maxSlots = visibleCount;

    // Start by centering currentSlide in the available window
    let start = currentSlide - Math.floor(maxSlots / 2);
    start = Math.max(0, start);
    start = Math.min(start, numPages - maxSlots);

    // Determine if there are hidden pages on either side
    let showFirst = start > 0;
    let showLast = start + maxSlots < numPages;

    // Reserve slots for first/last buttons if needed
    const reserved = (showFirst ? 1 : 0) + (showLast ? 1 : 0);
    const innerSlots = Math.max(1, maxSlots - reserved);

    // Re-center using innerSlots
    start = currentSlide - Math.floor(innerSlots / 2);
    if (showFirst) start = Math.max(1, start); else start = Math.max(0, start);
    start = Math.min(start, numPages - innerSlots - (showLast ? 1 : 0));
    start = Math.max(0, start);

    const indices = Array.from({ length: innerSlots }, (_, i) => start + i);

    // final recalculation of showFirst/showLast to ensure the extra buttons are truly outside the visible indices
    showFirst = indices[0] > 0;
    showLast = indices[indices.length - 1] < numPages - 1;

    return { indices, showFirst, showLast };
  };

  const { indices: visibleIndices, showFirst, showLast } = getVisibleRange();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="portfolio-card min-h-screen bg-background"
    >
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/projects">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Button>
          </Link>
        </div>

        <h1 className="text-4xl font-bold font-display mb-4 text-center">{title}</h1>

        {/* Video Section - Shows if videoUrl is provided */}
        {videoUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  System Walkthrough
                </CardTitle>
                <CardDescription>
                  Watch the complete system demonstration before viewing the presentation slides
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
                  <video
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    controls
                    preload="metadata"
                    poster={videoThumbnail}
                  >
                    <source src={videoUrl} type="video/mp4" />
                    <source src={videoUrl.replace('.mp4', '.webm')} type="video/webm" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Top page buttons (numeric thumbnails) for PDF presentations */}
        {pdfUrl && numPages && (
          <div 
            ref={thumbnailsRef} 
            style={{ width: pdfWidth ? `${pdfWidth}px` : undefined }} 
            className="w-full max-w-[800px] mx-auto flex gap-3 justify-center mb-6 px-2 overflow-x-auto overflow-y-hidden"
          >
            <div className="flex gap-3 mx-auto">
              {/* Left-hand first if hidden */}
              {showFirst && (
                <button
                  onClick={() => { goToSlide(0); }}
                  className="w-10 h-10 flex items-center justify-center rounded-full border text-sm font-medium bg-secondary dark:bg-slate-800 text-foreground border-border hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0"
                >
                  1
                </button>
              )}

              {/* Visible window */}
              {visibleIndices.map((i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  aria-current={currentSlide === i}
                  className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all shrink-0 text-sm font-medium ${
                    currentSlide === i
                      ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                      : "bg-secondary dark:bg-slate-800 text-foreground border-border hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              {/* Right-hand last page if hidden */}
              {showLast && (
                <button
                  onClick={() => { goToSlide(numPages - 1); }}
                  className="w-10 h-10 flex items-center justify-center rounded-full border text-sm font-medium bg-secondary dark:bg-slate-800 text-foreground border-border hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0"
                >
                  {numPages}
                </button>
              )}
            </div>
          </div>
        )}

        {/* PDF Viewer */}
        {pdfUrl && (
          <div className="flex flex-col gap-8">
            {/* PDF Page Display - 16:9 Widescreen with responsive width */}
            <div
              ref={pdfWrapperRef}
              className="rounded-lg border border-border overflow-hidden flex justify-center items-center bg-background mx-auto w-full"
              style={{ maxWidth: '800px', aspectRatio: '16 / 9' }}
            >
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Loading PDF...
                  </div>
                }
                error={
                  <div className="w-full h-full flex items-center justify-center text-destructive">
                    Error loading PDF. Please try another file.
                  </div>
                }
              >
                <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div
                    style={{
                      transition: 'opacity 300ms ease',
                      opacity: isPageRendering ? 0.25 : 1,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Page
                      pageNumber={currentSlide + 1}
                      width={pdfWidth || undefined}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      onRenderSuccess={onPageRenderSuccess}
                    />
                  </div>

                  {/* Hidden preloader for next page to smooth navigation */}
                  {numPages && currentSlide + 1 < numPages && !preloadedPages[currentSlide + 1] && (
                    <div style={{ position: 'absolute', left: -9999, top: -9999, width: 0, height: 0, overflow: 'hidden' }} aria-hidden>
                      <Page
                        pageNumber={currentSlide + 2}
                        width={pdfWidth || undefined}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        onRenderSuccess={() => setPreloadedPages((p) => ({ ...p, [currentSlide + 1]: true }))}
                      />
                    </div>
                  )}
                </div>
              </Document>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4">
              <Button
                onClick={prevSlide}
                disabled={currentSlide === 0 || isLoading || isPageRendering}
                variant="outline"
                className="text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">← Previous</span>
                <span className="sm:hidden">←</span>
              </Button>

              <div className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                Page {currentSlide + 1} of {numPages}
              </div>

              <Button
                onClick={nextSlide}
                disabled={currentSlide === (numPages ? numPages - 1 : 0) || isLoading || isPageRendering}
                variant="outline"
                className="text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Next →</span>
                <span className="sm:hidden">→</span>
              </Button>
            </div>

            {/* Email Notification */}
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Mail className="w-5 h-5 text-primary" />
                <p className="text-lg font-semibold">Want this template?</p>
              </div>
              <p className="text-muted-foreground mb-4">
                Feel free to reach out if you're interested in this presentation or would like to discuss further.
              </p>
              <a href="mailto:caadlawony@gmail.com">
                <Button className="gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="hidden sm:inline">Email: caadlawony@gmail.com</span>
                  <span className="sm:hidden">Contact Me</span>
                </Button>
              </a>
            </div>
          </div>
        )}

        {/* Hardcoded Slides */}
        {!pdfUrl && slides.length > 0 && (
          <div className="flex flex-col gap-8">
            {/* Slide Content */}
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-secondary/50 to-secondary/30 rounded-lg border border-border p-8 min-h-[600px] flex flex-col justify-center items-center"
            >
              {slides[currentSlide].content}
            </motion.div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <Button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                variant="outline"
              >
                ← Previous
              </Button>

              <div className="text-sm text-muted-foreground">
                Slide {currentSlide + 1} of {slides.length}
              </div>

              <Button
                onClick={nextSlide}
                disabled={currentSlide === slides.length - 1}
                variant="outline"
              >
                Next →
              </Button>
            </div>

            {/* Slide Thumbnails */}
            <div className="flex flex-wrap gap-2 justify-center">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(index)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    currentSlide === index
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary/50 border-border hover:bg-secondary"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Embedded Presentation Fallback */}
        {!pdfUrl && presentationUrl && slides.length === 0 && (
          <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={presentationUrl}
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              title={title}
            />
          </div>
        )}

        {/* Empty State */}
        {!pdfUrl && slides.length === 0 && !presentationUrl && (
          <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
            <p className="text-muted-foreground text-lg">No presentation available</p>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default PresentationViewer;