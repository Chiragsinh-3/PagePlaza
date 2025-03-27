"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Scale,
  AlertCircle,
  Book,
  CreditCard,
  Globe,
  ShieldCheck,
  HelpCircle,
  Mail,
} from "lucide-react";
import Link from "next/link";

const Page = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className='min-h-screen bg-white dark:bg-black text-gray-800 dark:text-gray-200'>
      <div className='container mx-auto px-6 py-16'>
        <motion.header
          className='mb-12'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h1
            className='text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-500 dark:from-indigo-400 dark:to-purple-300'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Terms of Use
          </motion.h1>
          <motion.div
            className='flex justify-center items-center mb-6'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Scale className='h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2' />
            <p className='text-lg text-gray-600 dark:text-gray-300'>
              Last Updated: February 28, 2025
            </p>
          </motion.div>
        </motion.header>

        <motion.div
          className='backdrop-blur-md bg-white/40 dark:bg-gray-800/40 rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/30 mb-12'
          variants={containerVariants}
          initial='hidden'
          animate='visible'
        >
          <motion.div
            className='max-w-4xl mx-auto space-y-8 pt-10'
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <h2 className='text-2xl font-semibold mb-4 flex items-center'>
                <FileText className='h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2' />
                Introduction
              </h2>
              <div className='space-y-3 text-gray-700 dark:text-gray-300'>
                <p>
                  Welcome to Page Plaza! These Terms of Use govern your use of
                  our website, mobile applications, and services. By accessing
                  or using our platform, you agree to be bound by these Terms.
                  If you do not agree with any part of these terms, please do
                  not use our services.
                </p>
                <p>
                  Our platform provides an online marketplace for books,
                  featuring user authentication, responsive design, book
                  listings with advanced filters, shopping cart and wishlist
                  functionality, secure payment processing through Razorpay, and
                  order tracking.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className='text-2xl font-semibold mb-4 flex items-center'>
                <Book className='h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2' />
                User Accounts
              </h2>
              <div className='space-y-3 text-gray-700 dark:text-gray-300'>
                <p>
                  <strong>Account Creation:</strong> To access certain features
                  of our platform, you will need to register for an account. You
                  can register directly or through Google OAuth. You agree to
                  provide accurate, current, and complete information during the
                  registration process.
                </p>
                <p>
                  <strong>Account Security:</strong> You are responsible for
                  maintaining the confidentiality of your account credentials
                  and for all activities that occur under your account. You
                  agree to notify us immediately of any unauthorized use of your
                  account.
                </p>
                <p>
                  <strong>Account Termination:</strong> We reserve the right to
                  suspend or terminate your account at our sole discretion,
                  without notice, for conduct that we believe violates these
                  Terms or is harmful to other users, us, or third parties, or
                  for any other reason.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className='text-2xl font-semibold mb-4 flex items-center'>
                <ShieldCheck className='h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2' />
                Acceptable Use
              </h2>
              <div className='space-y-3 text-gray-700 dark:text-gray-300'>
                <p>By using our platform, you agree not to:</p>
                <ul className='list-disc pl-6 space-y-2'>
                  <li>
                    Use the platform in any way that violates any applicable
                    laws or regulations
                  </li>
                  <li>
                    Attempt to gain unauthorized access to any part of our
                    platform or systems
                  </li>
                  <li>
                    Engage in any activity that disrupts or interferes with our
                    services
                  </li>
                  <li>
                    Attempt to reverse engineer any aspect of our platform
                  </li>
                  <li>
                    Collect or harvest any information from users without their
                    consent
                  </li>
                  <li>
                    Use our platform to transmit any malicious code or engage in
                    any activity that could damage or overburden our systems
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className='text-2xl font-semibold mb-4 flex items-center'>
                <CreditCard className='h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2' />
                Purchases and Payments
              </h2>
              <div className='space-y-3 text-gray-700 dark:text-gray-300'>
                <p>
                  <strong>Product Listings:</strong> We strive to display
                  accurate product information, including pricing and
                  availability. However, we do not warrant that product
                  descriptions or other content on the platform are accurate,
                  complete, reliable, current, or error-free.
                </p>
                <p>
                  <strong>Pricing:</strong> All prices are in the displayed
                  currency and are subject to change without notice. We reserve
                  the right to refuse or cancel orders if we suspect fraudulent
                  activity or identify errors in pricing or product information.
                </p>
                <p>
                  <strong>Payment Processing:</strong> We use Razorpay as our
                  payment processor. By making a purchase, you agree to
                  Razorpay's terms and conditions. All payment information is
                  securely handled by Razorpay, and we do not store your full
                  credit card details on our servers.
                </p>
                <p>
                  <strong>Order Confirmation:</strong> An order is not confirmed
                  until you receive an order confirmation email. We reserve the
                  right to refuse or cancel any order for any reason, including
                  limitations on quantities available for purchase.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className='text-2xl font-semibold mb-4 flex items-center'>
                <Globe className='h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2' />
                Intellectual Property
              </h2>
              <div className='space-y-3 text-gray-700 dark:text-gray-300'>
                <p>
                  <strong>Our Content:</strong> All content on our platform,
                  including but not limited to text, graphics, logos, button
                  icons, images, audio clips, digital downloads, and software,
                  is the property of Page Plaza or its content suppliers and is
                  protected by international copyright laws.
                </p>
                <p>
                  <strong>Limited License:</strong> We grant you a limited,
                  non-exclusive, non-transferable, and revocable license to
                  access and use our platform for personal, non-commercial
                  purposes in accordance with these Terms.
                </p>
                <p>
                  <strong>User Content:</strong> By posting reviews, comments,
                  or other content on our platform, you grant us a
                  non-exclusive, royalty-free, perpetual, irrevocable, and fully
                  sublicensable right to use, reproduce, modify, adapt, publish,
                  translate, and distribute such content in any media.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className='text-2xl font-semibold mb-4 flex items-center'>
                <AlertCircle className='h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2' />
                Disclaimers and Limitations of Liability
              </h2>
              <div className='space-y-3 text-gray-700 dark:text-gray-300'>
                <p>
                  <strong>Disclaimer of Warranties:</strong> Our platform is
                  provided on an "as is" and "as available" basis. We expressly
                  disclaim all warranties of any kind, whether express or
                  implied, including but not limited to the implied warranties
                  of merchantability, fitness for a particular purpose, and
                  non-infringement.
                </p>
                <p>
                  <strong>Limitation of Liability:</strong> To the fullest
                  extent permitted by applicable law, we shall not be liable for
                  any indirect, incidental, special, consequential, or punitive
                  damages, including but not limited to loss of profits, data,
                  use, or goodwill, resulting from your access to or use of our
                  platform.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className='text-2xl font-semibold mb-4 flex items-center'>
                <HelpCircle className='h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2' />
                Dispute Resolution
              </h2>
              <div className='space-y-3 text-gray-700 dark:text-gray-300'>
                <p>
                  <strong>Governing Law:</strong> These Terms shall be governed
                  by and construed in accordance with the laws of [Your
                  Jurisdiction], without regard to its conflict of law
                  principles.
                </p>
                <p>
                  <strong>Dispute Resolution:</strong> Any dispute arising out
                  of or relating to these Terms or your use of our platform
                  shall first be attempted to be resolved through good faith
                  negotiations. If such negotiations fail, the dispute shall be
                  submitted to binding arbitration in accordance with the rules
                  of [Arbitration Authority] in [Your Jurisdiction].
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className='text-2xl font-semibold mb-4 flex items-center'>
                <FileText className='h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2' />
                Changes to Terms
              </h2>
              <div className='space-y-3 text-gray-700 dark:text-gray-300'>
                <p>
                  We reserve the right to modify or replace these Terms at any
                  time at our sole discretion. The most current version will be
                  posted on our website with the "Last Updated" date. By
                  continuing to access or use our platform after any revisions
                  become effective, you agree to be bound by the revised terms.
                </p>
                <p>
                  We encourage you to review these Terms periodically for any
                  changes. If you do not agree to the new terms, you are no
                  longer authorized to use our platform.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className='text-2xl font-semibold mb-4 flex items-center'>
                <Mail className='h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2' />
                Contact Us
              </h2>
              <div className='space-y-3 text-gray-700 dark:text-gray-300'>
                <p>
                  If you have any questions about these Terms, please contact us
                  at:
                </p>
                <p className='font-medium'>legal@pageplaza.com</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
        <Link href='/'>
          <motion.div
            className='text-center mt-8'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <motion.button
              className='px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-full shadow-lg transition-all'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Back to Home
            </motion.button>
          </motion.div>
        </Link>
      </div>
    </div>
  );
};

export default Page;
