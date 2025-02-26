"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { books, filters } from "@/lib/BookData";
import Link from "next/link";
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import BookLoader from "@/lib/BookLoader";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [condition, setCondition] = useState<string[]>([]);
  const [type, setType] = useState<string[]>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("newest");
  const [loading, isLoading] = useState(false);
  const bookperpage = 6;

  const toggleFilter = (section: string, item: string) => {
    const updatedFilter = (prev: string[]) => {
      return prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item];
    };
    switch (section) {
      case "condition":
        setCondition(updatedFilter);
        break;

      case "category":
        setCategory(updatedFilter);
        break;

      case "classType":
        setType(updatedFilter);
        break;

      default:
        break;
    }
  };

  const filterBooks = books.filter((book) => {
    const conditionMatch =
      condition.length === 0 ||
      condition
        .map((item) => item.toLowerCase())
        .includes(book.condition.toLowerCase());

    const typeMatch =
      type.length === 0 ||
      type
        .map((item) => item.toLowerCase())
        .includes(book.classType.toLowerCase());

    const categoryMatch =
      category.length === 0 ||
      category
        .map((item) => item.toLowerCase())
        .includes(book.category.toLowerCase());

    return conditionMatch && typeMatch && categoryMatch;
  });

  const sortedBooks = [...filterBooks].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedBooks.length / bookperpage);
  const paginatedBooks = sortedBooks.slice(
    (currentPage - 1) * bookperpage,
    currentPage * bookperpage
  );
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const calculateDiscount = (price: number, finalPrice: number): number => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100);
    }
    return 0;
  };
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };
  return (
    <div className='min-h-screen '>
      <div className='container mx-auto px-4 py-4'>
        <nav className='mb-8 flex items-center'>
          <Link href='/' className='text-primary hover:underline'>
            {" "}
            Home{" "}
          </Link>
          <span>/</span>
          <span> Books</span>
        </nav>
        <h1 className='mb-8 text-3xl'>
          Find from over 1000s of used books online
        </h1>
        <div className='grid gap-8 md:grid-cols-[280px_1fr]'>
          <div className='space-y-6'>
            <Accordion type='multiple' className='w-full'>
              {Object.entries(filters).map(([key, value]) => (
                <AccordionItem key={key} value={key}>
                  <AccordionTrigger className='text-primary font-light  text-lg '>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className='space-y-4'>
                      {value.map((value) => (
                        <div key={value} className='flex items-center'>
                          <Checkbox
                            id={value}
                            checked={
                              key === "condition"
                                ? condition.includes(value)
                                : key === "classType"
                                ? type.includes(value)
                                : category.includes(value)
                            }
                            onCheckedChange={() => toggleFilter(key, value)}
                          />
                          <label
                            htmlFor={value}
                            className='ml-2 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                          >
                            {value}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className='space-y-8'>
            {loading ? (
              <BookLoader />
            ) : paginatedBooks.length ? (
              <>
                <div className='flex justify-end'>
                  {/* <div className='mb-8 text-xl font-semibold'>
                    Buy second hand Books
                  </div> */}
                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className='w-[210px] '>
                      <SelectValue placeholder='Sort by' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='newest'>Newest First</SelectItem>
                      <SelectItem value='oldest'>Oldest First</SelectItem>
                      <SelectItem value='price-low'>
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value='price-high'>
                        Price: High to Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='grid gap-8  sm:grid-cols-2 lg:grid-cols-3 '>
                  {paginatedBooks.map((book) => (
                    <motion.div
                      key={book._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      exit={{ opacity: 0, y: 20 }}
                      className=' rounded-lg  '
                    >
                      <Card className='group relative min-h-full rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-2xl border-0'>
                        <CardContent className='p-0'>
                          <Link href={`/books/${book._id}`}>
                            <div className='relative'>
                              {book.images[0] && (
                                <Image
                                  src={book.images[0]}
                                  alt={book.title}
                                  width={400}
                                  height={300}
                                  className='h-[250px] w-full object-cover transition-transform duration-300 group-hover:scale-105'
                                />
                              )}
                              <div className='absolute top-2 left-0 z-10 flex flex-col gap-2'>
                                {calculateDiscount(
                                  book.price,
                                  book.finalPrice
                                ) > 0 && (
                                  <Badge className='rounded-l-none'>
                                    {calculateDiscount(
                                      book.price,
                                      book.finalPrice
                                    )}
                                    % off
                                  </Badge>
                                )}
                              </div>
                              <Button
                                size='icon'
                                variant={"ghost"}
                                className='absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm transition-opacity duration-300
                               hover:bg-white group-hover:opacity-100'
                              >
                                <Heart className='text-red-500 h-4 w-4' />
                              </Button>
                            </div>
                            <div className='p-4 pt-10 space-y-2'>
                              <div className='flex items-start justify-between'>
                                <h3 className='text-lg font-semibold'>
                                  {book.title}
                                </h3>
                              </div>

                              <p className='text-sm text-zinc-400'>
                                {book.author}
                              </p>

                              <div className='flex items-baseline gap-2'>
                                <span className='text-2xl font-bold'>
                                  ₹{book.finalPrice}
                                </span>
                                {book.price && (
                                  <span className='line-through text-sm text-zinc-400'>
                                    ₹{book.price}
                                  </span>
                                )}
                              </div>
                              <div className='flex justify-between items-center text-xs text-zinc-400 '>
                                <span>{formatDate(book.createdAt)}</span>
                                <span>{book.condition}</span>
                              </div>
                            </div>
                          </Link>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
