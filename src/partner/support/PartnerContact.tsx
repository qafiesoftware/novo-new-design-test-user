"use client";
import { FiMail } from "react-icons/fi";

const supportData = [
  {
    language: "English",
    status: "Available now",
    statusColor: "bg-green-100 text-green-700",
    time: "Mon 10:00 am – Friday 06:30 pm",
  },
];

export default function SupportPartner() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Support</h1>
        <a
          href="mailto:support@novotrend.co"
          className="flex items-center gap-2 border rounded-xl py-2 px-4 
                       bg-[#465FFF] text-white hover:bg-[#3649e8]  transition"
        >
          <FiMail className="text-xl" />
          Send email
        </a>
      </div>
      {/* Table Header */}
      <div className="grid grid-cols-3 rounded-lg bg-gray-100 px-6 py-3 mb-2 dark:bg-slate-800">
        <span className="text-gray-700 font-medium dark:text-white">Language</span>
        <span className="text-gray-700 font-medium text-center dark:text-white">Accessibility</span>
        <span className="text-gray-700 font-medium text-right dark:text-white">Your Local time</span>
      </div>
      {/* Table Row */}
      {supportData.map((item, idx) => (
        <div
          key={idx}
          className="grid grid-cols-3 items-center rounded-xl bg-white dark:bg-slate-800 shadow-sm px-6 py-4 mb-4"
        >
          <span className="text-gray-900 font-medium dark:text-white">{item.language}</span>
          <span className={`flex justify-center`}>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold  ${item.statusColor}`}>
              {item.status}
            </span>
          </span>
          <span className="text-gray-700 text-right dark:text-white">{item.time}</span>
        </div>
      ))}
    </div>
  );
}