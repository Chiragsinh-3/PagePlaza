import Script from "next/script";
import {
  useCreateRazorpayOrderMutation,
  useVerifyPaymentMutation,
} from "@/store/api";
import { toast } from "sonner";

interface RazorpayPaymentProps {
  orderId: string;
  amount: number;
  onSuccess?: () => void;
  onFailure?: () => void;
  setIsManageDialogOpen: (open: boolean) => void;
}

export default function RazorpayPayment({
  orderId,
  amount,
  onSuccess,
  onFailure,
  setIsManageDialogOpen,
}: RazorpayPaymentProps) {
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const makePayment = async () => {
    try {
      setIsManageDialogOpen(false);
      const { data } = await createRazorpayOrder({ orderId }).unwrap();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100, // amount in paisa
        currency: "INR",
        name: "BookStore",
        description: "Book Purchase",
        order_id: data.order.id,
        handler: async function (response: any) {
          try {
            await verifyPayment({
              orderId, // Add original order ID
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();

            toast.success("Payment successful!");
            onSuccess?.();
          } catch (error) {
            toast.error("Payment verification failed");
            onFailure?.();
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
        },
        theme: {
          color: "#4338CA",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

      paymentObject.on("payment.failed", function () {
        toast.error("Payment failed. Please try again");
        onFailure?.();
      });
    } catch (error) {
      toast.error("Failed to create payment order");
      onFailure?.();
    }
  };

  return (
    <>
      <Script
        id='razorpay-checkout-js'
        src='https://checkout.razorpay.com/v1/checkout.js'
      />
      <button
        onClick={makePayment}
        className='w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors'
      >
        Pay Now
      </button>
    </>
  );
}
