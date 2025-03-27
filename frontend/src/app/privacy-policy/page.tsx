"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Eye,
  FileText,
  Bell,
  Server,
  Database,
  User,
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
            Privacy Policy
          </motion.h1>
          <motion.div
            className='flex justify-center items-center mb-6'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Shield className='h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2' />
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
            className='max-w-4xl mx-auto space-y-8'
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <h2 className='text-2xl font-semibold mb-4 flex items-center'>
                <Eye className='h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2' />
                Introduction
              </h2>
              <div className='space-y-3 text-gray-700 dark:text-gray-300'>
                <p>
                  At Page Plaza, we respect your privacy and are committed to
                  protecting your personal data. This Privacy Policy explains
                  how we collect, use, disclose, and safeguard your information
                  when you use our book e-commerce platform.
                </p>
                <p>
                  Our platform offers various features including user
                  authentication, product browsing, cart management, wishlist
                  functionality, and secure payment processing through Razorpay.
                  This policy applies to all information collected through our
                  website and any related services.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className='text-2xl font-semibold mb-4 flex items-center'>
                <Database className='h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2' />
                Information We Collect
              </h2>
              <div className='space-y-3 text-gray-700 dark:text-gray-300'>
                <p>
                  <strong>Personal Information:</strong> When you create an
                  account, we collect your name, email address, and contact
                  information. If you choose to log in through Google OAuth, we
                  receive information from your Google account in accordance
                  with your Google privacy settings.
                </p>
                <p>
                  <strong>Transaction Information:</strong> We collect data
                  about purchases made on our platform, including payment method
                  details (processed securely through Razorpay), billing and
                  shipping addresses, and purchase history.
                </p>
                <p>
                  <strong>Usage Information:</strong> We automatically collect
                  certain information about your device and how you interact
                  with our platform, including browsing history on our site,
                  wishlist additions, and cart activity.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className='text-2xl font-semibold mb-4 flex items-center'>
                <Server className='h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2' />
                How We Use Your Information
              </h2>
              <div className='space-y-3 text-gray-700 dark:text-gray-300'>
                <p>We use the information we collect to:</p>
                <ul className='list-disc pl-6 space-y-2'>
                  <li>
                    Process and fulfill your orders, including payment
                    processing and shipping
                  </li>
                  <li>
                    Provide you with order confirmations and updates through our
                    Gmail integration
                  </li>
                  <li>
                    Manage your account, including authentication through JWT
                    tokens
                  </li>
                  <li>
                    Maintain and personalize your shopping cart and wishlist
                  </li>
                  <li>
                    Improve our platform's functionality and user experience
                  </li>
                  <li>
                    Communicate with you about products, services, and
                    promotions (with opt-out options)
                  </li>
                  <li>
                    Ensure the security of our platform and detect fraud through
                    our secure token management
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className='text-2xl font-semibold mb-4 flex items-center'>
                <Lock className='h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2' />
                Security of Your Information
              </h2>
              <div className='space-y-3 text-gray-700 dark:text-gray-300'>
                <p>
                  We implement appropriate security measures to protect your
                  personal information, including:
                </p>
                <ul className='list-disc pl-6 space-y-2'>
                  <li>Secure JWT token authentication system</li>
                  <li>HTTPS encryption for all data transmission</li>
                  <li>
                    Secure payment processing through Razorpay's PCI-compliant
                    gateway
                  </li>
                  <li>
                    Regular security assessments and database security
                    monitoring
                  </li>
                </ul>
                <p>
                  However, no method of transmission over the Internet or
                  electronic storage is 100% secure, and we cannot guarantee
                  absolute security.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className='text-2xl font-semibold mb-4 flex items-center'>
                <Bell className='h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2' />
                Communications
              </h2>
              <div className='space-y-3 text-gray-700 dark:text-gray-300'>
                <p>By creating an account, you consent to receive:</p>
                <ul className='list-disc pl-6 space-y-2'>
                  <li>
                    Transactional emails related to your orders and account
                  </li>
                  <li>Order status updates and tracking information</li>
                  <li>Account security notifications</li>
                </ul>
                <p>
                  You can manage your communication preferences through your
                  account settings or by following the unsubscribe instructions
                  in our emails.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className='text-2xl font-semibold mb-4 flex items-center'>
                <User className='h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2' />
                Your Rights
              </h2>
              <div className='space-y-3 text-gray-700 dark:text-gray-300'>
                <p>
                  Depending on your location, you may have certain rights
                  regarding your personal information, including:
                </p>
                <ul className='list-disc pl-6 space-y-2'>
                  <li>
                    The right to access the personal information we hold about
                    you
                  </li>
                  <li>
                    The right to request correction or deletion of your personal
                    information
                  </li>
                  <li>
                    The right to restrict or object to our processing of your
                    personal information
                  </li>
                  <li>The right to data portability</li>
                </ul>
                <p>
                  To exercise these rights, please contact us using the
                  information provided in the "Contact Us" section.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className='text-2xl font-semibold mb-4 flex items-center'>
                <FileText className='h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2' />
                Changes to This Privacy Policy
              </h2>
              <div className='space-y-3 text-gray-700 dark:text-gray-300'>
                <p>
                  We may update this Privacy Policy from time to time to reflect
                  changes in our practices or for other operational, legal, or
                  regulatory reasons. We will notify you of any material changes
                  by posting the new Privacy Policy on this page and updating
                  the "Last Updated" date.
                </p>
                <p>
                  We encourage you to review this Privacy Policy periodically to
                  stay informed about how we are protecting your information.
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
                  If you have any questions or concerns about this Privacy
                  Policy or our data practices, please contact us at:
                </p>
                <p className='font-medium'>privacy@pageplaza.com</p>
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
