"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCartByUserIdQuery, useCartDeleteMutation } from "@/store/api";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Addresses from "@/app/components/Addresses";

const CartPage = () => {
  // Mock data for development/preview
  const mockCartData = {
    data: {
      items: [
        {
          _id: "1",
          product: {
            images: [
              "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop",
            ],
            price: 29.99,
            description: "The Art of Programming: A Comprehensive Guide",
            title: "Programming Book",
          },
          quantity: 2,
        },
        {
          _id: "2",
          product: {
            images: [
              "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1000&auto=format&fit=crop",
            ],
            price: 19.99,
            description: "Web Development Fundamentals",
            title: "Web Dev Book",
          },
          quantity: 1,
        },
      ],
    },
  };
  const user = useSelector((state: RootState) => state.user.user);

  const id = user._id;
  const { data: cartData = mockCartData, refetch: getCartData } =
    useCartByUserIdQuery(id);
  const [removeFromCartApi] = useCartDeleteMutation();
  const [isCheckOutClicked, setIsCheckOutClicked] = useState<boolean>(false);
  useEffect(() => {
    getCartData();
  }, []);

  const removeFromCart = async (itemId: any) => {
    try {
      await removeFromCartApi({ productId: itemId, userId: id }).unwrap();
      getCartData(); // Refresh cart after removal
    } catch (error) {
      console.log("Error removing item:", error);
    }
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };
  const buttonHover = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  const cartItems = cartData?.data?.cart?.items || [];
  const totalPrice = cartItems
    .reduce(
      (acc: any, item: any) => acc + item.product.price * item.quantity,
      0
    )
    .toFixed(2);
  const handleCheckout = () => {
    setIsCheckOutClicked(true);
  };
  return (
    <div className='min-h-screen  bg-slate-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8'>
      <Addresses
        isCheckOutClicked={isCheckOutClicked}
        changeCheckOutClicked={setIsCheckOutClicked}
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='container mx-auto'
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-8 text-center'
        >
          Your Shopping Cart
        </motion.h1>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-center py-12 '
          >
            <ShoppingCart className='w-16 h-16 mx-auto mb-4 text-gray-500 dark:text-gray-400' />
            <p className='text-gray-600 dark:text-gray-300 text-lg'>
              Your cart is empty.
            </p>
            <Button asChild className='mt-6'>
              <motion.button
                whileHover={buttonHover.hover}
                whileTap={buttonHover.tap}
                className='bg-indigo-600 text-white py-3 px-6 rounded-xl shadow-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors font-medium'
              >
                Browse Products
              </motion.button>
            </Button>
          </motion.div>
        ) : (
          <div className='w-full flex lg:flex-row flex-col gap-8'>
            <motion.div
              layout
              initial='hidden'
              animate='visible'
              variants={container}
              className='flex-grow'
            >
              {cartItems.map((cartItem: any, index: number) => (
                <motion.div
                  key={cartItem._id}
                  layout
                  variants={item}
                  className='group bg-white dark:bg-gray-800 rounded-lg shadow-md'
                >
                  <div className='flex items-center py-6 transition-colors duration-300  px-4 '>
                    <div className='relative w-24 h-24 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700'>
                      <Image
                        src={cartItem.product.images[0]}
                        alt={cartItem.product.title}
                        fill
                        sizes='96px'
                        className='object-cover'
                      />
                    </div>
                    <div className='ml-6 flex-grow'>
                      <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                        {cartItem.product.title}
                      </h2>
                      <p className='text-gray-600 dark:text-gray-400 text-sm line-clamp-2'>
                        {cartItem.product.description}
                      </p>
                      <div className='flex items-center justify-between mt-4'>
                        <div className='flex items-center space-x-2'>
                          <span className='text-indigo-600 dark:text-indigo-400 font-medium text-lg'>
                            ${cartItem.product.finalprice}
                          </span>
                          <span className='text-indigo-600/50 dark:text-indigo-400/30 line-through font-medium text-xs'>
                            ${cartItem.product.price}
                          </span>
                        </div>
                        <span className='text-gray-600 dark:text-gray-400 text-sm'>
                          Qty: {cartItem.quantity}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => removeFromCart(cartItem.product._id)}
                      className='ml-4 text-red-500 hover:bg-red-100 dark:hover:bg-red-900'
                    >
                      <Trash2 className='w-5 h-5' />
                    </Button>
                  </div>
                  {index !== cartItems.length - 1 && (
                    <div className='border-t border-gray-200 dark:border-gray-700' />
                  )}
                </motion.div>
              ))}
            </motion.div>

            <div className='lg:w-1/3'>
              <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-28'>
                <div className='mb-6'>
                  <h3 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
                    Order Summary
                  </h3>
                </div>
                <div className='space-y-4 mb-6'>
                  <div className='flex justify-between text-gray-600 dark:text-gray-400'>
                    <span>Subtotal</span>
                    <span>${totalPrice}</span>
                  </div>
                  <div className='flex justify-between text-gray-600 dark:text-gray-400'>
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className='border-t border-gray-200 dark:border-gray-700 pt-4 mt-4'>
                    <div className='flex justify-between items-center'>
                      <span className='text-lg font-semibold text-gray-900 dark:text-white'>
                        Total
                      </span>
                      <span className='text-2xl font-bold text-indigo-600 dark:text-indigo-400'>
                        ${totalPrice}
                      </span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileTap={buttonHover.tap}
                  onClick={handleCheckout}
                  className='w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors font-medium text-lg shadow-md'
                >
                  Proceed to Checkout
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CartPage;
