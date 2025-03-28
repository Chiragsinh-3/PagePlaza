"use client";
import { useGetOrderByOrderIdQuery } from "@/store/api";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingCart, MapPin, CreditCard } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import BookLoader from "@/lib/BookLoader";

const OrderConfirmationPage = () => {
  const params = useParams();
  const id = params.id as string;
  const { data: orderData, isLoading, error } = useGetOrderByOrderIdQuery(id);
  const user = useSelector((state: RootState) => state.user.user);

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      toast.error("You are not the user of this order");
      router.push("/");
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen dark:bg-gray-900'>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className='text-xl dark:text-gray-200'
        >
          <BookLoader />
        </motion.div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className='flex justify-center items-center min-h-screen dark:bg-gray-900'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-xl text-red-500 dark:text-red-400'
        >
          Error loading order details
        </motion.div>
      </div>
    );
  }

  const order = orderData;

  return (
    <div className='min-h-screen dark:bg-gray-900 flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-4xl'
      >
        <Card className='dark:bg-gray-800 dark:border-gray-700 shadow-xl'>
          <CardHeader className='dark:bg-gray-900/50 text-center border-b dark:border-gray-700'>
            <div className='flex flex-col items-center space-y-4'>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <CheckCircle2 className='text-green-600 dark:text-green-400 w-16 h-16' />
              </motion.div>
              <CardTitle className='text-3xl font-bold dark:text-gray-100'>
                Order Confirmed
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className='p-6 space-y-6'>
            <div className='grid md:grid-cols-2 gap-6'>
              {/* Order Details */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className='space-y-4 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg'
              >
                <div className='flex items-center space-x-2'>
                  <CreditCard className='w-5 h-5 dark:text-gray-300' />
                  <h3 className='font-semibold text-lg dark:text-gray-200'>
                    Order Details
                  </h3>
                </div>
                <div className='space-y-2 dark:text-gray-300'>
                  <p>
                    <strong>Order ID:</strong> {id}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> ₹{order.totalAmount}
                  </p>
                  <p>
                    <strong>Payment Method:</strong> {order.payment_method}
                  </p>
                  <p>
                    <strong>Payment Status:</strong> {order.payment_status}
                  </p>
                </div>
              </motion.div>

              {/* Customer Information */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className='space-y-4 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg'
              >
                <div className='flex items-center space-x-2'>
                  <ShoppingCart className='w-5 h-5 dark:text-gray-300' />
                  <h3 className='font-semibold text-lg dark:text-gray-200'>
                    Customer Information
                  </h3>
                </div>
                <div className='space-y-2 dark:text-gray-300'>
                  <p>
                    <strong>Name:</strong> {order.data.user.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {order.data.user.email}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {order.data.shippingAddress.phoneNumber}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className='space-y-4 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg'
            >
              <div className='flex items-center space-x-2'>
                <MapPin className='w-5 h-5 dark:text-gray-300' />
                <h3 className='font-semibold text-lg dark:text-gray-200'>
                  Shipping Address
                </h3>
              </div>
              <div className='dark:text-gray-300'>
                <p>{order.data.shippingAddress.addressLine1}</p>
                <p>{order.data.shippingAddress.addressLine2}</p>
                <p>
                  <strong>City:</strong> {order.data.shippingAddress.city}
                </p>
                <p>
                  <strong>State:</strong> {order.data.shippingAddress.state}
                </p>
                <p>
                  <strong>Pincode:</strong> {order.data.shippingAddress.pincode}
                </p>
              </div>
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className='space-y-4'
            >
              <h3 className='font-semibold text-lg dark:text-gray-200'>
                Order Items
              </h3>
              <div className='space-y-2'>
                {order.data.items.map((item: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className='bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg flex justify-between items-center'
                  >
                    <div className='dark:text-gray-300'>
                      <p className='font-semibold'>{item.product.title}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ₹{item.product.finalprice}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Continue Shopping Button */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className='mt-6'
            >
              <Link href='/books'>
                <Button
                  variant='default'
                  className='w-full dark:bg-green-600 dark:hover:bg-green-700 dark:text-white'
                >
                  Continue Shopping
                </Button>
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OrderConfirmationPage;
