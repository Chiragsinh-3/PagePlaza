"use client";
import { Button } from "@/components/ui/button";
import {
  Book,
  BookOpen,
  Camera,
  CreditCard,
  Library,
  Search,
  ShoppingBag,
  Store,
  Tag,
  Truck,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import NewBooks from "./components/NewBooks";

export default function Home() {
  const bannerImages = [
    "/images/book1.jpg",
    "/images/book2.jpg",
    "/images/book3.jpg",
  ];

  const blogPosts = [
    {
      imageSrc:
        "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8b25saW5lJTIwc2VsbCUyMGJvb2tzfGVufDB8fDB8fHww",
      title: "Where and how to sell old books online?",
      description:
        "Get started with selling your used books online and earn money from your old books.",
      icon: <BookOpen className='w-6 h-6 text-primary' />,
    },
    {
      imageSrc:
        "https://media.istockphoto.com/id/910384920/photo/kid-reading-near-locked-door.webp?a=1&b=1&s=612x612&w=0&k=20&c=J3FL4ZVORItw_bkLzlVo4WO-xUy22S7Qqbuq2xusNnc=",
      title: "What to do with old books?",
      description:
        "Learn about different ways to make use of your old books and get value from them.",
      icon: <Library className='w-6 h-6 text-primary' />,
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1492539438225-2666b2a98f93?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG9sZCUyMCUyMGJvb2tzfGVufDB8fDB8fHww",
      title: "What is BookKart?",
      description:
        "Discover how BookKart helps you buy and sell used books online easily.",
      icon: <Store className='w-6 h-6 text-primary' />,
    },
  ];

  const sellSteps = [
    {
      step: "Step 1",
      title: "Post an ad for selling used books",
      description:
        "Post an ad on BookKart describing your book details to sell your old books online.",
      icon: <Camera className='h-8 w-8 text-primary' />,
    },
    {
      step: "Step 2",
      title: "Set the selling price for your books",
      description:
        "Set the price for your books at which you want to sell them.",
      icon: <Tag className='h-8 w-8 text-primary' />,
    },
    {
      step: "Step 3",
      title: "Get paid into your UPI/Bank account",
      description:
        "You will get money into your account once you receive an order for your book.",
      icon: <Wallet className='h-8 w-8 text-primary' />,
    },
  ];

  const buySteps = [
    {
      step: "Step 1",
      title: "Select the used books you want",
      description:
        "Search from over thousands of used books listed on BookKart.",
      icon: <Search className='h-8 w-8 text-primary' />,
    },
    {
      step: "Step 2",
      title: "Place the order by making payment",
      description:
        "Then simply place the order by clicking on the 'Buy Now' button.",
      icon: <CreditCard className='h-8 w-8 text-primary' />,
    },
    {
      step: "Step 3",
      title: "Get the books delivered at your doorstep",
      description: "The books will be delivered to you at your doorstep!",
      icon: <Truck className='h-8 w-8 text-primary' />,
    },
  ];
  const [currentImagge, setCurrentImage] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((currentImagge) =>
        currentImagge === bannerImages.length - 1 ? 0 : currentImagge + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <main className='min-h-screen'>
      <section className='relative h-[700px] overflow-hidden'>
        {bannerImages.map((image, index) => (
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentImagge === index ? "opacity-100" : "opacity-0"
            } `}
            key={index}
          >
            <Image
              src={image}
              alt='Banner'
              priority={index === 0}
              className='object-cover'
              fill
            />
            <div className='absolute inset-0 bg-black/50' />
          </div>
        ))}
        <div className='relative inset-0 h-full text-white flex flex-col items-center justify-center text-center'>
          <p className='text-4xl md:text-6xl font-bold mb-8 '>
            Your one-stop platform for buying and selling used books.
          </p>
          <div className='flex flex-col md:flex-row gap-4 mt-8 '>
            <Button
              size='lg'
              className='group bg-gradient-to-r from-purple-200 via-pink-300 to-red-200 hover:from-purple-300 hover:via-pink-400 hover:to-red-300 hover:shadow-lg transition-transform transform hover:scale-105'
            >
              <Link href='/books'>
                <div className='flex items-center gap-2'>
                  <ShoppingBag className='w-6 h-6 ' />
                  <span className='text-lg '>Buy Books</span>
                </div>
              </Link>
            </Button>
            <Button
              size='lg'
              className='group bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-500 
             hover:from-blue-600 hover:via-indigo-700 hover:to-blue-600 
             text-white shadow-md hover:shadow-lg transition-transform transform hover:scale-[1.02] rounded-md'
            >
              <Link href='/book-sell'>
                <div className='flex items-center gap-2'>
                  <Book className='w-6 h-6 ' />
                  <span className='text-lg '>Sell Books</span>
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <NewBooks />
      <Button
        size='lg'
        className='group bg-gradient-to-r from-purple-200 via-pink-300 to-red-200 hover:from-purple-300 hover:via-pink-400 hover:to-red-300 hover:shadow-lg transition-transform transform hover:scale-105'
      >
        <Link href='/books'>
          <div className='flex items-center gap-2'>
            <Library className='w-6 h-6 ' />
            <span className='text-lg '>Explore All Books</span>
          </div>
        </Link>
      </Button>
    </main>
  );
}
