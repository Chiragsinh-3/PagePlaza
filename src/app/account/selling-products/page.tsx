"use client";
import { useProductBySellerIdQuery } from "@/store/api";
import { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";

const page = () => {
  const user = useSelector((state: RootState) => state.user.user);

  const sellerId = user._id;
  const { data: products, error } = useProductBySellerIdQuery(sellerId);

  if (error) {
    if ("data" in error) {
      return <div>{(error.data as { message: string }).message}</div>;
    }
    return <div>Error occurred</div>;
  }

  if (!products) {
    return <div> Loading...</div>;
  }
  const productList = products.data;
  return (
    <div>
      <ul>
        {productList.map((product: any) => (
          <li key={product._id}>{product.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default page;
