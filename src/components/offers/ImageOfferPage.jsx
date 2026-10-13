import React, { useEffect, useRef, useState } from 'react';

// Vykreslí jednu stranu obrazové nabídky do canvasu a předá ho rodiči pro stažení / uložení.
export default function ImageOfferPage({ page, onReady }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState('');

  useEffect(() => {
    let alive = true;
    setFailed('');
    page.render()
      .then((canvas) => {
        if (!alive || !ref.current) return;
        canvas.className = 'h-auto w-full';
        ref.current.replaceChildren(canvas);
        onReady(page.key, canvas);
      })
      .catch((e) => alive && setFailed(e?.message || 'Stranu nelze vykreslit.'));
    return () => { alive = false; };
  }, [page]);

  return (
    <div className="relative aspect-[210/297] w-full bg-muted">
      <div ref={ref} />
      {failed && <p role="alert" className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-destructive">{failed}</p>}
    </div>
  );
}