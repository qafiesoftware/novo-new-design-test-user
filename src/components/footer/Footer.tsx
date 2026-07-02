"use client";
import { FaFileContract, FaUserShield, FaBalanceScale, FaFileSignature } from "react-icons/fa";

const DashboardFooter = () => {
  return (
    <footer className="w-full bg-gradient-to-b from-white via-sky-50 to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      {/* container */}
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Disclaimer */}
        <div className="py-10">
          <p className="text-md leading-relaxed text-gray-700 dark:text-gray-300">
            <b>Regional restrictions:</b> Novotrend.Ltd does not provide services to residents of
            the United States, Canada, Sudan, Syria and North Korea and the European Economic Area.
            User personal data is protected. An SSL certificate is also installed on the site, so
            information is transmitted using a secure protocol. The activities of Novotrend.Ltd are
            conducted outside the Russian Federation. Novotrend.co is owned and operated by
            Novotrend Ltd registration number 23835 IBC 2017, Suite 305, Griffith Corporate Center
            P, O. Box 1510, Beachmont Kingstown St. Vincent and the Grenadines.
          </p>
        </div>

        {/* Contact + Links */}
        <div className="border-t border-gray-200 py-6 dark:border-gray-700">
          <div className="flex flex-col justify-between gap-4 font-medium sm:flex-row">
            {/* Email */}
            <div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Email: </span>
              <a
                href="mailto:support@novotrend.co"
                className="text-sm text-[#465FFF] transition hover:underline hover:opacity-90"
              >
                support@novotrend.co
              </a>
            </div>
            {/* Links */}
            <div className="flex flex-wrap gap-6 text-sm">
              <a
                href="/pdf/PrivacyPolicy.pdf"
                target="_blank"
                aria-label="View privacy policy"
                className="flex items-center gap-1 text-sm text-gray-700 transition hover:text-[#465FFF] dark:text-gray-300"
              >
                <FaUserShield size={15} /> Privacy Policy
              </a>
              <a
                href="/pdf/RiskDisclosure.pdf"
                target="_blank"
                aria-label="View risk disclosure"
                className="flex items-center gap-1 text-sm text-gray-700 transition hover:text-[#465FFF] dark:text-gray-300"
              >
                <FaBalanceScale size={15} /> Risk Disclosure
              </a>
              <a
                href="/pdf/Service Regulations.pdf"
                target="_blank"
                aria-label="View service regulations"
                className="flex items-center gap-1 text-sm text-gray-700 transition hover:text-[#465FFF] dark:text-gray-300"
              >
                <FaFileContract size={15} /> Service Regulations
              </a>
              <a
                href="/pdf/Client Agreement.pdf"
                target="_blank"
                aria-label="View client agreement"
                className="flex items-center gap-1 text-sm text-gray-700 transition hover:text-[#465FFF] dark:text-gray-300"
              >
                <FaFileSignature size={15} /> Client Agreement
              </a>
            </div>
          </div>
          {/* Copyright */}
          <div className="mt-4 flex flex-col items-center justify-between border-t border-gray-200 pt-4 text-xs text-gray-600 sm:flex-row dark:border-gray-700 dark:text-gray-400">
            <span>All rights reserved. Trading involves significant risk.</span>
            <span> {new Date().getFullYear()} Novotrend</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;