type IconName =
  | "activity" | "alert" | "arrow" | "back" | "calendar"
  | "check" | "clipboard" | "clock" | "close" | "doctor"
  | "edit" | "filter" | "plus" | "reason" | "search"
  | "shield" | "trash" | "user" | "users";

type Props = { name: IconName; size?: number };

export default function Icon({ name, size = 20 }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const paths: Record<IconName, React.ReactNode> = {
    activity: <path d="M3 12h4l2.5-6 3.5 12 3-8 2 2H21" />,
    alert: <><path d="M12 3l9 17H3L12 3z" /><path d="M12 9v4" /><path d="M12 16h.01" /></>,
    arrow: <><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>,
    back: <path d="M19 12H5M11 6l-6 6 6 6" />,
    calendar: <><rect x="4" y="5" width="16" height="15" rx="2.5" /><path d="M8 3v4M16 3v4M4 10h16" /><path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01M16 17h.01" strokeWidth="2.2" /></>,
    check: <path d="M5 12l4.5 4.5L19 7" strokeWidth="2" />,
    clipboard: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4.5V3h6v1.5M9 9h6M9 13h6M9 17h4" /></>,
    clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" /></>,
    close: <path d="M6 6l12 12M18 6L6 18" strokeWidth="2" />,
    doctor: <><circle cx="12" cy="7" r="3" /><path d="M6 20c.5-3.5 2.5-5.5 6-5.5s5.5 2 6 5.5" /><path d="M8 4V3h8v1M12 14v-3M10.5 12.5h3" /></>,
    edit: <><path d="M4 20h4L19 9c1.1-1.1 1.1-2.9 0-4s-2.9-1.1-4 0L4 16v4z" /><path d="M13.5 6.5l4 4" /></>,
    filter: <><path d="M4 6h16M7 12h10M10 18h4" /></>,
    plus: <path d="M12 5v14M5 12h14" strokeWidth="2" />,
    reason: <><path d="M5 4h14v16H5z" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="M16 16l5 5" /></>,
    shield: <><path d="M12 3l7 3v5c0 4.8-2.9 8.2-7 10-4.1-1.8-7-5.2-7-10V6l7-3z" /><path d="M9 12l2 2 4-4" /></>,
    trash: <><path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" /></>,
    user: <><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20c.7-3.6 2.7-5.5 6.5-5.5s5.8 1.9 6.5 5.5" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3.8 19c.6-3.1 2.3-4.5 5.2-4.5s4.6 1.4 5.2 4.5M15 6.2c2.5.1 4 1.5 4 3.8M17 14.7c2.1.4 3.2 1.7 3.5 3.3" /></>,
  };

  return <svg {...common}>{paths[name]}</svg>;
}
