// ThemeToggle moved to App.tsx for site-wide placement
import Hero from "@/components/Hero";
import GraphicDesigns from "@/components/GraphicDesigns";
import About from "@/components/About";
import Experience from "@/components/Experience";
import TechStack from "@/components/TechStack";
import Certifications from "@/components/Certifications";
import Projects from "@/components/Projects";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
// Chatbot is now rendered site-wide in App.tsx

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      
      
      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <Hero />
        
        <div className="mt-6">
          <GraphicDesigns />
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-6">
            <About />
            <TechStack />
          </div>
          <div className="space-y-6">
            <Experience />
            <Certifications />
          </div>
        </div>
        
        <div className="mt-6">
          <Projects />
        </div>
        
        <div className="mt-6">
          <Gallery />
        </div>
        
        <Footer />
      </main>
      
      
    </div>
  );
};

export default Index;
