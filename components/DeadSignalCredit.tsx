"use client";

import Image from "next/image";
import { useState } from "react";

const DEAD_SIGNAL_URL = "https://deadsignal.co";
const DEAD_SIGNAL_ICON_SRC = "/images/deadsignal/deadsignal-icon-transparent.png";

export default function DeadSignalCredit() {
  const [hideIcon, setHideIcon] = useState(false);

  return (
    <a
      href={DEAD_SIGNAL_URL}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 text-xs text-(--color-warm-linen) transition hover:text-(--color-cream)"
      aria-label="Built and managed by DeadSignal"
    >
      {!hideIcon ? (
        <Image
          src={DEAD_SIGNAL_ICON_SRC}
          alt=""
          width={20}
          height={20}
          className="h-5 w-5"
          aria-hidden
          onError={() => setHideIcon(true)}
        />
      ) : null}
      <span>Built &amp; Managed by DeadSignal</span>
    </a>
  );
}
