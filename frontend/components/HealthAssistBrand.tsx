import Link from "next/link";

type Props = {
  href?: string;
};

export default function HealthAssistBrand({ href = "/dashboard" }: Props) {
  return (
    <Link href={href} className="group flex items-center gap-3">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#176b4d] shadow-[0_8px_24px_rgba(23,107,77,0.18)] transition group-hover:-translate-y-0.5">
        <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" aria-hidden="true">
          <path
            d="M24 39C20 35.8 8 29.1 8 18.2C8 12.6 11.8 9 16.6 9C19.8 9 22.4 10.7 24 13.2C25.6 10.7 28.2 9 31.4 9C36.2 9 40 12.6 40 18.2C40 29.1 28 35.8 24 39Z"
            stroke="white"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path
            d="M11 23H17L20.5 17L24.5 29L28.5 20L31 23H37"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <span className="text-left">
        <span className="block text-xl font-extrabold tracking-tight text-[#14251d]">
          HealthAssist
        </span>
        <span className="hidden text-[9px] font-bold uppercase tracking-[0.2em] text-[#7b8d83] sm:block">
          Smart Healthcare
        </span>
      </span>
    </Link>
  );
}
