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
    setTimeout(() => preloadNext(currentSlide + 1), 50);
  };

  const onPageRenderSuccess = () => {
    setIsPageRendering(false);
    preloadNext(currentSlide + 1);
  };

  const preloadNext = (index: number) => {
    if (!numPages) return;
    if (index < 0 || index >= numPages) return;
    if (preloadedPages[index]) return;
    setPreloadedPages((p) => ({ ...p, [index]: false }));
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

  const pdfWrapperRef = useRef<HTMLDivElement | null>(null);
  const thumbnailsRef = useRef<HTMLDivElement | null>(null);
  const [pdfWidth, setPdfWidth] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(7);

  useEffect(() => {
    const THUMB_W = 40;
    const GAP = 12;
    const MIN_VISIBLE = 3;
    const updateVisible = () => {
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
    let start = currentSlide - Math.floor(maxSlots / 2);
    start = Math.max(0, start);
    start = Math.min(start, numPages - maxSlots);

    let showFirst = start > 0;
    let showLast = start + maxSlots < numPages;

    const reserved = (showFirst ? 1 : 0) + (showLast ? 1 : 0);
    const innerSlots = Math.max(1, maxSlots - reserved);

    start = currentSlide - Math.floor(innerSlots / 2);
    if (showFirst) start = Math.max(1, start); else start = Math.max(0, start);
    start = Math.min(start, numPages - innerSlots - (showLast ? 1 : 0));
    start = Math.max(0, start);

    const indices = Array.from({ length: innerSlots }, (_, i) => start + i);
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

        <h1 className="text-4xl font-bold font-display mb-8 text-center">{title}</h1>

        {/* --- PDF / Slides Navigation Strip --- */}
        {pdfUrl && numPages && (
          <div 
            ref={thumbnailsRef} 
            style={{ width: pdfWidth ? `${pdfWidth}px` : undefined }} 
            className="w-full max-w-[800px] mx-auto flex gap-3 justify-center mb-6 px-2 overflow-x-auto overflow-y-hidden"
          >
            <div className="flex gap-3 mx-auto">
              {showFirst && (
                <button
                  onClick={() => goToSlide(0)}
                  className="w-10 h-10 flex items-center justify-center rounded-full border text-sm font-medium bg-secondary dark:bg-slate-800 text-foreground border-border hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0"
                >
                  1
                </button>
              )}
              {visibleIndices.map((i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all shrink-0 text-sm font-medium ${
                    currentSlide === i
                      ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                      : "bg-secondary dark:bg-slate-800 text-foreground border-border hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              {showLast && (
                <button
                  onClick={() => goToSlide(numPages - 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-full border text-sm font-medium bg-secondary dark:bg-slate-800 text-foreground border-border hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0"
                >
                  {numPages}
                </button>
              )}
            </div>
          </div>
        )}

        {/* --- Main PDF Viewer Area --- */}
        {pdfUrl && (
          <div className="flex flex-col gap-8">
            <div
              ref={pdfWrapperRef}
              className="rounded-lg border border-border overflow-hidden flex justify-center items-center bg-background mx-auto w-full"
              style={{ maxWidth: '800px', aspectRatio: '16 / 9' }}
            >
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading PDF...</div>}
                error={<div className="w-full h-full flex items-center justify-center text-destructive">Error loading PDF.</div>}
              >
                <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ transition: 'opacity 300ms ease', opacity: isPageRendering ? 0.25 : 1, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Page
                      pageNumber={currentSlide + 1}
                      width={pdfWidth || undefined}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      onRenderSuccess={onPageRenderSuccess}
                    />
                  </div>
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

            {/* PDF Controls */}
            <div className="flex items-center justify-between gap-4 max-w-[800px] mx-auto w-full">
              <Button onClick={prevSlide} disabled={currentSlide === 0 || isLoading || isPageRendering} variant="outline" className="text-xs sm:text-sm">
                <span className="hidden sm:inline">← Previous</span><span className="sm:hidden">←</span>
              </Button>
              <div className="text-xs sm:text-sm text-muted-foreground">Page {currentSlide + 1} of {numPages}</div>
              <Button onClick={nextSlide} disabled={currentSlide === (numPages ? numPages - 1 : 0) || isLoading || isPageRendering} variant="outline" className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Next →</span><span className="sm:hidden">→</span>
              </Button>
            </div>
          </div>
        )}

        {/* --- Video Section (Now Underneath PDF) --- */}
        {videoUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 mb-12"
          >
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  System Walkthrough
                </CardTitle>
                <CardDescription>
                  This is a compressed video, optimized for web playback.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
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

        {/* --- Footer / Contact Section --- */}
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 text-center mt-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Mail className="w-5 h-5 text-primary" />
            <p className="text-lg font-semibold">Want this template?</p>
          </div>
          <p className="text-muted-foreground mb-4">Feel free to reach out if you're interested.</p>
          <a href="mailto:caadlawony@gmail.com">
            <Button className="gap-2">
              <Mail className="w-4 h-4" />
              <span>caadlawony@gmail.com</span>
            </Button>
          </a>
        </div>
        
        {/* Remaining Fallback / Empty logic stays at the bottom */}
        {!pdfUrl && slides.length > 0 && ( /* ... Slide logic ... */ null )}
      </div>
    </motion.section>
  );
};

export default PresentationViewer;