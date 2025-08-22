import { useRef } from 'react';
import ContactUs from "../components/contactUs/ContactUs";
import Footer from "../components/footer/Footer";
import HeroSection from "../components/heroSection/HeroSection";
import Navbar from "../components/navbar/Navbar";
import PopularProduct from "../components/popularProduct/popularProduct";
import ScrollReveal from "../components/reactbites/ScrollReveal";
import Testimonials from "../components/reactbites/Testimonials";
import Service from "../components/serviceSection/Service";

const Home = () => {
  const contactRef = useRef(null);

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <Navbar scrollToContact={scrollToContact} />
      <HeroSection />
      <ScrollReveal
        baseOpacity={0}
        enableBlur={true}
        baseRotation={5}
        blurStrength={10}
      >
        Every handcrafted gift carries a piece of heart, a touch of tradition,
        and a spark of creativity. It is not just something made, but a story
        woven to make every moment unforgettable.
      </ScrollReveal>
      <Service />
      <PopularProduct />
      <Testimonials />
      <ContactUs ref={contactRef} />
      <Footer scrollToContact={scrollToContact}  />
    </div>
  );
};

export default Home;
