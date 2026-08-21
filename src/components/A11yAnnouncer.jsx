import React, { useEffect, useState } from 'react';

/**
 * Accessibility: ARIA Live Region Announcer
 * For announcements to screen readers without visual changes
 */
export function A11yAnnouncer() {
  const [announcement, setAnnouncement] = useState('');

  // Expose global function for page to announce
  useEffect(() => {
    window.announce = (message) => {
      setAnnouncement(message);
      // Clear after announcement
      setTimeout(() => setAnnouncement(''), 3000);
    };

    return () => {
      delete window.announce;
    };
  }, []);

  return (
    <div
      className="sr-only"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {announcement}
    </div>
  );
}

export default A11yAnnouncer;
