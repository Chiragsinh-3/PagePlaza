"use client";
import { useRouter, useSearchParams } from "next/navigation";
import RazorpayPayment from "@/components/RazorpayPayment";
import { useGetOrderByOrderIdQuery } from "@/store/api";
import { toast } from "sonner";
import BookLoader from "@/lib/BookLoader";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const { data: orderData, isLoading } = useGetOrderByOrderIdQuery(
    orderId ?? ""
  );

  if (!orderId) {
    toast.error("Order ID not provided");
    router.push("/");
  }

  if (isLoading) {
    return <BookLoader />;
  }

  if (!orderData?.data) {
    toast.error("Order not found");
    router.push("/");
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
