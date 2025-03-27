import { books } from "@/lib/BookData";
import React, { useState, useEffect } from "react";

const NewBooks = () => {
  const [currentBookSlide, setCurrentBookSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBookSlide((cur) => (cur + 1) % books.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentBookSlide((cur) => (cur - 1 + books.length) % books.length);
  };
  const nextSlide = () => {
    setCurrentBookSlide((cur) => (cur + 1) % books.length);
  };
  const calculateDiscount = (price: number, finalPrice: number): number => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100);
    }
    return 0;
  };

  return (
    <section>
      <div className='container flex flex-col mx-auto'>
        <div className='text-center text-3xl font-extrabold w-full mt-10'>
          <h1>Recently added Books</h1>
        </div>
        <div className='relative'>
          {books.length > 0 ? (
            <>
              {/* Existing slider for a single book */}
              <div className='flex justify-center items-center'>
                {/* New gallery showing all images */}
                <div className='flex flex-wrap justify-center mt-6'>
                  {books.map((book) =>
                    book.images.map((img, id) => (
                      <img
                        key={`${book._id}-${id}`}
                        src={`/images/${img}`}
                        alt={book.title}
                        className='w-32 h-32 object-cover m-2'
                      />
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewBooks;
