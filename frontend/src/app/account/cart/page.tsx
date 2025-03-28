"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  useCartByUserIdQuery,
  useCartDeleteMutation,
  useCreateOrUpdateOrderMutation,
} from "@/store/api";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Addresses from "@/app/components/Addresses";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const CartPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const id = user?._id;
  const router = useRouter();
  if (!user) {
    toast.error("Please login view details of this book");
    router.push("/");
  }
  const { data: cartData, refetch: getCartData } = useCartByUserIdQuery(id);
  const [removeFromCartApi] = useCartDeleteMutation();
  const [createOrUpdateOrderApi] = useCreateOrUpdateOrderMutation();
  const [isCheckOutClicked, setIsCheckOutClicked] = useState<boolean>(false);
  useEffect(() => {
    getCartData();
  }, []);

  const removeFromCart = async (itemId: any, event: React.MouseEvent) => {
    event.preventDefault();
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
      (acc: any, item: any) => acc + item.product.finalprice * item.quantity,
      0
    )
    .toFixed(2);
  const handleCheckout = () => {
    setIsCheckOutClicked(true);
  };

  const calculateTotalAmount = () => {
    if (!cartData?.data?.cart?.items) return 0;
    return cartData.data.cart.items.reduce(
      (total: number, item: any) =>
        total + item.product.finalprice * item.quantity,
      0
    );
  };

  return (
    <div className='min-h-screen bg-linear-to-b from-violet-500 to-fuchsia-500 py-12 px-4 sm:px-6 lg:px-8'>
      <Addresses
        isCheckOutClicked={isCheckOutClicked}
        changeCheckOutClicked={setIsCheckOutClicked}
        amount={calculateTotalAmount()}
        cartItems={cartItems}
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
          className='text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center'
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
            <Link href='/books' className='mt-6'>
              <motion.button
                whileHover={buttonHover.hover}
                whileTap={buttonHover.tap}
                className='bg-white-600 hover:bg-stone-300 dark:bg-black dark:hover:bg-gray-700 text-gray-900 dark:text-white py-3 px-6 rounded-xl shadow-md   transition-colors font-medium'
              >
                Browse Products
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className='w-full flex lg:flex-row flex-col gap-8'>
            <motion.div
              layout
              initial='hidden'
              animate='visible'
              variants={container}
              className='flex-grow  bg-gradient-to-b from-[rgb(252,247,255)]  to-white dark:bg-gradient-to-b dark:from-[rgb(28,18,43)] dark:via-[rgb(10,6,15)] dark:to-black rounded '
            >
              {cartItems.map((cartItem: any, index: number) => (
                <Link
                  href={`/books/${cartItem.product._id}`}
                  key={cartItem._id}
                >
                  <motion.div
                    key={cartItem._id}
                    layout
                    variants={item}
                    className='group '
                  >
                    <div className='flex items-center py-6 transition-colors duration-300  px-4 '>
                      <div className='relative min-w-24 h-24 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700'>
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
                            <span className='text-gray-900 dark:text-white font-medium text-lg'>
                              ₹{cartItem.product.finalprice}
                            </span>
                            <span className='text-gray-900 dark:text-white/30 line-through font-medium text-xs'>
                              ₹{cartItem.product.price}
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
                        onClick={(e) => removeFromCart(cartItem.product._id, e)}
                        className=' text-red-500 hover:bg-red-100 dark:hover:bg-red-900 max-w-7'
                      >
                        <Trash2 className='w-5 h-5' />
                      </Button>
                    </div>
                    {index !== cartItems.length - 1 && (
                      <div className='border-t border-gray-200 dark:border-gray-700' />
                    )}
                  </motion.div>
                </Link>
              ))}
            </motion.div>

            <div className='lg:w-1/3'>
              <div className=' bg-gradient-to-b from-[rgb(252,247,255)]  to-white dark:bg-gradient-to-b dark:from-[rgb(28,18,43)] dark:to-black rounded-lg shadow-md p-6 sticky top-28'>
                <div className='mb-6'>
                  <h3 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
                    Order Summary
                  </h3>
                </div>
                <div className='space-y-4 mb-6'>
                  <div className='flex justify-between text-gray-600 dark:text-gray-400'>
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
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
                      <span className='text-2xl font-bold text-black dark:text-white'>
                        ₹{totalPrice}
                      </span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileTap={buttonHover.tap}
                  onClick={handleCheckout}
                  className='w-full bg-white-600 hover:bg-[rgb(242,237,245)] dark:bg-[rgb(28,18,43)] dark:hover:bg-[rgb(48,31,73)] text-gray-900 dark:text-white py-3 px-4 rounded-xl shadow-md transition-colors font-medium text-lg'
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
