"use client";
import React from "react";
import { motion } from "motion/react";
import testimonials from "./TestimonialsUser"


// Column Component
const TestimonialsColumn = ({
  className,
  testimonials,
  duration = 10,
}: {
  className?: string;
  testimonials: {
    text: string;
    image: string;
    name: string;
    role: string;
  }[];
  duration?: number;
}) => {
  return (
    <div className={className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {[...new Array(2).fill(0)].map((_, index) => (
          <React.Fragment key={index}>
            {testimonials.map(({ text, image, name, role }, i) => (
              <div
                key={i}
                className="p-10 max-w-xs w-full relative bg-white overflow-hidden"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, transparent 30px, #e11d48 30px, #e11d48 31px, transparent 31px),
                    repeating-linear-gradient(
                      transparent,
                      transparent 24px,
                      #e5e7eb 24px,
                      #e5e7eb 25px
                    )
                  `,
                  backgroundSize: '100% 100%, 100% 25px'
                }}
              >
                <div className="handwrite-font font-[2px] relative z-10 pl-8">{text}</div>
                <div className="flex items-center gap-2 mt-5 relative z-10 pl-8">
                  <img
                    src={image}
                    alt={name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex flex-col">
                    <div className="font-medium">{name}</div>
                    <div className="opacity-60 text-sm">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};


// Main Section
const Testimonials = () => {
  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  return (
    <section className="bg-background relativ mb-50">
      <div className="container z-10 mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <h2 className="text-xl handwrite-font text-[#DD6A99] sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight mt-5">
            What our users say.
          </h2>
          <p className="text-center tracking-tight italic mt-5 opacity-75">
            See what our customers have to say about us.
          </p>
        </motion.div>

        {/* Testimonials Columns */}
        <div className="flex justify-center gap-6  mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block "
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
