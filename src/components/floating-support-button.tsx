import Link from "next/link";
import { MessageSquareText } from "lucide-react";

export default function FloatingSupportButton() {
  return (
    <Link
      aria-label="Contact Support"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg shadow-slate-950/20 transition hover:scale-105 hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 sm:bottom-6 sm:right-6"
      href="/contact"
      title="Contact Support"
    >
      <MessageSquareText aria-hidden="true" size={23} />
    </Link>
  );
}
