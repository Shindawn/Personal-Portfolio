import { motion, AnimatePresence } from "framer-motion";
import { Award, X } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { certifications, Certificate } from "../data/certifications";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Certifications = () => {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const displayedCertifications = useMemo(() => {
    // Sort all certifications by year in descending order and display the first 3
    return certifications.slice().sort((a, b) => b.year - a.year).slice(0, 3);
  }, []);

  const openCertModal = (cert: Certificate) => {
    setSelectedCert(cert);
  };

  const closeCertModal = () => {
    setSelectedCert(null);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="portfolio-card"
    >
      <div className="section-title flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          <h2>Certifications</h2>
        </div>
        <Link to="/certifications">
          <Button variant="outline" size="sm" className="gap-2">
            <Award className="w-4 h-4" />
            See All
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {displayedCertifications.length > 0 ? (
          displayedCertifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
              onClick={() => openCertModal(cert)}
            >
              <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded min-w-fit capitalize">
                {cert.year}
              </span>
              <div>
                <h3 className="font-medium text-foreground text-sm">{cert.title}</h3>
                {cert.description && (
                  <p className="text-xs text-muted-foreground">{cert.description}</p>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-muted-foreground text-center">No certifications found.</p>
        )}
      </div>

      <Dialog open={!!selectedCert} onOpenChange={closeCertModal}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {selectedCert && (
            <div className="relative">
              {selectedCert.imagePath.endsWith(".pdf") ? (
                <iframe src={selectedCert.imagePath} className="w-full h-[80vh]" title={selectedCert.title} />
              ) : (
                <img src={selectedCert.imagePath} alt={selectedCert.title} className="w-full h-auto object-contain" />
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-white bg-black/50 hover:bg-black/70"
                onClick={closeCertModal}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.section>
  );
};

export default Certifications;
