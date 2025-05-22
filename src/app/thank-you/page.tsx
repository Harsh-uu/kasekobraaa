import { Suspense } from "react";
import ThankYou from "./ThankYou";
import Loading from "./loading";

export const metadata = {
  title: 'Thank You - CaseCobra',
  description: 'Thank you for your order. Track your custom phone case order status.',
}

export const runtime = 'edge' // Enable edge runtime for better performance

const Page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ThankYou />
    </Suspense>
  );
};

export default Page;
