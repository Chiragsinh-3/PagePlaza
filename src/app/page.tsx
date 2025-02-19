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
      title: "Where to sell old books?",
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
      icon: <Search className='h-8 w-8 text-primary text-white' />,
    },
    {
      step: "Step 2",
      title: "Place the order by making payment",
      description:
        "Then simply place the order by clicking on the 'Buy Now' button.",
      icon: <CreditCard className='h-8 w-8 text-primary text-white' />,
    },
    {
      step: "Step 3",
      title: "Get the books delivered at your doorstep",
      description: "The books will be delivered to you at your doorstep!",
      icon: <Truck className='h-8 w-8 text-primary text-white' />,
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
              variant={"outline"}
              className='group bg-white hover:shadow-lg transition-transform transform hover:scale-105'
            >
              <Link href='/books'>
                <div className='flex items-center gap-2'>
                  <ShoppingBag className='w-6 h-6 text-black' />
                  <span className='text-lg text-black'>Buy Books</span>
                </div>
              </Link>
            </Button>
            <Button
              size='lg'
              className='group bg-black
             text-white shadow-md hover:shadow-lg transition-transform transform hover:scale-[1.02] rounded-md'
            >
              <Link href='/book-sell'>
                <div className='flex items-center gap-2'>
                  <Book className='w-6 h-6 ' />
                  <span className='text-lg'>Sell Books</span>
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <NewBooks />
      <Button
        size='lg'
        className=' flex mt-10 mb-10 mx-auto rounded-xl bg-gradient-to-r from-purple-200 via-pink-300 to-red-200 hover:from-purple-300 hover:via-pink-400 hover:to-red-300 hover:shadow-lg transition-transform transform hover:scale-105'
      >
        <Link href='/books'>
          <div className='flex items-center gap-2'>
            <Library className='w-6 h-6 text-black' />
            <span className='text-lg text-black'>Explore All Books</span>
          </div>
        </Link>
      </Button>

      {/* How to sell Section */}
      <section className='py-20 bg-amber-50 dark:bg-gray-800'>
        <div className='container mx-auto px-4'>
          <div className='  mb-12 '>
            <h2 className='text-3xl font-bold mb-6'>
              How To Sell Your Old Books Using PagePlaza
            </h2>
            <p className='text-lg text-gray-600'>
              Selling your old books is easy and quick with PagePlaza. Follow
              these simple steps to sell your books online.
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8  mt-10'>
            {sellSteps.map((step, index) => (
              <div className='flex flex-col items-center' key={index}>
                <div className='bg-white dark:bg-slate-900 p-4 min-h-60 rounded-lg shadow-md'>
                  <div className='bg-white flex items-center dark:bg-slate-600 p-4 rounded-xl shadow-md'>
                    {step.icon}
                    <h3 className='text-2xl font-semibold ml-4'>{step.step}</h3>
                  </div>
                  <h4 className='text-xl font-semibold mt-5'>{step.title}</h4>
                  <p className='text-gray-600 mt-3'>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to buy Section */}
      <section className='py-20 bg-gradient-to-b from-gray-50 to-white dark:bg-gradient-to-b dark:from-slate-700 dark:to-slate-800'>
        <div className='container mx-auto px-4'>
          <div className='  mb-12 '>
            <h2 className='text-3xl font-bold mb-6'>
              How To Buy Your Old Books Using PagePlaza
            </h2>
            <p className='text-lg text-gray-500'>
              Selling your old books is easy and quick with PagePlaza. Follow
              these simple steps to sell your books online.
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8  mt-10'>
            {buySteps.map((step, index) => (
              <div className='flex flex-col items-center' key={index}>
                <div className='bg-gray-300 dark:bg-slate-900 p-4 min-h-60 rounded-lg shadow-md'>
                  <div className='bg-gray-600 flex text-white items-center dark:bg-slate-600 p-4 rounded-xl shadow-md'>
                    {step.icon}
                    <h3 className='text-2xl font-semibold ml-4'>{step.step}</h3>
                  </div>
                  <h4 className='text-xl font-semibold mt-5'>{step.title}</h4>
                  <p className='text-gray-600 mt-3'>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Read blog */}
      <section className='py-20 bg-gradient-to-b from-blue-100 to-white dark:bg-gradient-to-b dark:from-blue-900/30 dark:to-slate-800'>
        <div className='container mx-auto px-4'>
          <div className='  mb-12 '>
            <h2 className='text-3xl font-bold mb-6'>Read from our Blog</h2>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8  mt-10'>
            {blogPosts.map((post, index) => (
              <div className='flex flex-col items-center ' key={index}>
                <div className='bg-gray-50 dark:bg-slate-900 min-h-[420px] rounded-lg shadow-md overflow-hidden'>
                  <div className='overflow-hidden'>
                    <Image
                      src={post.imageSrc}
                      alt='Blog Image'
                      className='w-full h-60 object-cover rounded-lg hover:scale-105 transition-all'
                      width={400}
                      height={250}
                    />
                  </div>
                  <div className='flex flex-col flex-grow px-8 pt-8'>
                    <div className='flex'>
                      {post.icon}
                      <h4 className='text-xl font-semibold ml-5'>
                        {post.title}
                      </h4>
                    </div>
                    <p className='text-gray-600 text-sm mt-3 flex-grow'>
                      {post.description}
                    </p>
                    <div className='text-center '>
                      <Button variant={"link"} className='mt-4 '>
                        <span className='text-center'>Read More -{">"}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
