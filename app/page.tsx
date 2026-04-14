import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import HowItWorks from "../components/home/HowItWorks";
import FeaturesGrid from "../components/home/FeaturesGrid";
import DashboardPreview from "../components/home/DashboardPreview";
import Testimonials from "../components/home/Testimonials";
import PartnersSection from "../components/home/PartnersSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 overflow-hidden">
        <HeroSection />
        <PartnersSection />
        <StatsSection />
        <HowItWorks />
        <FeaturesGrid />
        <DashboardPreview />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
