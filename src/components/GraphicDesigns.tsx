import { motion, useAnimation } from "framer-motion";
import { Palette, Download, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Placeholder images - replace with your actual graphic design images in public/graphic-designs
const graphicDesignImages = [
  "/graphic-designs/design9.jpg",
  "/graphic-designs/design10.jpg",
  "/graphic-designs/iec.jpg",
  "/graphic-designs/design11.jpg",
  "/graphic-designs/design12.jpg",
  "/graphic-designs/design13.jpg",
  "/graphic-designs/design1.jpg",
  "/graphic-designs/design2.jpg",
  "/graphic-designs/design3.jpg",
  "/graphic-designs/design4.jpg",
  "/graphic-designs/design5.jpg",
  "/graphic-designs/design6.jpg",
  "/graphic-designs/design7.jpg",
  "/graphic-designs/design8.jpg",
  "/graphic-designs/design14.jpg",
  "/graphic-designs/design15.jpg",
  "/graphic-designs/design16.jpg",
  "/graphic-designs/design17.jpg",
  "/graphic-designs/design18.jpg",
  "/graphic-designs/design19.jpg",
];

const GraphicDesigns = () => {
  const controls = useAnimation();
  const [imageWidth, setImageWidth] = useState(0);
  const carouselWrapperRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [currentPosition, setCurrentPosition] = useState(0);

  // Duplicate images for a seamless loop. Adjust the duplication factor as needed.
  const loopedGraphicDesignImages = [
    ...graphicDesignImages,
    ...graphicDesignImages,
    ...graphicDesignImages,
  ];

  useEffect(() => {
    if (carouselWrapperRef.current && loopedGraphicDesignImages.length > 0) {
      const firstImage = carouselWrapperRef.current.querySelector("img");
      if (firstImage) {
        setImageWidth(firstImage.offsetWidth + 32); // 300px min-w + p-2 = 332px
      }
    }
  }, []);

  useEffect(() => {
    if (imageWidth === 0 || loopedGraphicDesignImages.length === 0 || !isAnimating) return;

    const numOriginalImages = graphicDesignImages.length;
    const scrollDistance = imageWidth * numOriginalImages;

    const animateCarousel = async () => {
      while (isAnimating) {
        await controls.start({
          x: -scrollDistance,
          transition: { duration: numOriginalImages * 4, ease: "linear" },
        });
        // Instantly reset position without any visual pause
        controls.set({ x: 0 });
        setCurrentPosition(0);
      }
    };

    animateCarousel();

    return () => {
      controls.stop();
    };
  }, [controls, imageWidth, loopedGraphicDesignImages.length, graphicDesignImages.length, isAnimating]);

  const openImageModal = (image: string) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const handleDownloadPortfolio = () => {
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = '/portfolio.pdf'; // Place your PDF file in the public folder as portfolio.pdf
    link.download = 'My-Portfolio.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrevious = () => {
    setIsAnimating(false);
    controls.start({
      x: currentPosition + imageWidth,
      transition: { duration: 0.5, ease: "easeInOut" }
    }).then(() => {
      setCurrentPosition(prev => prev + imageWidth);
      setIsAnimating(true);
    });
  };

  const handleNext = () => {
    setIsAnimating(false);
    controls.start({
      x: currentPosition - imageWidth,
      transition: { duration: 0.5, ease: "easeInOut" }
    }).then(() => {
      setCurrentPosition(prev => prev - imageWidth);
      setIsAnimating(true);
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="portfolio-card"
    >
      <div className="section-title">
        <Palette className="w-5 h-5" />
        <h2>Graphic Designs</h2>
        <Button
          onClick={handleDownloadPortfolio}
          variant="ghost"
          size="sm"
          className="ml-auto text-sm hover:bg-transparent hover:text-primary transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          PDF Portfolio
        </Button>
      </div>

      <div className="overflow-hidden relative group">
        <motion.div
          className="flex"
          ref={carouselWrapperRef}
          animate={controls}
        >
          {loopedGraphicDesignImages.map((image, index) => (
            <motion.div
              key={index}
              className="min-w-[300px] p-2 cursor-pointer"
              onClick={() => openImageModal(image)}
            >
              <img
                src={image}
                alt={`Graphic Design ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Navigation Buttons */}
        <Button
          onClick={handlePrevious}
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          onClick={handleNext}
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={closeImageModal}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-2">
          {selectedImage && (
            <div className="relative flex justify-center items-center w-full h-full max-h-[90vh]">
              <img
                src={selectedImage}
                alt="Selected Graphic Design"
                className="max-w-full max-h-[85vh] object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.section>
  );
};

export default GraphicDesigns;