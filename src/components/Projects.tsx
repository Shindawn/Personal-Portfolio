import { motion } from "framer-motion";
import { FolderOpen, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { projects } from "@/data/projects";

const FramerLogo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7v5h8v8h10V7L12 2z" />
  </svg>
);

const RenderLogo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 4h8v8H4V4zm0 10h8v6H4v-6zm10-10h6v8h-6V4zm0 10h6v6h-6v-6z" />
  </svg>
);

const VercelLogo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 2 20 22 20" />
  </svg>
);

const getLivedemolLogo = (project: any) => {
  const tech = project?.tech;
  const link = typeof project?.link === "string" ? project.link : "";

  if (Array.isArray(tech) && tech.includes("Framer")) {
    return <FramerLogo />;
  }
  if (link.includes("render.com")) {
    return <RenderLogo />;
  }
  if (link.includes("vercel.app")) {
    return <VercelLogo />;
  }
  return <ExternalLink className="w-4 h-4" />;
};

// Show only the first 4 projects from the shared projects data
const displayedProjects = projects.slice(0, 4);

const Projects = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="portfolio-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="section-title mb-0">
          <FolderOpen className="w-5 h-5" />
          <h2>Projects</h2>
        </div>
        <Link to="/projects">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            View All →
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {displayedProjects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href={project.link} target="_blank" rel="noopener noreferrer">
                    {getLivedemolLogo(project)}
                    <span className="ml-1">Live Demo</span>
                  </a>
                </Button>
                {project.github && project.github !== "#" && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {Array.isArray(project.tech) ? project.tech.map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-2 py-0.5 rounded bg-background text-muted-foreground"
                >
                  {tech}
                </span>
              )) : null}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default Projects;
