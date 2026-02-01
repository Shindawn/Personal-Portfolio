import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X, Award, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { certifications, Certificate } from "../data/certifications";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Chatbot from "@/components/Chatbot";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Use the local worker file from public folder
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const AllCertificationsPage = () => {
  const [filter, setFilter] = useState<"all" | "Cisco" | "DICT" | "DataCamp" | "CatSU" | "Google" | "other" | "HackerRank">("all");
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfWidth, setPdfWidth] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const sortedCertifications = useMemo(() => {
    const filtered = certifications.filter((cert) => {
      if (filter === "all") return true;
      return cert.category === filter;
    });
    return filtered.sort((a, b) => b.year - a.year);
  }, [filter]);

  useEffect(() => {
    const updateWidth = () => {
      const width = Math.min(window.innerWidth - 100, 800);
      setPdfWidth(width);
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const openCertModal = (cert: Certificate) => {
    setSelectedCert(cert);
    setPageNumber(1);
    setNumPages(null);
    setIsLoading(true);
    setLoadError(false);
  };

  const closeCertModal = () => {
    setSelectedCert(null);
    setPageNumber(1);
    setNumPages(null);
    setIsLoading(false);
    setLoadError(false);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setLoadError(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error);
    setLoadError(true);
    setIsLoading(false);
  };

  const goToNextPage = () => {
    if (numPages && pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const goToPrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const isPDF = selectedCert?.imagePath.endsWith(".pdf");

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="portfolio-card min-h-screen"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        // ✅ Fix
<div className="flex items-center justify-end sm:justify-end relative mb-6 sm:mb-8">
          <Link to="/" className="absolute left-0">
            <Button variant="outline" className="gap-2 h-9 w-9 p-0 flex items-center justify-center">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold font-display flex items-center gap-2">
            <Award className="w-5 h-5 sm:w-6 sm:h-6" /> Seminars/Trainings
          </h1>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-6">
          {(["all", "Cisco", "DICT", "DataCamp", "CatSU", "Google", "HackerRank", "other"] as const).map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? "default" : "outline"}
              onClick={() => setFilter(cat)}
              size="sm"
              className="h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm capitalize"
            >
              {cat === "all" ? "All" : cat}
            </Button>
          ))}
        </div>

        {/* Certification Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {sortedCertifications.length > 0 ? (
            sortedCertifications.map((cert) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openCertModal(cert)}
                className="cursor-pointer"
              >
                <Card className="h-full">
                  <CardHeader className="py-2.5 px-3 sm:py-2 sm:px-3">
                    <CardTitle className="text-xs sm:text-sm text-foreground line-clamp-2 leading-snug">
                      {cert.title}
                    </CardTitle>
                    <CardDescription className="text-xs capitalize mt-1">
                      {cert.year} • {cert.category}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0 pb-2.5 px-3 sm:pb-2">
                    {cert.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{cert.description}</p>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <p className="text-muted-foreground text-center col-span-full py-8 text-sm">
              No certifications found for this category.
            </p>
          )}
        </div>

        {/* Modal */}
        <Dialog open={!!selectedCert} onOpenChange={closeCertModal}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden max-h-[90vh] flex flex-col w-[calc(100vw-24px)] sm:w-auto mx-3 sm:mx-auto">
            {selectedCert && (
              <div className="relative flex-1 overflow-auto">
                {isPDF ? (
                  <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-2 sm:p-4">
                      {selectedCert && (
                        <Document
                          file={selectedCert.imagePath}
                          onLoadSuccess={onDocumentLoadSuccess}
                          onLoadError={onDocumentLoadError}
                          loading={
                            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground gap-3">
                              <Loader2 className="w-8 h-8 animate-spin" />
                              <p className="text-sm">Loading certificate...</p>
                            </div>
                          }
                          error={
                            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground gap-3">
                              <p className="text-center text-sm">
                                {loadError ? 'Retrying...' : 'Unable to load PDF. Please try again.'}
                              </p>
                              <Button 
                                onClick={() => {
                                  setLoadError(false);
                                  setIsLoading(true);
                                  const cert = selectedCert;
                                  setSelectedCert(null);
                                  setTimeout(() => setSelectedCert(cert), 100);
                                }}
                                variant="outline"
                                size="sm"
                              >
                                Retry
                              </Button>
                            </div>
                          }
                          options={{
                            cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
                            cMapPacked: true,
                            standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/',
                          }}
                        >
                          {!isLoading && !loadError && (
                            <Page
                              pageNumber={pageNumber}
                              width={pdfWidth || undefined}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                              className="shadow-lg"
                              loading={
                                <div className="flex items-center justify-center p-8">
                                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                </div>
                              }
                            />
                          )}
                        </Document>
                      )}
                    </div>
                    
                    {/* PDF Navigation Controls */}
                    {numPages && numPages > 1 && !isLoading && !loadError && (
                      <div className="bg-background border-t border-border px-4 py-3 flex items-center justify-between">
                        <Button
                          onClick={goToPrevPage}
                          disabled={pageNumber <= 1}
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 sm:px-3"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span className="hidden sm:inline ml-1 text-xs">Previous</span>
                        </Button>
                        
                        <div className="text-xs text-muted-foreground">
                          Page {pageNumber} of {numPages}
                        </div>
                        
                        <Button
                          onClick={goToNextPage}
                          disabled={pageNumber >= numPages}
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 sm:px-3"
                        >
                          <span className="hidden sm:inline mr-1 text-xs">Next</span>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-2 sm:p-4">
                    <img 
                      src={selectedCert.imagePath} 
                      alt={selectedCert.title} 
                      className="w-full h-auto object-contain max-h-[80vh]"
                      onContextMenu={(e) => e.preventDefault()}
                      draggable={false}
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <Chatbot />
    </motion.section>
  );
};

export default AllCertificationsPage;