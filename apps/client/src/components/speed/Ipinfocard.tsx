"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Check, Copy } from "lucide-react";

interface IPInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  org: string;
  timezone: string;
  loc: string;
}

interface ParsedInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  isp: string;
  asn: string;
  timezone: string;
}

function parseOrg(org: string): { isp: string; asn: string } {
  const match = org.match(/^(AS\d+)\s+(.+)$/);
  if (match) return { asn: match[1], isp: match[2] };
  return { asn: "—", isp: org };
}

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.3, ease: "easeOut" },
  }),
};

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <motion.button
      onClick={handleCopy}
      whileTap={{ scale: 0.88 }}
      className="ml-1.5 shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      aria-label="Copy IP address"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
          >
            <Check className="h-3 w-3 text-emerald-500" />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
          >
            <Copy className="h-3 w-3" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function InfoRow({
  label,
  value,
  index,
  mono = false,
  copyable = false,
}: {
  label: string;
  value: string;
  index: number;
  mono?: boolean;
  copyable?: boolean;
}) {
  return (
    <motion.div
      custom={index}
      variants={rowVariants}
      initial="hidden"
      animate="visible"
      className="flex items-center justify-between gap-4 py-3 border-b border-border/50 last:border-0"
    >
      <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium shrink-0">
        {label}
      </span>
      <div className="flex items-center gap-0 min-w-0">
        <span
          className={`text-[13px] font-medium text-right truncate ${
            mono ? "font-mono text-[12px]" : ""
          }`}
        >
          {value}
        </span>
        {copyable && <CopyBtn text={value} />}
      </div>
    </motion.div>
  );
}

function SkeletonRows() {
  return (
    <div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
        >
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-3 w-28 rounded" />
        </div>
      ))}
    </div>
  );
}

export function IPInfoCard() {
  const [info, setInfo] = useState<ParsedInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchIP() {
      try {
        const res = await fetch("https://ipinfo.io/json");
        if (!res.ok) throw new Error("Failed");
        const data: IPInfo = await res.json();
        const { isp, asn } = parseOrg(data.org ?? "");
        setInfo({
          ip: data.ip,
          city: data.city,
          region: data.region,
          country: data.country,
          isp,
          asn,
          timezone: data.timezone,
        });
      } catch {
        try {
          const res2 = await fetch("https://api.ipify.org?format=json");
          const { ip } = await res2.json();
          setInfo({
            ip,
            city: "—",
            region: "—",
            country: "—",
            isp: "—",
            asn: "—",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          });
        } catch {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchIP();
  }, []);

  return (
    <Card className="overflow-hidden rounded-2xl shadow-sm mt-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between px-4 py-3 border-b"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <p className="text-sm font-semibold tracking-tight">Connection info</p>
        </div>

        <AnimatePresence>
          {info && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              <Badge variant="secondary" className="font-mono text-[11px] px-2 py-0.5">
                {info.country}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Body */}
      <div className="px-4 py-0">
        {loading && <SkeletonRows />}

        {error && (
          <p className="text-[12px] text-muted-foreground py-4 text-center">
            Could not fetch connection info.
          </p>
        )}

        {!loading && !error && info && (
          <>
            <InfoRow label="IP"       value={info.ip}                        index={0} mono copyable />
            <InfoRow label="City"     value={`${info.city}, ${info.region}`} index={1} />
            <InfoRow label="ISP"      value={info.isp}                       index={2} />
            <InfoRow label="ASN"      value={info.asn}                       index={3} mono />
            <InfoRow label="Timezone" value={info.timezone}                  index={4} />
          </>
        )}
      </div>
    </Card>
  );
}
