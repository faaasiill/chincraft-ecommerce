import { useState, useEffect } from "react";
import img1 from "../../assets/img1.JPG";
import img4 from "../../assets/img4.JPG";
import img5 from "../../assets/img5.JPG";
import { MoveRight } from "lucide-react";

const HeroSection = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="min-h-screen mt-27 from-rose-50 via-amber-50 to-orange-50 overflow-hidden">
      <div className="px-4 sm:px-8 lg:px-16 pb-16 relative">
        {/* Image Layout */}
        <div className="relative flex flex-wrap justify-center items-start gap-4 sm:gap-6 lg:gap-8 mb-16">
          {/* Image 1 - Left side, moving up slowly */}
          <div
            className={`transition-all duration-[8000ms] ease-out ${
              animate ? "transform translate-y-[-20px]" : ""
            }`}
          >
            <img
              src={img1}
              alt=""
              className="w-32 sm:w-48 lg:w-64 h-auto object-cover transition-transform duration-[6000ms] hover:scale-105"
            />
            {/* Small rotated text */}
            <div className="absolute-top-4 -left-2">
              <span className="handwrite-font text-center text-xs text-[#DD6A99] transform -rotate-12 block">
                Celebrate Moments <br />
                with Handmade.
              </span>
            </div>
          </div>

          {/* Image 2 - Center left, moving down slowly */}
          <div
            className={`transition-all duration-[10000ms] ease-out ${
              animate ? "transform translate-y-[15px]" : ""
            } mt-8 sm:mt-12`}
          >
            <img
              src={img5}
              alt=""
              className="w-30 sm:w-56 lg:w-62 h-auto object-cover transition-transform duration-[7000ms] hover:scale-105"
            />
            {/* Small rotated text */}
            <div className="absolute -bottom-3 -right-3">
              <span className="handwrite-font text-xs text-gray-950 bg-[#fff] transform rotate-5 block">
                Crafted Beauty, Timeless Memories.
              </span>
            </div>
          </div>

          {/* Content Creator Badge */}
          <div
            className={`relative transition-all duration-[9000ms] ease-out ${
              animate ? "transform translate-y-[-10px]" : ""
            } bg-white bg-opacity-60 backdrop-blur-sm p-4 sm:p-6 flex flex-col justify-center items-center text-center mt-16 sm:mt-20`}
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 11px, #d1d5db 12px)`,
              backgroundSize: "100% 12px",
            }}
          >
            {/* Fixed vertical margin line */}
            <span className="absolute top-0 left-4 w-[1px] h-full bg-rose-400"></span>

            <h3 className="handwrite-font text-md sm:text-lg lg:text-xl font-light text-gray-800 mb-2">
              ChinCraft
            </h3>

            <p className="text-xs tracking-tighter sm:text-sm text-gray-600 font-light italic">
              Crafted with Love
            </p>

            {/* Small rotated text */}
            <div className="handwrite-font absolute -top-4 -left-4">
              <span className="text-[8px] bg-[#e0d3af] opacity-80 p-1 text-gray-900 transform -rotate-5 block">
                Personal Touch, Perfect Gift.
              </span>
            </div>
          </div>

          {/* Image 4 - Far right, moving down slowly */}
          <div
            className={`transition-all duration-[12000ms] ease-out ${
              animate ? "transform translate-y-[25px]" : ""
            } mt-6 sm:mt-10`}
          >
            <img
              src={img4}
              alt=""
              className="w-36 sm:w-52 lg:w-68 h-auto object-cover transition-transform duration-[9000ms] hover:scale-105"
            />
            {/* Small rotated text */}
            <div className="absolute -bottom-4 -left-3">
              <span className="handwrite-font text-xs text-[#fff] bg-[#DD6A99] text-center transform -rotate-3 block">
                Love, care, and artistry shape every handmade gift beautifully.
              </span>
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <div className="text-center mb-16 relative">
          <blockquote className="handwrite-font text-sm sm:text-base lg:text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
            “Every handcrafted gift is more than a product — it is a story, a
            memory, and a piece of the heart, carefully shaped with love to
            bring timeless joy.”
          </blockquote>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-center items-center relative">
          <button className="bg-[#DD6A99] w-[220px] h-[60px] rounded-full text-white hover:bg-[#d94a83] font-medium flex items-center justify-center gap-2">
            <span className="handwrite-font text-2xl tracking-tighter">
              Shop Now
            </span>
            <MoveRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
