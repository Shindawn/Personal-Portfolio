import { motion } from "framer-motion";
import { User, GraduationCap, ExternalLink } from "lucide-react";

const About = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="portfolio-card"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="section-title mb-0">
          <User className="w-5 h-5" />
          <h2>About</h2>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold whitespace-nowrap">
          GWA: 1.41
        </span>
      </div>

      <div className="space-y-4 text-muted-foreground leading-relaxed">
        <p>
          Hello! I'm a graduating BSIT 4th year student with a keen interest in full stack development
          
          and UI/UX design. I blend creativity with technical skills to build meaningful 
          digital experiences that make a difference!
        </p>
        <p>
          Currently focused on full-stack development using modern technologies like React, 
          TypeScript, and Node.js. 
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mt-6 p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors group"
      >
        <a 
          href="https://www.facebook.com/CatanduanesStateUniversity2012/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3"
        >
          <GraduationCap className="w-5 h-5 text-foreground" />
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">BS Information Technology</h3>
            <p className="text-sm text-muted-foreground">Catanduanes State University • 2022 - 2026</p>
          </div>
          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </a>
      </motion.div>
    </motion.section>
  );
};

export default About;