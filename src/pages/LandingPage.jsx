import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/blog/HeroSection";
import ArticleSection from "@/components/blog/ArticleSection";
import Footer from "@/components/layout/Footer";

function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ArticleSection />
      <Footer />
    </>
  );
}

export default LandingPage;