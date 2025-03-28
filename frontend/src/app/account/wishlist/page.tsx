"use client";
import { useWishlistByUserIdQuery } from "@/store/api";
import { RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import BookLoader from "@/lib/BookLoader";

const WishlistPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const id = user?._id;
  const router = useRouter();
  React.useEffect(() => {
    if (!user) {
      toast.error("Please login to view wishlist");
      router.push("/");
    }
  }, [user, router]);
  const { data: wishlist, isLoading, error } = useWishlistByUserIdQuery(id);

  const wishlistData = wishlist?.data;

  if (isLoading) {
    return (
      <div className='min-h-screen dark:bg-gray-900 flex items-center justify-center'>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className='text-xl dark:text-gray-200'
        >
          <BookLoader />
        </motion.div>
      </div>
    );
  }

  if (error || !wishlistData || !wishlistData.products.length) {
    return (
      <div className='min-h-screen dark:bg-gray-900 flex flex-col items-center justify-center text-center p-4'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className='space-y-4'
        >
          <Heart className='w-24 h-24 mx-auto text-gray-300 dark:text-gray-600' />
          <h2 className='text-2xl font-bold dark:text-gray-200'>
            Your Wishlist is Empty
          </h2>
          <p className='text-gray-500 dark:text-gray-400'>
            Explore our collection and add some items to your wishlist!
          </p>
          <Button
            variant='default'
            className='dark:bg-green-600 dark:hover:bg-green-700'
          >
            Continue Shopping
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='min-h-screen dark:bg-gray-900 py-12 px-4'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='container mx-auto'
      >
        <h1 className='text-3xl font-bold mb-8 text-center dark:text-gray-100'>
          My Wishlist
        </h1>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {wishlistData.products.map((product: any, index: number) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
              }}
            >
              <Link href={`/books/${product._id}`}>
                <Card className='dark:bg-gray-800 dark:border-gray-700 overflow-hidden group'>
                  <div className='relative h-64 w-full'>
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className='object-cover group-hover:scale-110 transition-transform duration-300'
                    />
                  </div>

                  <CardContent className='p-4 pt-5 space-y-3'>
                    <div className='flex justify-between items-center'>
                      <h2 className='text-xl font-semibold dark:text-gray-200 truncate'>
                        {product.title}
                      </h2>
                      <span className='text-lg font-bold dark:text-green-400'>
                        ₹{product.finalprice}
                      </span>
                    </div>

                    <div className='flex items-center justify-between'>
                      <div className='text-sm dark:text-gray-400'>
                        <p>{product.author}</p>
                        <p>{product.category}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default WishlistPage;
