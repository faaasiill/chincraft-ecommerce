import { Gift, Camera, Calendar, Heart, Sparkles, Rose } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const Service = () => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const itemRefs = useRef([]);

  const services = [
    {
      id: 1,
      icon: <Gift className="w-5 h-5" />,
      title: "Gift Hampers & Bouquets",
      description:
        "Handmade hampers designed for every occasion. Unique bouquets crafted with love and creativity.",
    },
    {
      id: 2,
      icon: <Camera className="w-5 h-5" />,
      title: "Personalized Frames & Polaroids",
      description:
        "Custom photo frames for memories. Polaroid-style prints for a retro touch.",
    },
    {
      id: 3,
      icon: <Calendar className="w-5 h-5" />,
      title: "Special Occasion Gifts",
      description:
        "Birthday surprises that feel personal. Nikkah & Wedding gifts with elegant finishing.",
    },
    {
      id: 4,
      icon: <Heart className="w-5 h-5" />,
      title: "Event Essentials",
      description:
        "Save the Date cards and keepsakes. Customized calligraphy for invitations & decor.",
    },
    {
      id: 5,
      icon: <Sparkles className="w-5 h-5" />,
      title: "Lifestyle & Accessories",
      description:
        "Handmade crunches and small craft products. Creative everyday items with a personalized feel.",
    },
    {
      id: 6,
      icon: <Rose className="w-5 h-5" />,
      title: "Wedding & Nikkah Keepsakes",
      description:
        "Customized wedding and nikkah gifts, ring albums, and keepsakes that make your special day unforgettable.",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setTimeout(() => {
              setVisibleItems((prev) => new Set([...prev, index]));
            }, index * 150); // staggered animation
          }
        });
      },
      { threshold: 0.2 }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-4">
            <span className="text-sm text-gray-500 uppercase font-light">
              Our Services
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl handwrite-font font-light text-[#DD6A99] mb-6">
            Crafted with Love.
          </h2>

          <div className="w-20 h-px bg-gray-900 mx-auto mb-8"></div>

          <p className="text-gray-600 tracking-tight max-w-lg mx-auto font-light leading-relaxed">
            Every piece tells a story, every detail matters in our{" "}
            <strong>handcrafted</strong> collections
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {services.map((service, index) => (
            <div
              key={service.id}
              data-index={index}
              ref={(el) => (itemRefs.current[index] = el)}
              className={`service-card transition-all duration-700 ease-out ${
                visibleItems.has(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="text-center group">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto flex items-center justify-center text-gray-700 mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl handwrite-font font-light text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-light">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Service;
