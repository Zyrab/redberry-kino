import { useEffect, useRef, useState } from "react";

const left = (expiresAt) => Math.max(0, expiresAt - Date.now());

export default function HoldTimer({ expiresAt, onExpire }) {
  const [ms, setMs] = useState(() => left(expiresAt));
  const expireRef = useRef(onExpire);
  expireRef.current = onExpire;

  useEffect(() => {
    const id = setInterval(() => {
      const remaining = left(expiresAt);
      setMs(remaining);
      if (remaining === 0) {
        clearInterval(id);
        expireRef.current();
      }
    }, 250);
    return () => clearInterval(id);
  }, [expiresAt]);

  const total = Math.ceil(ms / 1000);
  return (
    <span className="text-label-m">
      {Math.floor(total / 60)}:{String(total % 60).padStart(2, "0")}
    </span>
  );
}
