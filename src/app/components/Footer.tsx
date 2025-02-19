import {
  Clock,
  Facebook,
  Headphones,
  Instagram,
  Shield,
  Twitter,
  Youtube,
} from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className='bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-sans'>
      <div className='container mx-auto px-4 py-12'>
        {/* top  */}
        <div className='grid gap-12 md:grid-cols-4 mb-3 px-8'>
          {/* footer about us */}
          <div className='ml-4'>
            <h2 className='text-xl font-extrabold'>About Us</h2>
            <div className='flex flex-col gap-2'>
              <p className='mt-4 text-lg'>
                <a
                  href='#'
                  className='text-slate-600 dark:text-gray-200 hover:text-black hover:dark:text-white'
                >
                  About Us
                </a>
              </p>
              <p className=''>
                <a
                  href='#'
                  className='text-slate-600 dark:text-gray-200 hover:text-black hover:dark:text-white'
                >
                  Contact Us
                </a>
              </p>
            </div>
          </div>
          {/* Useful Links */}
          <div className='ml-4'>
            <h2 className='text-xl font-extrabold'>Useful Links</h2>
            <div className='flex flex-col gap-2'>
              <p className='mt-4 text-lg'>
                <a
                  href='#'
                  className='text-slate-600 dark:text-gray-200 hover:text-black hover:dark:text-white'
                >
                  Home
                </a>
              </p>
              <p className=''>
                <a
                  href='#'
                  className='text-slate-600 dark:text-gray-200 hover:text-black hover:dark:text-white'
                >
                  Services
                </a>
              </p>
            </div>
          </div>
          {/* Policies */}
          <div className='ml-4'>
            <h2 className='text-xl font-extrabold'>Policies</h2>
            <div className='flex flex-col gap-2'>
              <p className='mt-4 text-lg'>
                <a
                  href='#'
                  className='text-slate-600 dark:text-gray-200 hover:text-black hover:dark:text-white'
                >
                  Privacy Policy
                </a>
              </p>
              <p className=''>
                <a
                  href='#'
                  className='text-slate-600 dark:text-gray-200 hover:text-black hover:dark:text-white'
                >
                  Terms of Service
                </a>
              </p>
            </div>
          </div>
          {/* Stay Connected */}
          <div className='ml-4'>
            <h2 className='text-xl font-bold'>Stay Connected</h2>
            <div className='flex gap-4 mt-4'>
              <a
                href='#'
                className='text-slate-600 dark:text-gray-200 hover:text-black hover:dark:text-white'
              >
                <Facebook />
              </a>
              <a
                href='#'
                className='text-slate-600 dark:text-gray-200 hover:text-black hover:dark:text-white'
              >
                <Instagram />
              </a>
              <a
                href='#'
                className='text-slate-600 dark:text-gray-200 hover:text-black hover:dark:text-white'
              >
                <Twitter />
              </a>
              <a
                href='#'
                className='text-slate-600 dark:text-gray-200 hover:text-black hover:dark:text-white'
              >
                <Youtube />
              </a>
            </div>
            <p className='mt-2'>
              BookKart is a free platform where you can buy second hand books at
              very cheap prices. Buy used books online like college books,
              school books, much more near you.
            </p>
          </div>
        </div>
        {/* Middle */}
        <section className='py-6'>
          <div className='container mx-auto px-4'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <div className='flex items-center gap-4 rounded-xl  p-6 shadow-sm'>
                <Shield />
                <div className='ml-4'>
                  <h2 className='text-lg font-medium-'>Secure Payment</h2>
                  <p className='text-sm text-gray-600 dark:text-gray-400 '>
                    100% Secure Online Transaction
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-4 rounded-xl  p-6 shadow-sm'>
                <Clock />
                <div className='ml-4'>
                  <h2 className='text-lg font-medium-'>BookKart Trust</h2>
                  <p className='text-sm text-gray-600 dark:text-gray-400 '>
                    Money transferred safely after confirmation
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-4 rounded-xl  p-6 shadow-sm'>
                <Headphones />
                <div className='ml-4'>
                  <h2 className='text-lg font-medium-'>Customer Support</h2>
                  <p className='text-sm text-gray-600 dark:text-gray-400 '>
                    Friendly customer support
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className='mt-12 pt-8 border-t-2 border-gray-800'>
          <div className='flex justify-between md:flex-row flex-col-reverse '>
            <p className='text-center'>
              &copy; {new Date().getFullYear()} PagePlaza. All rights reserved.
            </p>
            <div className='flex justify-center gap-4 md:mb-0 mb-2'>
              <img src='/icons/visa.svg' alt='Visa Logo' className='w-8' />
              <img src='/icons/upi.svg' alt='upi Logo' className='w-8' />
              <img src='/icons/rupay.svg' alt='rupay Logo' className='w-8' />
              <img src='/icons/paytm.svg' alt='Paytm Logo' className='w-8' />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
