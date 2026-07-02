// import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { ThemeProvider } from "@/context/ThemeContext";

import React from "react";
// import singupimg from "../../../../public/images/logo/lightmode.png";
import authb from "../../../../public/images/grid-image/authbg.jpg";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-1 bg-white p-6 sm:p-0 dark:bg-gray-900">
      <ThemeProvider>
        <div className="relative flex h-screen w-full flex-col justify-center sm:p-0 lg:flex-row dark:bg-gray-900">
          {children}

          {/* Right side background image only */}
          <div
            className="hidden h-full w-full items-center bg-cover bg-center bg-no-repeat lg:grid lg:w-1/2"
            style={{
              backgroundImage: `url(${authb.src})`,
            }}
          ></div>

          <div className="fixed right-6 bottom-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
