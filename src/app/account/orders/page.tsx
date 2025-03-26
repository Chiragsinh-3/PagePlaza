"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Grid2X2Icon,
  ListIcon,
  PackageIcon,
  IndianRupeeIcon,
} from "lucide-react";
import { useGetOrderByUserQuery, useProductByIdQuery } from "@/store/api";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Link from "next/link";

interface OrderItemProps {
  item: {
    product: string;
    quantity: number;
    _id: string;
  };
  viewMode: "grid" | "list";
}

const OrderItem = ({ item, viewMode }: OrderItemProps) => {
  const { data: productData, isLoading } = useProductByIdQuery(item.product);

  if (isLoading || !productData) {
    return (
      <div className='text-blue-600 dark:text-blue-300 text-sm animate-pulse'>
        Loading product details...
      </div>
    );
  }

  const product = productData.data;
  console.log(product);

  if (viewMode === "grid") {
    return (
      <Link href={`/books/${product._id}`}>
        <div className='bg-gray-50 dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all p-4 flex flex-col items-center text-center'>
          <div className='w-full aspect-square rounded-md overflow-hidden mb-4'>
            <img
              src={product.images[0]}
              alt={product.title}
              className='w-full h-full object-cover'
            />
          </div>
          <h4 className='font-bold text-sm dark:text-white mb-1 line-clamp-2 text-gray-800'>
            {product.title}
          </h4>
          <p className='text-gray-600 dark:text-gray-300 text-xs mb-1'>
            Qty: {item.quantity}
          </p>
          <p className='text-sm font-semibold dark:text-gray-200 flex items-center'>
            <IndianRupeeIcon className='w-4 h-4 mr-1' /> {product.finalprice}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/books/${product._id}`}>
      <div className='flex gap-4 items-center py-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-all px-4'>
        <div className='w-24 h-24 rounded-md overflow-hidden'>
          <img
            src={product.images[0]}
            alt={product.title}
            className='w-full h-full object-cover'
          />
        </div>
        <div className='flex-grow'>
          <h4 className='font-bold dark:text-white line-clamp-2 text-gray-800'>
            {product.title}
          </h4>
          <p className='text-gray-600 dark:text-gray-300 text-sm'>
            By {product.author}
          </p>
          <p className='text-gray-600 dark:text-gray-300 text-sm'>
            Edition: {product.edition}
          </p>
          <div className='flex justify-between items-center mt-2'>
            <p className='text-gray-600 dark:text-gray-300 text-sm'>
              Quantity: {item.quantity}
            </p>
            <p className='text-sm font-semibold dark:text-gray-200 flex items-center'>
              <IndianRupeeIcon className='w-4 h-4 mr-1' /> {product.finalprice}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

interface Order {
  _id: string;
  createdAt: string;
  items: Array<{
    product: string;
    quantity: number;
    _id: string;
  }>;
  totalAmount: number;
  payment_status: string;
  status: string;
}

const OrderCard = ({
  order,
  viewMode,
}: {
  order: Order;
  viewMode: "grid" | "list";
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className='bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6 max-w-4xl mx-auto shadow'
  >
    <div className='mb-4 flex justify-between items-center'>
      <div>
        <h3 className='text-2xl font-bold dark:text-white text-gray-800'>
          Order #{order._id.slice(-6)}
        </h3>
        <p className='text-sm text-gray-600 dark:text-gray-300'>
          Ordered on: {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className='flex items-center gap-2'>
        <PackageIcon className='w-5 h-5 text-blue-600 dark:text-blue-400' />
        <span className='text-sm text-gray-600 dark:text-gray-300 capitalize'>
          {order.status}
        </span>
      </div>
    </div>

    <div
      className={`mb-4 ${
        viewMode === "grid"
          ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          : "space-y-4"
      }`}
    >
      {order.items.map((item: any) => (
        <OrderItem key={item._id} item={item} viewMode={viewMode} />
      ))}
    </div>

    <div className='flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4'>
      <div className='flex items-center gap-2'>
        <IndianRupeeIcon className='w-5 h-5 text-blue-600' />
        <p className='text-lg font-semibold dark:text-white text-gray-800'>
          Total: {order.totalAmount}
        </p>
      </div>
      <p
        className={`text-sm font-medium ${
          order.payment_status === "completed"
            ? "text-green-600 dark:text-green-400"
            : "text-yellow-600 dark:text-yellow-400"
        }`}
      >
        {order.payment_status}
      </p>
    </div>
  </motion.div>
);

const OrdersPage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const user = useSelector((state: RootState) => state.user.user);
  const { data: orders, isLoading } = useGetOrderByUserQuery(user?._id);

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center'>
        <p className='text-blue-600 dark:text-blue-300'>Loading orders...</p>
      </div>
    );
  }

  if (!orders || orders.data.length === 0) {
    return (
      <div className='min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center'>
        <p className='text-blue-600 dark:text-blue-300 text-lg'>
          You have not placed any orders yet.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='min-h-screen bg-white dark:bg-gray-900 py-8 transition-colors'
    >
      <div className='max-w-6xl mx-auto px-4'>
        <div className='flex justify-between items-center mb-8'>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='text-3xl font-bold dark:text-white text-gray-800'
          >
            Your Orders
          </motion.h1>
          <button
            onClick={toggleViewMode}
            className='flex items-center gap-2 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-4 py-2 rounded-lg shadow hover:bg-blue-200 dark:hover:bg-blue-700 transition-all'
          >
            {viewMode === "grid" ? (
              <>
                <ListIcon className='w-5 h-5' />
                <span>List View</span>
              </>
            ) : (
              <>
                <Grid2X2Icon className='w-5 h-5' />
                <span>Grid View</span>
              </>
            )}
          </button>
        </div>
        {orders.data.map((order: Order) => (
          <OrderCard key={order._id} order={order} viewMode={viewMode} />
        ))}
      </div>
    </motion.div>
  );
};

export default OrdersPage;
