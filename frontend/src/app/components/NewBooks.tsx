"use client";
import { useGetAllProductsQuery } from "@/store/api";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Book, ChevronLeft, ChevronRight } from "lucide-react";

const NewBooks = () => {
  const { data: booksData } = useGetAllProductsQuery({});
  const books = booksData?.data || [];

  // State for responsive display
  const [booksToShow, setBooksToShow] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Responsive design logic
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        // Mobile
        setBooksToShow(1);
      } else if (width < 1024) {
        // Tablet
        setBooksToShow(2);
      } else {
        // Desktop
        setBooksToShow(3);
      }
      // Reset index when layout changes
      setCurrentIndex(0);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    const startAutoScroll = () => {
      autoScrollIntervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex >= books.length - booksToShow) {
            return 0;
          }
          return prevIndex + 1;
        });
      }, 5000);
    };

    if (books.length > booksToShow) {
      startAutoScroll();
    }

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [books, booksToShow]);

  const calculateDiscount = (price: number, finalPrice: number): number => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100);
    }
    return 0;
  };

  const handleScroll = (direction: "left" | "right") => {
    // Clear auto-scroll when user manually interacts
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }

    setCurrentIndex((prevIndex) => {
      if (direction === "left") {
        return Math.max(0, prevIndex - 1);
      } else {
        return Math.min(books.length - booksToShow, prevIndex + 1);
      }
    });
  };

  // Card width + gap is assumed to be 320px (300px width + 20px gap)
  const cardWidth = 300 + 24; // 300px for card + 24px for gap (gap-6 = 1.5rem = 24px)

  // Add drag constraints calculation
  const dragConstraints = {
    left: -((books.length - booksToShow) * cardWidth),
    right: 0,
  };

  // Handle drag end
  const handleDragEnd = (event: any, info: any) => {
    const dragDistance = info.offset.x;
    const snapPoint = Math.round(-info.point.x / cardWidth);

    setCurrentIndex(
      Math.max(0, Math.min(books.length - booksToShow, snapPoint))
    );

    // Clear auto-scroll when user drags
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }
  };

  return (
    <section className='pt-12 bg-white dark:bg-black'>
      <div className='container mx-auto px-4'>
        <h2 className='text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white'>
          Recently Added Books
        </h2>

        <div
          className='relative overflow-hidden max-w-[960px] mx-auto'
          ref={constraintsRef}
        >
          <motion.div
            className='flex gap-6 cursor-grab active:cursor-grabbing'
            animate={{ x: -currentIndex * cardWidth }}
            drag='x'
            dragConstraints={dragConstraints}
            dragElastic={1}
            dragMomentum={true}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(e, info) => {
              setIsDragging(false);
              handleDragEnd(e, info);
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            {books.map((book: any) => (
              <motion.div
                key={book._id}
                className='w-[300px] flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden'
                whileHover={{ scale: isDragging ? 1 : 1.02 }}
              >
                <Link
                  href={`/books/${book._id}`}
                  onClick={(e) => isDragging && e.preventDefault()}
                >
                  <div className='relative h-[300px] w-full'>
                    {book.images && book.images[0] ? (
                      <Image
                        src={book.images[0]}
                        alt={book.title}
                        fill
                        className='object-cover'
                        sizes='(max-width: 768px) 300px, 300px'
                        priority
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700'>
                        <Book className='w-12 h-12 text-gray-400' />
                      </div>
                    )}
                    {calculateDiscount(book.price, book.finalprice) > 0 && (
                      <div className='absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm'>
                        {calculateDiscount(book.price, book.finalprice)}% OFF
                      </div>
                    )}
                  </div>

                  <div className='p-4 h-[150px] flex flex-col justify-between'>
                    <div>
                      <h3 className='font-semibold text-lg mb-1 text-gray-900 dark:text-white truncate'>
                        {book.title}
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>
                        by {book.author}
                      </p>
                    </div>
                    <div className='flex justify-between items-center'>
                      <div className='flex items-center gap-2'>
                        <span className='text-lg font-bold text-indigo-600 dark:text-indigo-400'>
                          ₹{book.finalprice}
                        </span>
                        {book.price !== book.finalprice && (
                          <span className='text-sm text-gray-500 line-through'>
                            ₹{book.price}
                          </span>
                        )}
                      </div>
                      <span className='text-sm text-gray-500 dark:text-gray-400'>
                        {book.condition}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className='flex justify-center mt-10 gap-4'>
          <button
            onClick={() => handleScroll("left")}
            disabled={currentIndex === 0}
            className={`p-2 rounded-full ${
              currentIndex === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            } text-white transition-colors`}
          >
            <ChevronLeft className='w-6 h-6' />
          </button>
          <button
            onClick={() => handleScroll("right")}
            disabled={currentIndex >= books.length - booksToShow}
            className={`p-2 rounded-full ${
              currentIndex >= books.length - booksToShow
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            } text-white transition-colors`}
          >
            <ChevronRight className='w-6 h-6' />
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewBooks;
