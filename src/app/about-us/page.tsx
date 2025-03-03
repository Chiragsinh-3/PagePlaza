"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  ShoppingCart,
  Heart,
  Shield,
  Database,
  Code,
  CalendarIcon,
  ArrowRight,
} from "lucide-react";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiRedux,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiRazorpay,
} from "react-icons/si";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { motion } from "framer-motion";

const variants1 = {
  hidden: { filter: "blur(10px)", opacity: 0 },
  visible: { filter: "blur(0px)", opacity: 1 },
};
// Hero Section Component
const HeroSection = () => (
  <section className='min-h-[50vh] space-y-3 bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex flex-col items-center justify-center px-4'>
    <motion.h1
      initial='hidden'
      animate='visible'
      variants={variants1}
      transition={{ duration: 1 }}
      className='text-5xl font-bold mb-4'
    >
      Page Plaza
    </motion.h1>
    <motion.p
      initial='hidden'
      animate='visible'
      variants={variants1}
      transition={{ delay: 0.3, duration: 0.8 }}
      className='text-xl mb-8 text-center max-w-2xl'
    >
      A modern Buying experience built for book lovers.
    </motion.p>
  </section>
);

// Feature Card for Platform Overview
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  delay: number;
}

const FeatureCard = ({
  icon,
  title,
  description,
  bgColor,
  delay,
}: FeatureCardProps) => (
  <motion.div
    className='bg-white/80 dark:bg-gray-700 p-6 rounded-2xl shadow-lg'
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ type: "spring", stiffness: 100, damping: 15, delay: delay }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
  >
    <div className='flex items-center mb-4'>
      <div className={`p-3 rounded-full mr-2 ${bgColor}`}>{icon}</div>
      <h3 className='text-xl font-semibold text-center'>{title}</h3>
    </div>
    <p className='text-gray-600 dark:text-gray-300 text-center'>
      {description}
    </p>
  </motion.div>
);

// Platform Overview Section
const OverviewSection = () => {
  const features = [
    {
      icon: (
        <BookOpen className='h-8 w-8 text-indigo-600 dark:text-indigo-400' />
      ),
      title: "User Experience",
      description:
        "Intuitive design, responsive layout, and seamless navigation.",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/40",
      delay: 0,
    },
    {
      icon: (
        <ShoppingCart className='h-8 w-8 text-purple-600 dark:text-purple-400' />
      ),
      title: "Shopping Features",
      description:
        "Interactive cart, wishlist, and secure payment integration.",
      bgColor: "bg-purple-100 dark:bg-purple-900/40",
      delay: 0.1,
    },
    {
      icon: <Shield className='h-8 w-8 text-blue-600 dark:text-blue-400' />,
      title: "Security",
      description: "Robust authentication and secure session management.",
      bgColor: "bg-blue-100 dark:bg-blue-900/40",
      delay: 0.2,
    },
  ];
  return (
    <section className='py-16 bg-gray-50 dark:bg-gray-800'>
      <div className='container mx-auto px-6'>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className='text-3xl font-bold text-center mb-12'
          viewport={{ once: true }}
        >
          Platform Overview
        </motion.h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {features.map((item, index) => (
            <FeatureCard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Core Features Section
const CoreFeaturesSection = () => {
  const coreFeatures = [
    {
      frontContent: {
        title: "Advanced Book Discovery",
        subtitle: "Find your next read",
      },
      backContent: {
        title: "Discover More",
        description:
          "Efficient filters, smart search, and detailed book information.",
      },
    },
    {
      frontContent: {
        title: "Personalized Experience",
        subtitle: "Tailored for you",
      },
      backContent: {
        title: "Customized",
        description: "Customized recommendations and seamless order tracking.",
      },
    },
    {
      frontContent: {
        title: "Robust Backend",
        subtitle: "Built to scale",
      },
      backContent: {
        title: "High Performance",
        description:
          "Powered by MongoDB, Express, and Node for optimal performance.",
      },
    },
    {
      frontContent: {
        title: "Modern Tech Stack",
        subtitle: "Cutting edge",
      },
      backContent: {
        title: "Innovative",
        description:
          "Built with Next.js, React, TypeScript, and Redux Toolkit.",
      },
    },
  ];

  return (
    <section className='py-16 bg-white dark:bg-black'>
      <div className='container mx-auto px-6'>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className='text-3xl font-bold text-center mb-12'
          viewport={{ once: true }}
        >
          Core Features
        </motion.h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8  mx-auto w-fit'>
          {coreFeatures.map((feature, index) => (
            <motion.div
              key={index}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              viewport={{ once: true }}
              className='w-fit'
            >
              <FlipCard
                frontContent={feature.frontContent}
                backContent={feature.backContent}
                width='300px'
                height='200px'
                flipDirection='horizontal'
                triggerMode='hover'
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Technology Highlights Section
const TechHighlightsSection = () => {
  const techs = [
    {
      name: "Next.js",
      color: "bg-black dark:bg-white text-white dark:text-black",
      icon: SiNextdotjs,
      description: "The React Framework – created and maintained by Vercel.",
      avatar: "https://github.com/vercel.png",
    },
    {
      name: "React",
      color: "bg-blue-500 text-white",
      icon: SiReact,
      description: "A JavaScript library for building user interfaces.",
      avatar: "https://avatars.githubusercontent.com/u/6412038?v=4",
    },
    {
      name: "TypeScript",
      color: "bg-blue-600 text-white",
      icon: SiTypescript,
      description: "Typed JavaScript at Any Scale.",
      avatar: "https://cdn.worldvectorlogo.com/logos/typescript.svg",
    },
    {
      name: "Redux",
      color: "bg-purple-600 text-white",
      icon: SiRedux,
      description: "A Predictable State Container for JavaScript Apps.",
      avatar:
        "https://raw.githubusercontent.com/reduxjs/redux/master/logo/logo.png",
    },
    {
      name: "Node.js",
      color: "bg-green-600 text-white",
      icon: SiNodedotjs,
      description: "JavaScript runtime built on Chrome's V8 engine.",
      avatar: "https://nodejs.org/static/images/logo.svg",
    },
    {
      name: "Express ",
      color: "bg-gray-700 dark:bg-gray-300 dark:text-gray-800 text-white",
      icon: SiExpress,
      description: "Fast, unopinionated, minimalist web framework for Node.js.",
      avatar:
        "https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png",
    },
    {
      name: "MongoDB",
      color: "bg-green-500 text-white",
      icon: SiMongodb,
      description: "The database for modern applications.",
      avatar:
        "https://webassets.mongodb.com/_com_assets/cms/mongodb-logo-rgb-j6w271g1xn.jpg",
    },
    {
      name: "Razorpay",
      color: "bg-blue-700 text-white",
      icon: SiRazorpay,
      description: "A complete payment solution for businesses.",
      avatar: "https://razorpay.com/assets/razorpay-logomark.svg",
    },
  ];

  return (
    <section className='py-16'>
      <div className='container mx-auto px-6'>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className='text-3xl font-bold text-center mb-12'
          viewport={{ once: true }}
        >
          Technology Highlights
        </motion.h2>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center'>
          {techs.map((tech, index) => {
            const IconComponent = tech.icon;
            return (
              <HoverCard key={index}>
                <HoverCardTrigger asChild>
                  <motion.div
                    title={tech.name}
                    className={`${tech.color} rounded-full flex items-center justify-center h-20 w-20 cursor-pointer`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      delay: index * 0.1,
                    }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <IconComponent className='h-10 w-10' />
                  </motion.div>
                </HoverCardTrigger>
                <HoverCardContent className='w-80 p-4'>
                  <div className='flex justify-between space-x-4'>
                    <IconComponent className='h-10 w-10' />

                    <div className='space-y-1'>
                      <h4 className='text-sm font-semibold'>{tech.name}</h4>
                      <p className='text-sm'>{tech.description}</p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Call-to-Action Section
// const CTASection = () => (
//   <section className='py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white'>
//     <div className='container mx-auto px-6 text-center'>
//       <motion.h2
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         className='text-3xl font-bold mb-4'
//         viewport={{ once: true }}
//       >
//         Ready to Explore?
//       </motion.h2>
//       <motion.button
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         className='px-8 py-4 bg-white text-indigo-600 font-bold rounded-full shadow-lg transition'
//       >
//         Dive In
//       </motion.button>
//     </div>
//   </section>
// );

// Main Page Component
const Page = () => {
  return (
    <div className='min-h-screen font-sans bg-white dark:bg-black text-gray-800 dark:text-gray-200'>
      <HeroSection />
      <OverviewSection />
      <CoreFeaturesSection />
      <TechHighlightsSection />
      {/* <CTASection /> */}
    </div>
  );
};

interface FlipCardProps {
  frontContent: {
    title: string;
    subtitle?: string;
  };
  backContent: {
    title: string;
    description: string;
  };
  width?: string;
  height?: string;
  flipDirection?: "horizontal" | "vertical";
  triggerMode?: "hover" | "click";
}

const FlipCard: React.FC<FlipCardProps> = ({
  frontContent,
  backContent,
  width = "300px",
  height = "200px",
  flipDirection = "horizontal",
  triggerMode = "hover",
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const toggleFlip = () => {
    if (triggerMode === "click") {
      setIsFlipped(!isFlipped);
    }
  };

  const rotateValue =
    flipDirection === "horizontal" ? "rotateY(180deg)" : "rotateX(180deg)";

  const cardStyle = {
    width,
    height,
    perspective: "1000px",
  };

  const faceClassNames = cn(
    "absolute w-full h-full flex flex-col items-center justify-center p-6",
    "backface-hidden rounded-2xl shadow-lg border border-gray-200",
    "dark:border-gray-700 overflow-hidden"
  );

  return (
    <div
      ref={cardRef}
      style={cardStyle}
      onMouseEnter={() => {
        if (triggerMode === "hover") setIsFlipped(true);
      }}
      onMouseLeave={() => {
        if (triggerMode === "hover") setIsFlipped(false);
      }}
      onClick={toggleFlip}
      className='cursor-pointer relative rounded-2xl'
    >
      <motion.div
        className='w-full h-full relative rounded-2xl'
        style={{ transformStyle: "preserve-3d" }}
        animate={{ transform: isFlipped ? rotateValue : "none" }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Front Side */}
        <div
          className={cn(
            faceClassNames,
            "bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900"
          )}
        >
          <h3 className='text-2xl text-center font-semibold mb-2 text-gray-800 dark:text-white'>
            {frontContent.title}
          </h3>
          {frontContent.subtitle && (
            <p className='text-sm text-gray-600 dark:text-gray-300'>
              {frontContent.subtitle}
            </p>
          )}
          <ArrowRight className='absolute bottom-4 right-4 w-6 h-6 text-gray-400 dark:text-gray-500' />
        </div>
        {/* Back Side */}
        <div
          className={cn(
            faceClassNames,
            "bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
          )}
          style={{ transform: rotateValue, backfaceVisibility: "hidden" }}
        >
          <h3 className='text-xl font-semibold mb-3 text-gray-800 dark:text-white'>
            {backContent.title}
          </h3>
          <p className='text-sm text-gray-600 dark:text-gray-300 text-center'>
            {backContent.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Page;
