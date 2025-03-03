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
      icon: <Search className='h-8 w-8 text-primary' />,
    },
    {
      step: "Step 2",
      title: "Place the order by making payment",
      description:
        "Then simply place the order by clicking on the 'Buy Now' button.",
      icon: <CreditCard className='h-8 w-8 text-primary ' />,
    },
    {
      step: "Step 3",
      title: "Get the books delivered at your doorstep",
      description: "The books will be delivered to you at your doorstep!",
      icon: <Truck className='h-8 w-8 text-primary ' />,
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
            <div className='absolute inset-0 bg-black/40 dark:bg-black/70' />
          </div>
        ))}
        <div className='relative inset-0 h-full text-white flex flex-col items-center justify-center text-center'>
          <p className='text-4xl md:text-5xl font-bold mb-8 '>
            Your one-stop platform for buying and selling used books.
          </p>
          <div className='flex flex-col md:flex-row gap-4 mt-8 '>
            <Button
              size='lg'
              variant={"outline"}
              className='group border-none  shadow-md  bg-white text-black hover:shadow-lg transition-transform transform hover:scale-105'
            >
              <Link href='/books'>
                <div className='flex items-center gap-2 '>
                  <ShoppingBag className='w-6 h-6 ' />
                  <span className='text-lg '>Buy Books</span>
                </div>
              </Link>
            </Button>
            <Button
              size='lg'
              variant={"ghost"}
              className='group bg-black
             text-white shadow-md hover:shadow-lg transition-transform transform hover:scale-105 rounded-md'
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

      {/* How to Sell Section */}
      <section className='py-16 bg-gradient-to-r from-amber-50 to-amber-100 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 cursor-default'>
        <div className='container mx-auto px-6 max-w-5xl'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4 relative inline-block'>
              <span className='relative z-10'>How To Sell Your Books</span>
              <span className='absolute -bottom-2 left-0 w-full h-2 bg-amber-300 dark:bg-amber-600 opacity-40 rounded-lg'></span>
            </h2>
            <p className='text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto'>
              Turn your unused books into cash with our simple three-step
              process.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {sellSteps.map((step, index) => (
              <div
                key={index}
                className='group transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl'
              >
                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden h-full flex flex-col'>
                  <div className='p-6 flex-grow'>
                    <div className='flex items-center mb-6'>
                      <div className='text-amber-500 dark:text-amber-400'>
                        {step.icon}
                      </div>
                      <span className='ml-3 text-sm font-medium text-gray-500 dark:text-gray-400'>
                        Step {index + 1}
                      </span>
                    </div>

                    <h3 className='text-xl font-bold mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors'>
                      {step.title}
                    </h3>

                    <p className='text-gray-600 dark:text-gray-300'>
                      {step.description}
                    </p>
                  </div>

                  <div className='bg-amber-50 dark:bg-gray-700 px-6 py-4 group-hover:bg-amber-100 dark:group-hover:bg-gray-600 transition-colors'>
                    <button className='text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center'>
                      Learn more
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4 ml-1 transition-transform group-hover:translate-x-1'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M14 5l7 7m0 0l-7 7m7-7H3'
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Buy Section */}
      <section className='py-16 bg-white dark:bg-gray-900 cursor-default'>
        <div className='container mx-auto px-6 max-w-5xl'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4 relative inline-block'>
              <span className='relative z-10'>How To Buy Books</span>
              <span className='absolute -bottom-2 left-0 w-full h-2 bg-blue-300 dark:bg-blue-600 opacity-40 rounded-lg'></span>
            </h2>
            <p className='text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto'>
              Find your next great read at unbeatable prices with these simple
              steps.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {buySteps.map((step, index) => (
              <div
                key={index}
                className='group transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl'
              >
                <div className='bg-blue-50 dark:bg-gray-800 rounded-xl shadow-md overflow-hidden h-full flex flex-col'>
                  <div className='p-6 flex-grow'>
                    <div className='flex items-center mb-6'>
                      <div className='text-blue-500 dark:text-blue-400'>
                        {step.icon}
                      </div>
                      <span className='ml-3 text-sm font-medium text-gray-500 dark:text-gray-400'>
                        Step {index + 1}
                      </span>
                    </div>

                    <h3 className='text-xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                      {step.title}
                    </h3>

                    <p className='text-gray-600 dark:text-gray-300'>
                      {step.description}
                    </p>
                  </div>

                  <div className='bg-blue-100 dark:bg-gray-700 px-6 py-4 group-hover:bg-blue-200 dark:group-hover:bg-gray-600 transition-colors'>
                    <button className='text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center'>
                      Learn more
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4 ml-1 transition-transform group-hover:translate-x-1'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M14 5l7 7m0 0l-7 7m7-7H3'
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Read blog */}
      <section className='py-20 bg-gradient-to-b from-blue-100 to-white dark:bg-gradient-to-b dark:from-zinc-900/50 dark:to-black'>
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
