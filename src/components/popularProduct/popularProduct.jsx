import { useState, useEffect, useRef } from "react";
import './popularProduct.css';
import slide1 from '../../assets/slide1.jpg';
import slide2 from '../../assets/slide2.png';
import slide3 from '../../assets/slide3.jpg';
import slide4 from '../../assets/slide4.jpg';
import slide5 from '../../assets/slide5.jpg';
import slide6 from '../../assets/slide6.jpg';
import slide7 from '../../assets/slide7.jpg';
import slide8 from '../../assets/slide8.jpg';

const PopularProduct = () => {
  const [cardWidth, setCardWidth] = useState(256);
  const [isInitialized, setIsInitialized] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(0);

  const sectionRef = useRef(null);
  const animationRef = useRef(null);
  const lastScrollY = useRef(0);
  const scrollTimeoutRef = useRef(null);
  const translateXRef = useRef(0); // store current translateX
  const lastTimeRef = useRef(performance.now());

  const products = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];

  const duplicatedProducts = [...products, ...products];

  // Set card width
  useEffect(() => {
    const calcWidth = () => {
      const w = window.innerWidth;
      if (w < 640) return 200;
      if (w < 1024) return 240;
      return 256;
    };
    setCardWidth(calcWidth());
    setIsInitialized(true);

    const handleResize = () => setCardWidth(calcWidth());
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Detect scroll direction
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        const delta = window.scrollY - lastScrollY.current;
        if (Math.abs(delta) > 1) {
          setScrollDirection(delta > 0 ? -1 : 1);
          if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
          scrollTimeoutRef.current = setTimeout(() => setScrollDirection(0), 150);
        }
        lastScrollY.current = window.scrollY;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Animation loop (mobile + desktop)
  useEffect(() => {
    if (!isInitialized) return;

    const animate = (time) => {
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      const totalWidth = cardWidth * products.length;
      let speedPerMs;

      // Scroll-based speed
      if (scrollDirection === 0) speedPerMs = window.innerWidth < 640 ? 0.05 : 0.2;
      else speedPerMs = window.innerWidth < 640 ? 0.15 * scrollDirection : 0.5 * scrollDirection;

      translateXRef.current += speedPerMs * deltaTime;
      translateXRef.current = Math.round(translateXRef.current);

      // Infinite loop
      if (translateXRef.current < -totalWidth) translateXRef.current = 0;
      if (translateXRef.current > 0) translateXRef.current = -totalWidth;

      const container = document.querySelector('.js-carousel');
      if (container) container.style.transform = `translate3d(${translateXRef.current}px,0,0)`;

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [cardWidth, scrollDirection, isInitialized, products.length]);

  const ProductCard = ({ src, index }) => (
    <div
      key={index}
      className="flex-none border-x-5 border-[#fcf5ea] overflow-hidden"
      style={{
        width: `${cardWidth}px`,
        height: `${cardWidth}px`,
        minWidth: `${cardWidth}px`,
        backfaceVisibility: 'hidden',
      }}
    >
      <img
        src={src}
        alt=""
        className="w-full rounded-t-full h-full object-cover"
        draggable={false}
      />
    </div>
  );

  if (!isInitialized) return null;

  return (
    <section ref={sectionRef} className="py-12 md:py-20 mb-30 overflow-hidden">
      <div className="mx-auto relative">
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 h-full w-20 sm:w-26 md:w-35 bg-gradient-to-r from-[#FCF5EA] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 h-full w-12 sm:w-16 md:w-20 bg-gradient-to-l from-[#FCF5EA] to-transparent z-10 pointer-events-none"></div>

        {/* Text overlay */}
        <div className="absolute bottom-[-30px] left-0 right-0 flex justify-center z-20 pointer-events-none">
          <div className="text-center py-4">
            <h2 className="text-3xl text-[#fff] bg-grid-lines bg-[#DD6A99] md:text-[3rem]  handwrite-font rotate-[-3deg]">
              Featured Products
            </h2>
          </div>
        </div>

        {/* Carousel */}
        <div className="flex js-carousel" style={{ gap: 0, height: `${cardWidth}px` }}>
          {duplicatedProducts.map((src, i) => (
            <ProductCard key={i} src={src} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularProduct;
