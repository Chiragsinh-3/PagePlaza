"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { BookX } from "lucide-react";

export default function NotFound() {
  // Animation variants
  const containerVariants = {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
    },
    visible: {
      filter: "blur(0px)",
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0,
      filter: "blur(10px)",
    },
    visible: {
      filter: "blur(0px)",
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4'>
      <motion.div
        className='text-center'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        <motion.div variants={itemVariants} className='mb-8'>
          <h1 className='text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
            Oops!
          </h1>
        </motion.div>
        <div className='flex justify-center'>
          {/* <motion.div
            variants={itemVariants}
            className='mb-8 flex justify-center'
          >
            <BookX className='w-24 h-24 text-indigo-600 dark:text-indigo-400' />
          </motion.div> */}

          <motion.h1
            variants={itemVariants}
            className='text-6xl md:text-8xl font-bold text-gray-900 dark:text-gray-100 mb-4'
          >
            404
          </motion.h1>
        </div>

        <motion.h2
          variants={itemVariants}
          className='text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4'
        >
          Page Not Found
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className='text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto'
        >
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </motion.p>

        <motion.div variants={itemVariants}>
          <Link href='/'>
            <motion.button
              className='px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-full shadow-lg transition-all'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Home
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
