import { useEffect, useState } from 'react';

/**
 * Shows a "waking up" hint when a request has been pending for a while.
 * The API is on a free host that sleeps when idle, so the first request
 * after a quiet period can take 30-60 seconds.
 */
const SlowServerNotice = ({ active, delay = 3000 }) => {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    if (!active) {
      setIsSlow(false);
      return;
    }
    const timer = setTimeout(() => setIsSlow(true), delay);
    return () => clearTimeout(timer);
  }, [active, delay]);

  return (
    <p role="status" aria-live="polite" className="mt-3 text-center text-sm text-gray-500">
      {isSlow && 'Waking up the server — the first request can take up to a minute.'}
    </p>
  );
};

export default SlowServerNotice;
