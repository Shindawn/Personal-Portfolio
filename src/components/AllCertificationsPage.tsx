import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X, Award } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { certifications, Certificate } from "../data/certifications";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Chatbot from "@/components/Chatbot";

const AllCertificationsPage = () => {
  const [filter, setFilter] = useState<"all" | "Cisco" | "DICT" | "DataCamp" | "CatSU" | "Google" | "other" | "HackerRank">("all");
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const sortedCertifications = useMemo(() => {
    const filtered = certifications.filter((cert) => {
      if (filter === "all") return true;
      return cert.category === filter;
    });
    return filtered.sort((a, b) => b.year - a.year);
  }, [filter]);

  const openCertModal = (cert: Certificate) => {
    setSelectedCert(cert);
  };

  const closeCertModal = () => {
    setSelectedCert(null);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="portfolio-card min-h-screen"
    >
      <div className="container max-w-7xl mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold font-display flex items-center gap-2">
            <Award className="w-6 h-6" /> Seminars/Trainings
          </h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={filter === "Cisco" ? "default" : "outline"}
            onClick={() => setFilter("Cisco")}
            size="sm"
          >
            Cisco
          </Button>
          <Button
            variant={filter === "DICT" ? "default" : "outline"}
            onClick={() => setFilter("DICT")}
            size="sm"
          >
            DICT
          </Button>
          <Button
            variant={filter === "DataCamp" ? "default" : "outline"}
            onClick={() => setFilter("DataCamp")}
            size="sm"
          >
            DataCamp
          </Button>
          <Button
            variant={filter === "CatSU" ? "default" : "outline"}
            onClick={() => setFilter("CatSU")}
            size="sm"
          >
            CatSU
          </Button>
          <Button
            variant={filter === "Google" ? "default" : "outline"}
            onClick={() => setFilter("Google")}
            size="sm"
          >
            Google
          </Button>
          <Button
            variant={filter === "HackerRank" ? "default" : "outline"}
            onClick={() => setFilter("HackerRank")}
            size="sm"
          >
            HackerRank
          </Button>
          <Button
            variant={filter === "other" ? "default" : "outline"}
            onClick={() => setFilter("other")}
            size="sm"
          >
            Other
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
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
                  <CardHeader className="py-1.5 px-2">
                    <CardTitle className="text-sm text-foreground line-clamp-2 leading-tight">{cert.title}</CardTitle>
                    <CardDescription className="text-xs capitalize mt-0.5">{cert.year} • {cert.category}</CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0 pb-1 px-2">
                    {cert.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{cert.description}</p>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <p className="text-muted-foreground text-center col-span-full">No certifications found for this category.</p>
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