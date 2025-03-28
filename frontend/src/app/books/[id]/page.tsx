"use client";
import React, { useState, useEffect, useRef } from "react";
import { books } from "@/lib/BookData";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
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
import {
  useAddToCartMutation,
  useAddToWishlistMutation,
  useProductByIdQuery,
  useWishlistDeleteMutation,
} from "@/store/api";
import { toast } from "sonner";
import BookLoader from "@/lib/BookLoader";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

interface Seller {
  _id: string;
  name: string;
  contact: string;
  addresses?: string[];
  phoneNumber?: string;
}

interface DiscountCalculation {
  price: number;
  finalPrice: number;
}

export default function BookDetail() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const [book, setBook] = useState<(typeof books)[0] | null>(null);
  // const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addToWishlist] = useAddToWishlistMutation();
  const [wishlistDelete] = useWishlistDeleteMutation();
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const { data: productData, isLoading } = useProductByIdQuery(id);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.user.user);
  const userid = user?._id;
  useEffect(() => {
    if (!user) {
      toast.error("Please login to view book");
      router.push("/");
    }
  }, [user, router]);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (imageRef.current) {
      const { left, top, width, height } =
        imageRef.current.getBoundingClientRect();
      // Calculate mouse position relative to the image container (0-100%)
      const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
      setMousePosition({ x, y });
    }
  };

  useEffect(() => {
    if (id) {
      setBook(productData?.data || null);
    }
  }, [id, productData]);

  const handleAddToCart = async () => {
    if (book) {
      await addToCart({ productId: book._id, quantity: quantity })
        .unwrap()
        .then(() => toast.success("Added to cart"))
        .catch((error) => toast.error(error.data.message));
    }
  };

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

  if (user && (book.seller as Seller)._id === userid) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-4'>
            You can't buy your own book
          </h1>
          <Link href='/books'>
            <div className='text-blue-500 hover:underline'>
              Back to all books
            </div>
          </Link>
        </div>
      </div>
    );
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

  const handleFavorites = async () => {
    try {
      if (!book.inWishlist) {
        await addToWishlist({ productId: book._id });
        setBook({ ...book, inWishlist: !book.inWishlist });
        toast.success("Added to favorites");
      } else {
        await wishlistDelete({ productId: book._id });
        setBook({ ...book, inWishlist: !book.inWishlist });
        toast.success("Removed from favorites");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isLoading ? (
        <BookLoader />
      ) : (
        <div>
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
                    ref={imageRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='relative w-full h-[60vh] bg-gray-50/90 flex justify-center rounded-lg overflow-hidden shadow-md mb-4 dark:bg-gray-800 dark:shadow-none'
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    onMouseMove={handleMouseMove}
                  >
                    {calculateDiscount({
                      price: book.price,
                      finalPrice: book.finalprice,
                    }) > 0 && (
                      <div className='absolute top-5 left-0 bg-red-600 text-white px-2 py-1 rounded-r-md z-20'>
                        {calculateDiscount({
                          price: book.price,
                          finalPrice: book.finalprice,
                        })}
                        % off
                      </div>
                    )}

                    {/* Image Container */}
                    <div className='w-full h-full relative overflow-hidden'>
                      <img
                        src={book.images[selectedImage]}
                        alt={book.title}
                        className='h-full w-full object-contain'
                        style={{
                          transform: isHovering ? "scale(1.5)" : "scale(1)",
                          transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                          transition: "transform 0.3s ease-out",
                        }}
                      />
                    </div>

                    {/* Custom cursor indicator */}
                    {isHovering && (
                      <div
                        className='absolute w-5 h-5 pointer-events-none z-10'
                        style={{
                          left: `${mousePosition.x}%`,
                          top: `${mousePosition.y}%`,
                          transform: "translate(-50%, -50%)",
                          backgroundColor: "rgba(256,256,256,0.7)",
                          mixBlendMode: "difference",
                          borderRadius: "50%",
                          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                        }}
                      />
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className='flex space-x-2 overflow-x-auto pb-2'
                  >
                    {book.images.map((img, index) => (
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
                      ₹{book.finalprice}
                    </div>
                    <div className='text-xl text-gray-500 line-through dark:text-gray-400'>
                      ₹{book.price}
                    </div>
                    <div className='text-sm text-green-600 dark:text-green-400'>
                      Shipping Available
                    </div>
                  </div>
                  <div className='flex items-center space-x-4 mb-4'>
                    <span className='text-gray-600 dark:text-gray-400'>
                      Quantity:
                    </span>
                    <div className='flex items-center space-x-2'>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className='w-8 h-8 flex items-center justify-center border rounded-full'
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      >
                        -
                      </motion.button>
                      <motion.div
                        key={quantity}
                        initial={{
                          opacity: 0,
                          scale: 0.5,
                          filter: "blur(5px)",
                        }}
                        animate={{
                          opacity: 1,
                          transition: { delay: 0.1, duration: 0.3 },
                          scale: 1,
                          filter: "blur(0px)",
                        }}
                        className='w-8 text-center font-medium'
                      >
                        {quantity}
                      </motion.div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className='w-8 h-8 flex items-center justify-center border rounded-full'
                        onClick={() => setQuantity((q) => q + 1)}
                      >
                        +
                      </motion.button>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded flex items-center justify-center space-x-2 transition-all'
                    onClick={handleAddToCart}
                  >
                    {/* <FiShoppingCart /> */}
                    {isAddingToCart ? (
                      <div className='flex items-center space-x-2'>
                        <div className='w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin'></div>
                        {/* <span>
                          <Loader  />
                        </span> */}
                      </div>
                    ) : (
                      <div className='flex items-center space-x-2'>
                        <FiShoppingCart />
                        <span>Add to Cart</span>
                      </div>
                    )}
                  </motion.button>

                  <div className='flex space-x-4'>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className='flex items-center space-x-2 text-gray-600 dark:text-gray-400'
                      onClick={async () => {
                        try {
                          await navigator.share({
                            title: book.title,
                            text: book.description,
                            url: window.location.href,
                          });
                        } catch (error) {
                          console.log("Error sharing:", error);
                        }
                      }}
                    >
                      <FiShare2 />
                      <span>Share</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className='flex items-center space-x-2 text-gray-600 dark:text-gray-400'
                      onClick={handleFavorites}
                    >
                      <FiHeart
                        fill={book.inWishlist ? "red" : ""}
                        className={book.inWishlist ? "text-red-500" : ""}
                      />
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

                      <div className='text-gray-600 dark:text-gray-300'>
                        Course
                      </div>
                      <div className='font-medium dark:text-gray-100'>
                        {book.classType}
                      </div>

                      <div className='text-gray-600 dark:text-gray-300'>
                        Category
                      </div>
                      <div className='font-medium dark:text-gray-100'>
                        {book.category}
                      </div>

                      <div className='text-gray-600 dark:text-gray-300'>
                        Author
                      </div>
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
                  {book.description ||
                    "This is math book for class 6th students"}
                </p>
                <hr className='my-6 border-gray-200 dark:border-gray-700' />
                <div>
                  <h3 className='text-lg font-bold mb-4 dark:text-white'>
                    Our Community
                  </h3>
                  <p className='text-gray-700 dark:text-gray-300'>
                    We're not just another shopping website where you buy from
                    professional sellers - we are a vibrant community of
                    students, book lovers across India who deliver happiness to
                    each other!
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
                <h2 className='text-lg font-bold mb-4 dark:text-white'>
                  Sold By
                </h2>
                <div className='flex items-center space-x-4'>
                  <div className='bg-blue-100 rounded-full p-4 dark:bg-blue-900'>
                    <div className='w-12 h-12 flex items-center justify-center text-blue-600 text-2xl dark:text-blue-300'>
                      {book.seller?.name.charAt(0) || "V"}
                    </div>
                  </div>
                  <div>
                    <div className='font-bold flex items-center dark:text-white'>
                      {book.seller?.name}
                      <span className='ml-2 text-green-600 flex items-center text-sm font-normal dark:text-green-400'>
                        <FiCheckCircle className='mr-1' /> Verified
                      </span>
                    </div>
                    <div className='text-gray-600 flex items-center mt-1 dark:text-gray-400'>
                      <FiMapPin className='mr-1' />
                      {book.seller?.addresses?.[0] || "India"}
                    </div>
                  </div>
                </div>
                <div className='mt-4 border-t border-gray-200 pt-4 dark:border-gray-700'>
                  <div className='flex items-center text-gray-600 dark:text-gray-400'>
                    <FiPhone className='mr-2' /> Contact:{" "}
                    {book.seller?.phoneNumber || "Not available"}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
