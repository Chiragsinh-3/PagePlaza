"use client";
import React from "react";
import { books } from "@/lib/BookData";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import {
  FiShare2,
  FiHeart,
  FiShoppingCart,
  FiMapPin,
  FiPhone,
  FiCheckCircle,
} from "react-icons/fi";

export default function BookDetail() {
  const params = useParams();
  const id = params.id;
  const [book, setBook] = useState<(typeof books)[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      // In a real app, this would be an API call
      const foundBook = books.find((b) => b._id === id) || null;
      setBook(foundBook);
      setLoading(false);
    }
  }, [id]);
  const handleAddToCart = () => {
    // Implement your add to cart logic here
  };
  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-4'>Book not found</h1>
          <Link href='/books'>
            <div className='text-blue-500 hover:underline'>
              Back to all books
            </div>
          </Link>
        </div>
      </div>
    );
  }

  interface DiscountCalculation {
    price: number;
    finalPrice: number;
  }

  const calculateDiscount = ({
    price,
    finalPrice,
  }: DiscountCalculation): number => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100);
    }
    return 0;
  };
  // Placeholder images since the provided data doesn't have real images
  const placeholderImages = ["/sepiens1.jpg", "/sepiens2.jpg"];

  return (
    <>
      <Head>
        <title>{book.title} | BookExchange</title>
        <meta name='description' content={book.description} />
      </Head>

      <div className='bg-white min-h-screen pb-12 dark:bg-black'>
        {/* Breadcrumb Navigation */}
        <div className='container mx-auto px-4 py-4 text-sm text-gray-600 dark:text-gray-300'>
          <div className='flex items-center space-x-2'>
            <Link href='/'>
              <div className='hover:text-blue-600 dark:hover:text-blue-400'>
                Home
              </div>
            </Link>
            <span>/</span>
            <Link href='/books'>
              <div className='hover:text-blue-600 dark:hover:text-blue-400'>
                Books
              </div>
            </Link>

            {/* <Link href={`/categories/${encodeURIComponent(book.category)}`}> */}

            {/* </Link> */}
            <span>/</span>
            <span className='text-gray-400 dark:text-gray-500'>
              {book.title}
            </span>
          </div>
        </div>

        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {/* Left Column - Book Images */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='relative w-full h-[60vh] bg-gray-50/90 flex justify-center rounded-lg overflow-hidden shadow-md mb-4 dark:bg-gray-800 dark:shadow-none'
              >
                {calculateDiscount({
                  price: book.price,
                  finalPrice: book.finalPrice,
                }) && (
                  <div className='absolute top-4 left-4 bg-red-500 text-white px-2 py-1 text-sm font-bold rounded'>
                    25% Off
                  </div>
                )}
                <img
                  src={placeholderImages[selectedImage]}
                  alt={book.title}
                  className=' h-full object-cover'
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className='flex space-x-2 overflow-x-auto pb-2'
              >
                {placeholderImages.map((img, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer border-2 rounded-md overflow-hidden ${
                      selectedImage === index
                        ? "border-blue-500"
                        : "border-transparent dark:border-gray-700"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={img}
                      alt={`${book.title} thumbnail ${index + 1}`}
                      className='w-16 h-16 object-cover'
                    />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Column - Book Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className='space-y-6'
            >
              <h1 className='text-3xl font-bold text-gray-800 dark:text-white'>
                {book.title}
              </h1>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Posted 2 months ago
              </p>

              <div className='flex items-end space-x-4'>
                <div className='text-3xl font-bold dark:text-white'>
                  ₹{book.finalPrice}
                </div>
                <div className='text-xl text-gray-500 line-through dark:text-gray-400'>
                  ₹{book.price}
                </div>
                <div className='text-sm text-green-600 dark:text-green-400'>
                  Shipping Available
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded flex items-center justify-center space-x-2 transition-all'
                onClick={handleAddToCart}
              >
                <FiShoppingCart />
                <span>Buy Now</span>
              </motion.button>

              <div className='flex space-x-4'>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='flex items-center space-x-2 text-gray-600 dark:text-gray-400'
                >
                  <FiShare2 />
                  <span>Share</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='flex items-center space-x-2 text-gray-600 dark:text-gray-400'
                >
                  <FiHeart />
                  <span>Add</span>
                </motion.button>
              </div>

              <div className='bg-gray-50 p-6 rounded-lg shadow-sm dark:bg-gray-800 dark:shadow-none'>
                <h2 className='text-lg font-bold mb-4 dark:text-white'>
                  Book Details
                </h2>
                <div className='grid grid-cols-2 gap-y-4'>
                  <div className='text-gray-600 dark:text-gray-300'>
                    Subject/Title
                  </div>
                  <div className='font-medium dark:text-gray-100'>
                    {book.subject}
                  </div>

                  <div className='text-gray-600 dark:text-gray-300'>Course</div>
                  <div className='font-medium dark:text-gray-100'>
                    {book.classType}
                  </div>

                  <div className='text-gray-600 dark:text-gray-300'>
                    Category
                  </div>
                  <div className='font-medium dark:text-gray-100'>
                    {book.category}
                  </div>

                  <div className='text-gray-600 dark:text-gray-300'>Author</div>
                  <div className='font-medium dark:text-gray-100'>
                    {book.author}
                  </div>

                  <div className='text-gray-600 dark:text-gray-300'>
                    Edition
                  </div>
                  <div className='font-medium dark:text-gray-100'>
                    {book.edition || "1st"}
                  </div>

                  <div className='text-gray-600 dark:text-gray-300'>
                    Condition
                  </div>
                  <div className='font-medium capitalize dark:text-gray-100'>
                    {book.condition}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Description Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className='mt-8 bg-gray-50 p-6 rounded-lg shadow-sm dark:bg-gray-800 dark:shadow-none'
          >
            <h2 className='text-lg font-bold mb-4 dark:text-white'>
              Description
            </h2>
            <p className='text-gray-700 dark:text-gray-300'>
              {book.description || "This is math book for class 6th students"}
            </p>
            <hr className='my-6 border-gray-200 dark:border-gray-700' />
            <div>
              <h3 className='text-lg font-bold mb-4 dark:text-white'>
                Our Community
              </h3>
              <p className='text-gray-700 dark:text-gray-300'>
                We're not just another shopping website where you buy from
                professional sellers - we are a vibrant community of students,
                book lovers across India who deliver happiness to each other!
              </p>
            </div>
          </motion.div>

          {/* Seller Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className='mt-8 bg-gray-50 p-6 rounded-lg shadow-sm dark:bg-gray-800 dark:shadow-none'
          >
            <h2 className='text-lg font-bold mb-4 dark:text-white'>Sold By</h2>
            <div className='flex items-center space-x-4'>
              <div className='bg-blue-100 rounded-full p-4 dark:bg-blue-900'>
                <div className='w-12 h-12 flex items-center justify-center text-blue-600 text-2xl dark:text-blue-300'>
                  {book.seller?.name.charAt(0) || "V"}
                </div>
              </div>
              <div>
                <div className='font-bold flex items-center dark:text-white'>
                  Virat Kohli
                  <span className='ml-2 text-green-600 flex items-center text-sm font-normal dark:text-green-400'>
                    <FiCheckCircle className='mr-1' /> Verified
                  </span>
                </div>
                <div className='text-gray-600 flex items-center mt-1 dark:text-gray-400'>
                  <FiMapPin className='mr-1' /> Mirzapur, UP
                </div>
              </div>
            </div>
            <div className='mt-4 border-t border-gray-200 pt-4 dark:border-gray-700'>
              <div className='flex items-center text-gray-600 dark:text-gray-400'>
                <FiPhone className='mr-2' /> Contact: 07007263566
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
