import { useState, useEffect } from "react";

const ProductHero = () => {
  const [isSpread, setIsSpread] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSpread(true);
      } else {
        setIsSpread(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const polaroids = [
    {
      id: 1,
      image:
        "https://res.cloudinary.com/dgcy8wanx/image/upload/v1756040477/nssdfdshbeehn3fqrfqt.jpg",
      caption: "fancy",
      rotation: "rotate-12",
      centerPosition: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      spreadPosition: "-translate-x-90 -translate-y-1/2", // Adjusted for left spread
      mobileSpreadPosition:
        "-translate-x-24 sm:-translate-x-40 -translate-y-1/2",
      zIndex: "z-10",
    },
    {
      id: 2,
      image:
        "https://res.cloudinary.com/dgcy8wanx/image/upload/v1756040475/u5b0zc6vscg1fjitokyl.jpg",
      caption: "customized box",
      rotation: "-rotate-6",
      centerPosition: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      spreadPosition: "-translate-x-70 -translate-y-1/2", // Adjusted for left spread
      mobileSpreadPosition:
        "-translate-x-12 sm:-translate-x-20 -translate-y-1/2",
      zIndex: "z-20",
    },
    {
      id: 3,
      image:
        "https://res.cloudinary.com/dgcy8wanx/image/upload/v1756040476/fhix7muxjsc2bhmtka3v.jpg",
      caption: "Frames",
      rotation: "compare-3",
      centerPosition: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      spreadPosition: "-translate-x-0 -translate-y-1/2", // Centered
      mobileSpreadPosition: "-translate-x-0 -translate-y-1/2",
      zIndex: "z-30",
    },
    {
      id: 4,
      image:
        "https://res.cloudinary.com/dgcy8wanx/image/upload/v1756040475/zrcaa4lke48c2pz06prn.jpg",
      caption: "Gift box",
      rotation: "-rotate-8",
      centerPosition: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      spreadPosition: "translate-x-10 -translate-y-1/2", // Adjusted for right spread
      mobileSpreadPosition: "translate-x-12 sm:translate-x-20 -translate-y-1/2",
      zIndex: "z-40",
    },
    {
      id: 5,
      image:
        "https://res.cloudinary.com/dgcy8wanx/image/upload/v1756040477/iv9v9jh5uyzb5zpchzyr.jpg",
      caption: "bouquet",
      rotation: "rotate-6",
      centerPosition: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      spreadPosition: "translate-x-40 -translate-y-1/2", // Adjusted for right spread
      mobileSpreadPosition: "translate-x-24 sm:translate-x-40 -translate-y-1/2",
      zIndex: "z-50",
    },
  ];

  return (
    <div className="relative w-full">
      <div
        style={{
          background:
            "linear-gradient(to top, #fcf5ea 0%, rgba(255, 255, 255, 0) 20%)",
        }}
        className="absolute inset-0 z-52"
      ></div>
      {/* Mobile Layout */}
      <div className="block lg:hidden overflow-hidden">
        <div className="pt-30">
          {/* Text Content */}
          <div className="text-center mb-12">
            <h1 className="text-2xl handwrite-font sm:text-4xl bg-white rose rotate-[-3deg] mb-4 leading-tight">
              Handcraft Customized Gifts.
            </h1>
            <p className="text-gray-900 text-[12px] max-w-[45ch] font-light tracking-tighte text-base sm:text-lg mb-8 mx-auto">
              Unique, personalized gifts crafted with love and attention to
              detail. Every piece tells your story.
            </p>
          </div>

          {/* Polaroids - Mobile */}
          <div className="relative h-80 w-full flex items-center justify-center overflow-hidden">
            {polaroids.map((polaroid) => (
              <div
                key={polaroid.id}
                className={`absolute ${polaroid.centerPosition} ${
                  polaroid.zIndex
                } transform ${
                  polaroid.rotation
                } transition-all duration-700 ease-out cursor-pointer ${
                  isSpread ? polaroid.spreadPosition : ""
                }`}
                onClick={() => setIsSpread(!isSpread)}
              >
                {/* Polaroid container - Larger size */}
                <div className="bg-white p-1 hover:scale-110 transition-all duration-700">
                  {/* Photo - Larger size */}
                  <div className="w-50 h-58 sm:w-46 sm:h-46 bg-gray-200 overflow-hidden">
                    <img
                      src={polaroid.image}
                      alt={polaroid.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Caption */}
                  <div className="mt-2 text-center">
                    <p className="text-xs sm:text-sm handwrite-font text-gray-900 font-medium">
                      {polaroid.caption}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div
          style={{
            background:
              "linear-gradient(to top, #fcf5ea 0%, rgba(255, 255, 255, 0) 50%)",
          }}
          className="absolute inset-0 z-52"
        ></div>
        <div className="relative rounded-3xl p-8 pt-120 overflow-hidden">
          {/* Main content */}
          <div className="relative rotate-[-1deg] z-50 max-w-2xl mb-16 mx-auto text-center">
            <h1 className="text-5xl mt-10 handwrite-font rose mb-4">
              Handcraft Customized Gifts.
            </h1>
            <p className="text-gray-700 font-light tracking-tight text-sm mb-8">
              Unique, personalized gifts crafted with love and attention to
              detail. Every piece tells your story.
            </p>
          </div>

          {/* Polaroids - Desktop */}
          <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 z-40">
            {polaroids.map((polaroid) => (
              <div
                key={polaroid.id}
                className={`absolute ${polaroid.centerPosition} ${
                  polaroid.zIndex
                } transform ${
                  polaroid.rotation
                } transition-all duration-700 ease-out cursor-pointer ${
                  isSpread ? polaroid.spreadPosition : ""
                }`}
                onClick={() => setIsSpread(!isSpread)}
              >
                {/* Polaroid container - Larger size */}
                <div className="bg-white p-1 pb-1 hover:scale-110 transition-all duration-700 shadow-[0_2px_6px_rgba(0,0,0,0.01)]">
                  {/* Photo - Larger size */}
                  <div className="w-80 h-80 overflow-hidden">
                    <img
                      src={polaroid.image}
                      alt={polaroid.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Caption */}
                  <div className="mt-3 text-center">
                    <p className="text-sm handwrite-font text-gray-700 font-medium">
                      {polaroid.caption}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductHero;
