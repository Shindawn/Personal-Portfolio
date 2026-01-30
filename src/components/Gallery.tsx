import { motion, useAnimation } from "framer-motion";
import { Image } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";

// Placeholder images - replace with your actual college images in public/gallery
const galleryImages = [
  "/gallery/college1.jpg",
  "/gallery/college2.jpg",
  "/gallery/college3.jpg",
  "/gallery/college4.jpg",
  "/gallery/college5.jpg",
  "/gallery/college6.jpg",
  "/gallery/college7.jpg",
  "/gallery/college8.jpg",
  "/gallery/college9.jpg",
  "/gallery/college10.jpg",
];

const Gallery = () => {
  const controls = useAnimation();
  const [imageWidth, setImageWidth] = useState(0);
  const carouselWrapperRef = useRef<HTMLDivElement>(null);

  // Duplicate images for a seamless loop. Adjust the duplication factor as needed.
  const loopedGalleryImages = [...galleryImages, ...galleryImages, ...galleryImages];

  useEffect(() => {
    if (carouselWrapperRef.current && loopedGalleryImages.length > 0) {
      // Assuming all images have the same width as the first one for calculation
      const firstImage = carouselWrapperRef.current.querySelector("img");
      if (firstImage) {
        setImageWidth(firstImage.offsetWidth + (32)); // 300px min-w + p-2 = 300 + 16(2) = 332px
      }
    }
  }, []);

  useEffect(() => {
    if (imageWidth === 0 || loopedGalleryImages.length === 0) return;

    const numOriginalImages = galleryImages.length;
    const totalCarouselWidth = imageWidth * loopedGalleryImages.length;
    const scrollDistance = imageWidth * numOriginalImages; // Scroll distance before resetting

    const animateCarousel = async () => {
      while (true) {
        await controls.start({
          x: -scrollDistance, // Animate to the point where the first set of images ends
          transition: { duration: numOriginalImages * 2, ease: "linear" },
        });

        // Reset position instantly to simulate infinite loop
        controls.set({ x: 0 });
      }
    };

    animateCarousel();

    // Cleanup on unmount or dependency change
    return () => { controls.stop(); };
  }, [controls, imageWidth, loopedGalleryImages.length, galleryImages.length]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="portfolio-card"
    >
      <div className="section-title">
        <Image className="w-5 h-5" />
        <h2>Gallery</h2>
      </div>

      <div className="overflow-hidden">
        <motion.div
          className="flex"
          ref={carouselWrapperRef}
          animate={controls}
        >
          {loopedGalleryImages.map((image, index) => (
            <motion.div key={index} className="min-w-[300px] p-2">
              <motion.img 
                src={image} 
                alt={`Gallery image ${index + 1}`} 
                className="w-full h-48 object-cover rounded-lg shadow-md cursor-pointer"
                whileHover={{ filter: "grayscale(0%)" }}
                initial={{ filter: "grayscale(100%)" }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Gallery;
