"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { FaWindows, FaApple, FaGooglePlay, FaGlobe } from "react-icons/fa";

const LandingHero: React.FC = () => {
  useEffect(() => {
    const toggleOpen = document.getElementById("toggleOpen");
    const toggleClose = document.getElementById("toggleClose");
    const collapseMenu = document.getElementById("collapseMenu");

    const openMenu = () => collapseMenu?.classList.remove("max-lg:hidden");
    const closeMenu = () => collapseMenu?.classList.add("max-lg:hidden");

    toggleOpen?.addEventListener("click", openMenu);
    toggleClose?.addEventListener("click", closeMenu);
    return () => {
      toggleOpen?.removeEventListener("click", openMenu);
      toggleClose?.removeEventListener("click", closeMenu);
    };
  }, []);

  return (
    <div className="bg-gradient-to-b from-white via-sky-50 to-purple-50">
      {/* Hero Section */}
      <div className="px-4 py-12 sm:px-10 md:py-16">
        <div className="mx-auto max-w-screen-xl">
          <div className="grid items-center justify-center gap-x-12 gap-y-16 lg:grid-cols-2">
            {/* Left Side */}
            <div>
              <div className="max-w-3xl max-lg:mx-auto max-lg:text-center">
                <p className="mb-2 font-medium text-indigo-600 uppercase">
                  <span className="mr-2 inline-block rotate-90">|</span> app that help your Trading
                  grow
                </p>
                <h1 className="text-4xl leading-tight font-semibold text-slate-900 md:text-5xl">
                  Novotrend MetaTrader 5 App
                </h1>
                <p className="mt-6 text-base leading-relaxed text-slate-600">
                  Trading in financial markets is always at hand. The company&apos;s clients receive
                  the best working conditions and the opportunity to trade from anywhere in the
                  world.
                </p>

                {/* Download Buttons */}
                <div className="mt-10 flex flex-wrap gap-4 max-lg:justify-center">
                  {[
                    {
                      icon: <FaWindows />,
                      labelTop: "Download on the",
                      labelBottom: "Windows",
                      link: "https://download.mql5.com/cdn/web/novotrend.ltd/mt5/novotrend5setup.exe",
                    },
                    {
                      icon: <FaApple />,
                      labelTop: "Download on the",
                      labelBottom: "App Store",
                      link: "https://download.mql5.com/cdn/mobile/mt5/ios?server=Novotrend-MT5",
                    },
                    {
                      icon: <FaGooglePlay />,
                      labelTop: "Get it on",
                      labelBottom: "Google Play",
                      link: "https://download.mql5.com/cdn/mobile/mt5/android?server=Novotrend-MT5",
                    },
                    {
                      icon: <FaGlobe />,
                      labelTop: "",
                      labelBottom: "Web Trading",
                      link: "https://webtrading.novotrend.co/terminal",
                    },
                  ].map((btn, i) => (
                    <a
                      key={i}
                      href={btn.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl bg-black px-5 py-3 text-white transition-all hover:bg-gray-900"
                    >
                      <span className="text-md">{btn.icon}</span>

                      <div className="text-left leading-tight">
                        {btn.labelTop && <p className="text-xs opacity-70">{btn.labelTop}</p>}

                        <p className="text-sm font-semibold">{btn.labelBottom}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap items-center gap-4 max-lg:justify-center">
                <div className="flex -space-x-2">
                  {["team-1.webp", "team-2.webp", "team-3.webp"].map((img, i) => (
                    <Image
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-white"
                      src={`https://readymadeui.com/${img}`}
                      alt={`user-${i}`}
                      width={40}
                      height={40}
                    />
                  ))}
                </div>
                <div className="text-base text-slate-600">
                  <span className="font-semibold">Over 10,000</span> Professionals trust us
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="aspect-[42/33] w-full">
              <Image
                src="https://testmember.novotrend.co/static/media/app-image.b1580df1b7e163e3f4ab.png"
                alt="banner"
                className="h-full w-full object-contain"
                width={400}
                height={300}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingHero;
