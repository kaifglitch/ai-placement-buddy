import { useEffect, useState } from "react";

function CountUp({ value, duration = 1000 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = null;
    const from = 0;
    const to = value;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const current = Math.round(from + (to - from) * progress);
      setDisplay(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, [value, duration]);

  return <>{display}</>;
}

export default CountUp;
