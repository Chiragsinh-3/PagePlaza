"use client";
import { useRouter, useSearchParams } from "next/navigation";
import RazorpayPayment from "@/components/RazorpayPayment";
import { useGetOrderByOrderIdQuery } from "@/store/api";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const { data: orderData, isLoading } = useGetOrderByOrderIdQuery(
    orderId ?? ""
  );

  if (!orderId) {
    return <div>No order ID provided</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!orderData?.data) {
    return <div>Order not found</div>;
  }

  return (
    <RazorpayPayment
      orderId={orderData.data._id}
      amount={orderData.data.totalAmount}
      setIsManageDialogOpen={() => {}}
      onSuccess={() => {
        router.push("/order-confirmation/${id}");
        // router.push(`/checkout?orderId=${orderId}`);
      }}
      onFailure={() => {
        // Handle payment failure
      }}
    />
  );
}
