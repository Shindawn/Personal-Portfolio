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

  useEffect(() => {
    const updateWidth = () => {
      const width = Math.min(window.innerWidth - 100, 800);
      setPdfWidth(width);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
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
    if (numPages && pageNumber < numPages) {
      setPageNumber((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
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
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <img
              src={isDarkTheme ? profileImageDark : profileImageLight}
              alt="Profile"
              className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover border-4 border-border"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-card" />
          </motion.div>

          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center md:justify-start gap-2 mb-1"
            >
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Lescy G. Caadlawon
              </h1>
              <svg className="w-5 h-5 text-sky-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center md:justify-start gap-1 text-sm text-muted-foreground mb-2"
            >
              <MapPin className="w-4 h-4" />
              <span>Bagamanoc, Catanduanes, Philippines</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="h-7 mb-4"
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-base md:text-lg font-medium text-foreground flex items-center"
              >
                {baseRole}
                <span className="mx-1">|</span>
                <span>{dynamicRoles[variantIndex].slice(0, charIndex)}</span>
                <span className="inline-block w-px h-5 bg-foreground/70 ml-1 animate-pulse" />
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-3 justify-center md:justify-start"
            >
              <Button className="gap-2 w-full sm:w-auto" onClick={handleResumeOpen}>
                <Eye className="w-4 h-4" />
                View Resume
              </Button>
              <a href="mailto:caadlawony@gmail.com">
                <Button variant="outline" className="gap-2">
                  <Mail className="w-4 h-4" />
                  Send Email
                </Button>
              </a>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setIsModalOpen(true)}
              >
                <FileText className="w-4 h-4" />
                OJT Requirements
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* OJT Requirements Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold text-foreground">
                  OJT Requirements
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-4 p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">OJT Requirement</p>
                      <p className="text-lg font-semibold">486 hrs</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Expected deployment</p>
                      <p className="text-lg font-semibold">February 17, 2026</p>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">
                  I can provide the following documents for OJT application and onboarding:
                </p>

                <ul className="space-y-3">
                  {ojtRequirements.map((requirement, index) => (
                    <motion.li
                      key={requirement}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                      <span className="text-foreground">{requirement}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">
                    All documents can be provided upon request. Feel free to contact me for any additional requirements.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Resume Viewer Modal */}
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
                          selectedResumeIndex === idx ? "bg-foreground text-card" : "bg-transparent text-muted-foreground border-border"
                        }`}
                        aria-pressed={selectedResumeIndex === idx}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <a href={selectedResume.url} download={`${selectedResume.label.replace(/\s+/g, "-")}.pdf`} className="ml-2 block">
                    <Button className="gap-2 px-3 py-1 text-sm">
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Download</span>
                    </Button>
                  </a>

                  <button onClick={handleResumeClose} className="p-2 ml-2 hover:bg-muted rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* PDF Viewer */}
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
                  {!isLoading && !loadError && (
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

              {/* Navigation */}
              {numPages && numPages > 1 && (
                <div className="bg-card border-t border-border p-4 flex items-center justify-between">
                  <Button
                    onClick={goToPrevPage}
                    disabled={pageNumber <= 1 || isLoading}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  <div className="text-sm font-medium">
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading page...
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
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
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