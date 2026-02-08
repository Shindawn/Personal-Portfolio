import { motion } from "framer-motion";
import { ArrowLeft, FolderOpen, ExternalLink, Github, Presentation } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { projects } from "@/data/projects";
import Chatbot from "@/components/Chatbot";
import { pdfjs } from "react-pdf";

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
  if (project.tech.includes("Framer")) {
    return <FramerLogo />;
  }
  if (project.link.includes("render.com")) {
    return <RenderLogo />;
  }
  if (project.link.includes("vercel.app")) {
    return <VercelLogo />;
  }
  return <ExternalLink className="w-4 h-4" />;
};

const AllProjectsPage = () => {
  const [filter, setFilter] = useState<"all" | "Web Development" | "Full Stack" | "Backend" | "Mobile" | "Presentation">("all");
  const [slideCounts, setSlideCounts] = useState<Record<string, number | null>>({});
  const [loadingCounts, setLoadingCounts] = useState<Record<string, boolean>>({});

  // Ensure pdf worker is available for getDocument
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  useEffect(() => {
    const presentations = projects.filter((p: any) => p.type === 'presentation' && p.pdf);
    presentations.forEach((p: any) => {
      const key = p.link || p.title;
      // skip if already fetched
      if (slideCounts[key] !== undefined || loadingCounts[key]) return;
      setLoadingCounts((s) => ({ ...s, [key]: true }));
      // fetch number of pages
      pdfjs.getDocument(p.pdf).promise.then((doc: any) => {
        setSlideCounts((s) => ({ ...s, [key]: doc.numPages }));
      }).catch(() => {
        setSlideCounts((s) => ({ ...s, [key]: null }));
      }).finally(() => {
        setLoadingCounts((s) => ({ ...s, [key]: false }));
      });
    });
    // only run on mount / projects change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredProjects = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((project) => project.category === filter);
  }, [filter]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="portfolio-card min-h-screen"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-0 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold font-display flex items-center gap-2">
            <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6" /> All Projects
          </h1>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={filter === "Web Development" ? "default" : "outline"}
            onClick={() => setFilter("Web Development")}
            size="sm"
          >
            Web Development
          </Button>
          <Button
            variant={filter === "Full Stack" ? "default" : "outline"}
            onClick={() => setFilter("Full Stack")}
            size="sm"
          >
            Full Stack
          </Button>
          <Button
            variant={filter === "Backend" ? "default" : "outline"}
            onClick={() => setFilter("Backend")}
            size="sm"
          >
            Backend
          </Button>
          <Button
            variant={filter === "Mobile" ? "default" : "outline"}
            onClick={() => setFilter("Mobile")}
            size="sm"
          >
            Mobile
          </Button>
          <Button
            variant={filter === "Presentation" ? "default" : "outline"}
            onClick={() => setFilter("Presentation")}
            size="sm"
          >
            Presentation
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredProjects.map((project, index) => {
            const projKey = project.link || project.title;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      {project.title}
                      <div className="flex gap-2">
                        {project.link && project.link !== "#" && project.title !== "Portfolio Website" && (
                          <>
                            {(project as any).type === "presentation" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <Link to={project.link}>
                                  <Presentation className="w-4 h-4" />
                                  <span className="ml-1">View</span>
                                </Link>
                              </Button>
                            ) : (
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
                            )}
                          </>
                        )}
                        {project.github && (
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
                    </CardTitle>

                    {/* Slide count for presentation projects */}
                    {project.type === 'presentation' && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {loadingCounts[projKey]
                          ? 'Slides: ...'
                          : slideCounts[projKey] || slideCounts[projKey] === 0
                          ? `Slides: ${slideCounts[projKey]}`
                          : 'Slides: —'}
                      </div>
                    )}

                    {/* Description with hover effect */}
                    <div className="group relative">
                      <CardDescription className="line-clamp-2 leading-snug">
                        {project.description}
                      </CardDescription>
                      <CardDescription className="opacity-0 group-hover:opacity-100 absolute top-0 left-0 right-0 bg-card z-10 p-2 rounded shadow-lg border transition-opacity max-h-32 overflow-y-auto">
                        {project.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex gap-2">
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
      <Chatbot />
    </motion.section>
  );
};

export default AllProjectsPage;