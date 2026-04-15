interface BadgeProps {
  status: "pending" | "scheduled" | "funded" | "redeemed" | "processed" | "active";
  className?: string;
}

const statusConfig = {
  pending: {
    bg: "bg-warning/10",
    text: "text-warning",
    dot: "bg-warning",
    label: "Pending",
  },
  scheduled: {
    bg: "bg-warning/10",
    text: "text-warning",
    dot: "bg-warning",
    label: "Scheduled",
  },
  funded: {
    bg: "bg-accent-blue/10",
    text: "text-accent-blue",
    dot: "bg-accent-blue",
    label: "Funded",
  },
  redeemed: {
    bg: "bg-success/10",
    text: "text-success",
    dot: "bg-success",
    label: "Redeemed",
  },
  processed: {
    bg: "bg-success/10",
    text: "text-success",
    dot: "bg-success",
    label: "Processed",
  },
  active: {
    bg: "bg-accent-purple/10",
    text: "text-accent-purple",
    dot: "bg-accent-purple",
    label: "Active",
  },
};

export default function Badge({ status, className = "" }: BadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
