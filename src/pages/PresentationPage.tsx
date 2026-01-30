import { useParams, Navigate } from "react-router-dom";
import PresentationViewer from "@/components/PresentationViewer";
import { projects } from "@/data/projects";

const PresentationPage = () => {
  const { slug } = useParams<{ slug: string }>();

  // Find the presentation project by slug
  const presentation = projects.find(
    (p) => (p as any).slug === slug && p.type === "presentation"
  );

  // If presentation not found, redirect to projects
  if (!presentation || !presentation.pdf) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <PresentationViewer
      title={presentation.title}
      pdfUrl={presentation.pdf}
    />
  );
};

export default PresentationPage;
