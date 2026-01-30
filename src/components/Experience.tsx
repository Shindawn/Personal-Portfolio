import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

const PulsingCircle = () => (
  <div className="flex items-center justify-center relative">
    <style>{`
      @keyframes pulseGradient {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        100% {
          transform: scale(2);
          opacity: 0;
        }
      }
      .pulse-ring {
        animation: pulseGradient 2s ease-out infinite;
      }
    `}</style>
    
    {/* Outer gradient ring */}
    <div
      className="absolute w-3 h-3 rounded-full pulse-ring"
      style={{
        background: 'conic-gradient(from 0deg, #000, #fff, #000)',
        opacity: 0.8,
      }}
    />
    
    {/* Middle gradient ring */}
    <div
      className="absolute w-3 h-3 rounded-full"
      style={{
        background: 'conic-gradient(from 90deg, #000, #fff, #000)',
        opacity: 0.5,
        animation: 'pulseGradient 2s ease-out 0.3s infinite',
      }}
    />
    
    {/* Center circle */}
    <div className="relative w-3 h-3 bg-black rounded-full border-2 border-white" />
  </div>
);

const experiences = [
  {
    year: "2025",
    title: "UI/UX Designer",
    company: "Capstone Project",
  },
  {
    year: "2024",
    title: "President AY 2024-2025",
    company: "Assocication Of Information Technology Student (ASITS), CICT",
  },
  {
    year: "2024",
    title: "Document Specialist",
    company: "Dawn Engineering Construction & Supply",
  },
  {
    year: "2023",
    title: "Web/Graphic Designer",
    company: "Freelance",
  },
  {
    year: "2023",
    title: "President",
    company: "National Service Training Program (NSTP) - CWTS",
  },
  {
    year: "2018",
    title: "Hello World! 👋",
    company: "",
    description: "Wrote my first line of code",
  },
];

const Experience = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="portfolio-card"
    >
      <div className="section-title">
        <Briefcase className="w-5 h-5" />
        <h2>Experience</h2>
      </div>

      <div className="relative">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-8 pb-6 last:pb-0"
          >
            {index < experiences.length - 1 && (
              <div className="timeline-line" />
            )}
            {exp.year === "2025" ? (
              <div className="absolute left-0 top-1.5">
                <PulsingCircle />
              </div>
            ) : (
              <div className="absolute left-0 top-1.5 timeline-dot" />
            )}
            
            <div className="flex items-start gap-4">
              <span className="text-sm font-medium text-muted-foreground min-w-[50px]">
                {exp.year}
              </span>
              <div>
                <h3 className="font-semibold text-foreground">{exp.title}</h3>
                {exp.company && (
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                )}
                {exp.description && (
                  <p className="text-sm text-muted-foreground mt-1">{exp.description}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default Experience;
