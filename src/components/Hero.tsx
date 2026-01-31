import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Mail, Download, FileText, X, Eye, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import profileImageLight from "@/assets/profile-light.jpg";
import profileImageDark from "@/assets/profile-dark.jpg";
import { Button } from "@/components/ui/button";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Use the local worker file from public folder
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// Base + dynamic roles for typing effect
const baseRole = "BSIT 4th Year";
const dynamicRoles = ["UI/UX Designer", "Aspiring Software Developer", "Cybersecurity Enthusiast"];

const ojtRequirements = [
  "Memorandum of Agreement (MOA)",
  "Medical Certificate",
  "Waiver",
  "Endorsement Letter",
  "Resume/CV",
  "School ID Copy",
  "Brgy. Clearance",
];

const Hero = () => {
  // Typing effect state
  const [variantIndex, setVariantIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Resume viewer state
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const resumeOptions = [
    { label: "CICT Format", url: "/resumes/resume-cict.pdf" },
    { label: "Standard Format", url: "/resumes/resume-standard.pdf" },
  ];
  const [selectedResumeIndex, setSelectedResumeIndex] = useState(0);
  const selectedResume = resumeOptions[selectedResumeIndex];

  // PDF viewer state
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfWidth, setPdfWidth] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDarkTheme(document.documentElement.classList.contains("dark"));
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  // Calculate PDF width
  useEffect(() => {
    const updateWidth = () => {
      const width = Math.min(window.innerWidth - 100, 800);
      setPdfWidth(width);
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Typing effect loop
  useEffect(() => {
    const typingSpeed = 80;
    const deletingSpeed = 50;
    const pauseDuration = 1200;
    const switchPause = 400;

    let timer: number | undefined;

    if (phase === "typing") {
      if (charIndex < dynamicRoles[variantIndex].length) {
        timer = window.setTimeout(() => setCharIndex((c) => c + 1), typingSpeed);
      } else {
        timer = window.setTimeout(() => setPhase("pausing"), pauseDuration);
      }
    } else if (phase === "deleting") {
      if (charIndex > 0) {
        timer = window.setTimeout(() => setCharIndex((c) => c - 1), deletingSpeed);
      } else {
        timer = window.setTimeout(() => {
          setVariantIndex((i) => (i + 1) % dynamicRoles.length);
          setPhase("typing");
        }, switchPause);
      }
    } else if (phase === "pausing") {
      timer = window.setTimeout(() => setPhase("deleting"), pauseDuration);
    }

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [phase, charIndex, variantIndex]);

  // PDF handlers
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log("PDF loaded — total pages:", numPages);
    setNumPages(numPages);
    setIsLoading(false);
    setLoadError(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("PDF load error:", error);
    setLoadError(true);
    setIsLoading(false);
  };

  const goToNextPage = () => {
    console.log("Next clicked | current:", pageNumber, "total:", numPages);
    if (numPages && pageNumber < numPages) {
      setPageNumber((prev) => {
        const nextPage = prev + 1;
        console.log("→ Moving to page:", nextPage);
        return nextPage;
      });
    } else {
      console.log("Cannot go next — numPages:", numPages, "current:", pageNumber);
    }
  };

  const goToPrevPage = () => {
    console.log("Prev clicked | current:", pageNumber);
    if (pageNumber > 1) {
      setPageNumber((prev) => {
        const prevPage = prev - 1;
        console.log("→ Moving to page:", prevPage);
        return prevPage;
      });
    }
  };

  const handleResumeOpen = () => {
    setIsResumeOpen(true);
    setPageNumber(1);
    setNumPages(null);
    setIsLoading(true);
    setLoadError(false);
  };

  const handleResumeClose = () => {
    setIsResumeOpen(false);
    setPageNumber(1);
    setNumPages(null);
    setIsLoading(false);
    setLoadError(false);
  };

  const handleResumeChange = (index: number) => {
    if (index === selectedResumeIndex) return;
    
    console.log("Switching resume to index:", index);
    setSelectedResumeIndex(index);
    setPageNumber(1);
    setNumPages(null);
    setIsLoading(true);
    setLoadError(false);
  };

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="portfolio-card"
      >
        {/* ... your existing hero content remains unchanged ... */}
        
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          <Button className="gap-2 w-full sm:w-auto" onClick={handleResumeOpen}>
            <Eye className="w-4 h-4" />
            View Resume
          </Button>
          {/* ... other buttons ... */}
        </div>
      </motion.section>

      {/* Resume Viewer Modal */}
      <AnimatePresence>
        {isResumeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleResumeClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-card border border-border rounded-none sm:rounded-2xl shadow-2xl w-full max-w-4xl h-full sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-card border-b border-border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="mb-2 sm:mb-0">
                  <h3 className="text-lg font-semibold">View Resume</h3>
                  <p className="text-sm text-muted-foreground">Choose format to view or download</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <div className="flex gap-2 overflow-x-auto max-w-[220px] sm:max-w-none">
                    {resumeOptions.map((opt, idx) => (
                      <button
                        key={opt.label}
                        onClick={() => handleResumeChange(idx)}
                        className={`px-3 py-1 rounded-full text-sm border whitespace-nowrap ${
                          selectedResumeIndex === idx
                            ? "bg-foreground text-card"
                            : "bg-transparent text-muted-foreground border-border"
                        }`}
                        aria-pressed={selectedResumeIndex === idx}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <a
                    href={selectedResume.url}
                    download={`${selectedResume.label.replace(/\s+/g, "-")}.pdf`}
                    className="ml-2 block"
                  >
                    <Button className="gap-2 px-3 py-1 text-sm">
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Download</span>
                    </Button>
                  </a>

                  <button
                    onClick={handleResumeClose}
                    className="p-2 ml-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* PDF Viewer Area */}
              <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-start p-4 relative">
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-white font-medium">Loading resume...</p>
                  </div>
                )}

                <Document
                  key={selectedResume.url}
                  file={selectedResume.url}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={
                    <div className="flex flex-col items-center justify-center p-8 text-muted-foreground gap-3">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <p>Loading resume...</p>
                    </div>
                  }
                  error={
                    <div className="flex flex-col items-center justify-center p-8 text-muted-foreground gap-3 text-center">
                      <p>Unable to load resume. Please try again.</p>
                      <Button
                        onClick={() => {
                          setLoadError(false);
                          setIsLoading(true);
                          handleResumeChange(selectedResumeIndex);
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Retry
                      </Button>
                    </div>
                  }
                  options={{
                    cMapUrl: "https://unpkg.com/pdfjs-dist@3.11.174/cmaps/",
                    cMapPacked: true,
                    standardFontDataUrl: "https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/",
                  }}
                >
                  {!isLoading && !loadError && numPages && (
                    <Page
                      key={`page-${pageNumber}-${selectedResume.url}`}
                      pageNumber={pageNumber}
                      width={pdfWidth || undefined}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      className="shadow-lg bg-white"
                      loading={
                        <div className="flex items-center justify-center p-8">
                          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                      }
                    />
                  )}
                </Document>
              </div>

              {/* Navigation Controls */}
              {numPages && numPages > 1 && (
                <div className="bg-card border-t border-border p-4 flex items-center justify-between">
                  <Button
                    onClick={goToPrevPage}
                    disabled={pageNumber <= 1 || isLoading}
                    variant="outline"
                    size="sm"
                    type="button"
                    className="gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  <div className="text-sm font-medium">
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      `Page ${pageNumber} of ${numPages}`
                    )}
                  </div>

                  <Button
                    onClick={goToNextPage}
                    disabled={pageNumber >= numPages || isLoading}
                    variant="outline"
                    size="sm"
                    type="button"
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Hero;