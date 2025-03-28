"use client";
import React, { useEffect, useState } from "react";
import { useProductBySellerIdQuery } from "@/store/api";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp, LayoutGrid, List } from "lucide-react";
import BookLoader from "@/lib/BookLoader";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Define Product interface based on the data structure
interface Product {
  _id: string;
  title: string;
  author?: string;
  category: string;
  classType?: string;
  condition: string;
  description: string;
  edition?: string;
  finalprice: number;
  price: number;
  images: string[];
  paymentMode: string;
  seller: {
    _id: string;
    name: string;
    email: string;
    profilePicture: string | null;
  };
  inWishlist: boolean;
}

type ViewMode = "list" | "grid";

const ProductsPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      toast.error("Please login to view your book");
      router.push("/");
    }
  }, [user, router]);
  const sellerId = user?._id;
  const {
    data: products,
    error,
    isLoading,
  } = useProductBySellerIdQuery(sellerId);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedProductId, setExpandedProductId] = useState<string | null>(
    null
  );
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
    },
  };

  const listItemVariants = {
    hidden: { y: 0, opacity: 0.5, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { ease: "easeOut" },
    },
  };

  const gridItemVariants = {
    hidden: { scale: 0.8, opacity: 0.5 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { ease: "easeOut" },
    },
  };

  if (error) {
    if ("data" in error) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='min-h-screen flex items-center justify-center text-red-500 dark:text-red-400 text-xl dark:bg-gray-900'
        >
          {(error.data as { message: string }).message}
        </motion.div>
      );
    }
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='min-h-screen flex items-center justify-center text-red-500 dark:text-red-400 text-xl dark:bg-gray-900'
      >
        An error occurred while fetching your products
      </motion.div>
    );
  }

  const productList = products?.data || [];

  if (productList.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='min-h-screen flex flex-col items-center justify-center p-4 dark:bg-gray-900'
      >
        <h1 className='text-2xl font-bold mb-4 dark:text-white'>My Products</h1>
        <div className='text-gray-500 dark:text-gray-400 text-xl'>
          You haven't listed any products yet.
        </div>
      </motion.div>
    );
  }

  // Get unique categories for filter
  const categories = Array.from(
    new Set(productList.map((product: Product) => product.category))
  ) as string[];

  // Filter and search products
  const filteredProducts = productList.filter((product: Product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.author &&
        product.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory
      ? product.category === filterCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  const toggleProductDetails = (productId: string) => {
    if (expandedProductId === productId) {
      setExpandedProductId(null);
    } else {
      setExpandedProductId(productId);
    }
  };

  return isLoading ? (
    <BookLoader />
  ) : (
    <div className='container mx-auto px-4 py-4 sm:py-6 dark:bg-black min-h-screen'>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-2xl md:text-3xl font-bold mb-4 dark:text-white'
      >
        My Products
      </motion.h1>

      {/* Search, filter, and view toggle bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='flex flex-col justify-between md:flex-row gap-2 mb-4'
      >
        <div className='relative '>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
          <input
            type='text'
            placeholder='Search products...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[rgba(28,18,43,0.95)] dark:text-white text-sm'
          />
        </div>

        <div className='flex  gap-2'>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className='py-2 px-4 w-[300px] min-w-[200px] rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[rgba(28,18,43,0.95)] dark:text-white text-sm sm:w-full'
          >
            <option value=''>All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* View toggle */}
          <div className='flex flex-row w-fit  rounded-lg  border border-gray-300 dark:border-gray-700 '>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 min-w-[48px]  ${
                viewMode === "list"
                  ? "bg-blue-500 text-white dark:bg-blue-600"
                  : "bg-white dark:bg-[rgba(28,18,43,0.95)] text-gray-700 dark:text-gray-300"
              } flex justify-center rounded-lg`}
              aria-label='List view'
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 min-w-[48px] flex justify-center ${
                viewMode === "grid"
                  ? "bg-blue-500 text-white dark:bg-blue-600"
                  : "bg-white dark:bg-[rgba(28,18,43,0.95)] text-gray-700 dark:text-gray-300"
              } rounded-lg`}
              aria-label='Grid view'
            >
              <LayoutGrid size={20} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Product count */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className='mb-4 text-sm text-gray-500 dark:text-gray-400'
      >
        Showing {filteredProducts.length} of {productList.length} products
      </motion.p>

      {/* List View */}
      {viewMode === "list" && (
        <motion.div
          key='list-view'
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='space-y-3'
        >
          {filteredProducts.map((product: Product) => (
            <motion.div
              key={product._id}
              variants={listItemVariants}
              className='bg-white dark:bg-[rgba(28,18,43,0.95)] rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300'
            >
              <div
                className='flex items-center p-3 cursor-pointer'
                onClick={() => toggleProductDetails(product._id)}
              >
                <div className='relative h-20 w-20 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0'>
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className='object-cover'
                    />
                  ) : (
                    <div className='absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs'>
                      No image
                    </div>
                  )}
                </div>

                <div className='ml-4 flex-grow'>
                  <h2 className='text-base font-medium line-clamp-1 dark:text-white'>
                    {product.title}
                  </h2>
                  {product.author && (
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      by {product.author}
                    </p>
                  )}
                  <div className='flex justify-between items-center mt-2'>
                    <span className='text-lg font-bold text-blue-600 dark:text-blue-400'>
                      ₹{product.finalprice}
                    </span>
                    <span className='text-sm px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full'>
                      {product.condition}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleProductDetails(product._id);
                  }}
                  className='ml-2 flex-shrink-0 text-gray-500 dark:text-gray-400'
                >
                  {expandedProductId === product._id ? (
                    <ChevronUp size={24} />
                  ) : (
                    <ChevronDown size={24} />
                  )}
                </button>
              </div>

              <AnimatePresence>
                {expandedProductId === product._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className='border-t border-gray-200 dark:border-gray-700 px-4 py-3 overflow-hidden'
                  >
                    <div className='text-sm text-gray-600 dark:text-gray-400 mb-2'>
                      <p>Category: {product.category}</p>
                      {product.classType && <p>Class: {product.classType}</p>}
                      {product.edition && <p>Edition: {product.edition}</p>}
                    </div>

                    <p className='text-sm text-gray-700 dark:text-gray-300 mb-3'>
                      {product.description}
                    </p>

                    <div className='flex justify-between items-center'>
                      <span className='text-sm text-gray-500 dark:text-gray-400'>
                        Payment: {product.paymentMode}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-sm rounded'
                      >
                        Edit
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <motion.div
          key='grid-view'
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
        >
          {filteredProducts.map((product: Product) => (
            <motion.div
              key={product._id}
              variants={gridItemVariants}
              className='bg-white dark:bg-[rgba(28,18,43,0.95)] rounded-lg shadow overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col'
            >
              <div className='relative h-40 w-full bg-gray-200 dark:bg-gray-700'>
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className='object-cover'
                  />
                ) : (
                  <div className='absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500'>
                    No image
                  </div>
                )}
                <div className='absolute top-0 right-0 m-2'>
                  <span className='text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full'>
                    {product.condition}
                  </span>
                </div>
              </div>

              <div className='p-3 flex-grow flex flex-col'>
                <h2 className='text-sm font-medium line-clamp-1 dark:text-white mb-1'>
                  {product.title}
                </h2>
                {product.author && (
                  <p className='text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mb-1'>
                    by {product.author}
                  </p>
                )}
                <div className='mt-auto pt-2'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm font-bold text-blue-600 dark:text-blue-400'>
                      ₹{product.finalprice}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className='px-2 py-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs rounded'
                    >
                      Edit
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ProductsPage;
