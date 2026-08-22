import MainLayout from "../layouts/MainLayout";
import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import WhyChooseUs from "../components/WhyChooseUs";

export default function Home() {
  return (
    <MainLayout>
      <Hero />
      <AboutSection />
      <WhyChooseUs />
    </MainLayout>
  );
}