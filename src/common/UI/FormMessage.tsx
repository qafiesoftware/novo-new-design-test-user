import { CheckCircle, XCircle, Info } from "lucide-react";
import { useEffect, useState } from "react";
interface FormMessageProps {
  message: {
    type: "success" | "error" | "info";
    text: string;
  } | null;
}

const DISMISS_DURATION = {
  success: 3000,
  info: 3000,
  error: 5000,
};

export default function FormMessage({ message }: FormMessageProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;

    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
    }, DISMISS_DURATION[message.type]);

    return () => clearTimeout(timer);
  }, [message]);

  if (!message || !visible) return null;

  const config = {
    success: {
      wrapper: "bg-success-50 border-success-500 dark:bg-success-500/10",
      text: "text-success-600 dark:text-success-400",
      icon: <CheckCircle className="text-success-500 h-4 w-4 shrink-0" />,
    },
    error: {
      wrapper: "bg-error-50 border-error-500 dark:bg-error-500/10",
      text: "text-error-600 dark:text-error-400",
      icon: <XCircle className="text-error-500 h-4 w-4 shrink-0" />,
    },
    info: {
      wrapper: "bg-blue-50 border-blue-500 dark:bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      icon: <Info className="h-4 w-4 shrink-0 text-blue-500" />,
    },
  };

  const { wrapper, text, icon } = config[message.type];

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border-l-4 px-4 py-2.5 transition-opacity duration-500 ${wrapper}`}
    >
      {icon}
      <p className={`text-sm ${text}`}>{message.text}</p>
    </div>
  );
}