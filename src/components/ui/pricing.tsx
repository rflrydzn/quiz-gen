import React, { useState } from "react";
import { cn } from "@/lib/utils"; // Optional utility if using clsx or cn for class merging
import Link from "next/link";

const PRICING_BREAKPOINTS = [
  { maxTokens: 0, price: 0 },
  { maxTokens: 100, price: 20 }, // ₱20 for 100 tokens
  { maxTokens: 300, price: 50 }, // ₱50 for 300 tokens
  { maxTokens: 700, price: 100 }, // ₱100 for 700 tokens
  { maxTokens: 1500, price: 200 }, // ₱200 for 1,500 tokens
  { maxTokens: 3000, price: 350 }, // ₱350 for 3,000 tokens
  { maxTokens: 5000, price: 500 }, // ₱500 for 5,000 tokens
];

const BREAKPOINT_TOKEN_VALUES = [0, 100, 300, 700, 1500, 3000, 5000];

const getPriceForSubscribers = (
  subs: number
): { price: number | null; label: string } => {
  if (subs === 1000000) return { price: null, label: ">1M Tokens" };

  const breakpoint = PRICING_BREAKPOINTS.find((tier) => subs <= tier.maxTokens);
  if (breakpoint)
    return {
      price: breakpoint.price,
      label: `${subs.toLocaleString()} tokens`,
    };

  // After 200k, add $400 for every additional 100k up to 1M
  const basePrice = 799;
  const extraSubs = subs - 200000;
  const extraUnits = Math.ceil(extraSubs / 100000);
  const price = basePrice + extraUnits * 400;
  return { price, label: `${subs.toLocaleString()} tokens` };
};

export const LoopsPricingSlider: React.FC = () => {
  const [sliderIndex, setSliderIndex] = useState(0);

  const subscribers = BREAKPOINT_TOKEN_VALUES[sliderIndex];
  const { price, label } = getPriceForSubscribers(subscribers);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderIndex(Number(e.target.value));
  };

  return (
    <section className="max-w-3xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Card */}
        <div className="flex-1 rounded-xl border border-gray-200 p-8 relative">
          <h2 className="text-sm font-semibold text-neutral-800 mb-4">
            Calculate your pricing
          </h2>
          <div className="text-3xl font-bold text-black mb-8">{label}</div>
          <input
            type="range"
            min={0}
            max={BREAKPOINT_TOKEN_VALUES.length - 1}
            step={1}
            value={sliderIndex}
            onChange={handleSliderChange}
            className="w-full appearance-none h-3 rounded bg-gray-200 mb-12"
            style={{
              background: `linear-gradient(to right, #000000 0%, #000000 ${
                (sliderIndex / (BREAKPOINT_TOKEN_VALUES.length - 1)) * 100
              }%, #E5E7EB ${
                (sliderIndex / (BREAKPOINT_TOKEN_VALUES.length - 1)) * 100
              }%, #E5E7EB 100%)`,
            }}
          />

          <style>{`
            input[type='range']::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 28px;
              height: 28px;
              background: #ffffff;
              border: 2px solid #E5E7EB;
              border-radius: 50%;
              cursor: pointer;
              margin-top: -1px;
              box-shadow: 0 1px 5px rgba(192, 192, 192, 0.5);
              position: relative;
            }
            input[type='range']::-moz-range-thumb {
              width: 26px;
              height: 26px;
              background: #ffffff;
              border: 2px solid #E5E7EB;
              border-radius: 50%;
              cursor: pointer;
              box-shadow: 0 1px 5px rgba(192, 192, 192, 0.5);
            }
          `}</style>

          <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between text-sm text-neutral-500">
            <span>Need a custom solution?</span>
            <a
              href="mailto:kuhaku.blank.rd@gmail.com"
              className="text-black font-medium flex items-center"
            >
              Contact us <span className="ml-1">→</span>
            </a>
          </div>
        </div>

        {/* Right Card */}
        <div className="flex-1 rounded-xl border border-gray-200 p-8 bg-neutral-50">
          <h2 className="text-sm font-semibold text-neutral-800 mb-4">
            Your plan
          </h2>
          <div className="mb-2">
            <h3 className="text-3xl font-bold text-black mb-6">
              {price === 0
                ? "Free"
                : price === null
                ? "Contact us"
                : `₱
${price} `}
            </h3>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed mt-8">
            {price === 0
              ? "Start studying for free with access to all core features. Perfect for students who want to try it out—no payment required."
              : price === null
              ? "Need more than 1,000 tokens a month for your org or class? Contact us for custom pricing."
              : "Pay only for the tokens you use—no monthly fees. Study smarter without worrying about unused subscriptions."}
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block bg-black text-white px-6 py-3 rounded-md font-semibold text-sm"
          >
            {price === null ? "Contact us" : "Get started"}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default function Pricing() {
  return (
    <main className="bg-[#F0F0F0] w-screen min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col gap-2 items-center justify-center text-center">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          Pay Only for What You Use
        </h1>
        <p className="tracking-[0.4px] leading-[1.4em] text-center max-w-md mt-2 text-[#78716c]">
          No monthly fees or hidden costs—just use tokens and pay as you go.
          Flexible, fair, and built around your needs.
        </p>
      </div>
      <LoopsPricingSlider />;
    </main>
  );
}
