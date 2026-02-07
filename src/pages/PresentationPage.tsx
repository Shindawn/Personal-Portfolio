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

  // Check if this is the capstone presentation and set video URL
  const isCapstone = presentation.title.toLowerCase().includes('capstone');
  const videoUrl = isCapstone ? "/presentations/aribacomp.mp4" : undefined;
  const videoThumbnail = isCapstone ? "/presentations/ariba.jpg" : undefined;

  return (
    <PresentationViewer
      title={presentation.title}
      pdfUrl={presentation.pdf}
      videoUrl={videoUrl}
      videoThumbnail={videoThumbnail}
    />
  );
};

export default PresentationPage;