import { useEffect } from 'react';

/**
 * Toast notification component using DaisyUI
 * @param {Object} props - Component props
 * @param {string} props.message - The message to display
 * @param {string} props.type - The type of toast (error, success, warning, info)
 * @param {boolean} props.show - Whether to show the toast
 * @param {function} props.onClose - Function to call when toast is closed
 * @param {number} props.duration - Duration in ms before auto-close (default: 3000)
 * @returns {JSX.Element}
 */export default function Toast({ message, type = 'error', show, onClose, duration = 3000 }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, onClose, duration]);

  if (!show) return null;

  const alertClass = {
    error: 'alert-error',
    success: 'alert-success',
    warning: 'alert-warning',
    info: 'alert-info',
  };

  const iconSize = 'h-4 w-4';

  const alertIcon = {
    error: (
      <svg xmlns="http://www.w3.org/2000/svg" className={`stroke-current shrink-0 ${iconSize}`} fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg xmlns="http://www.w3.org/2000/svg" className={`stroke-current shrink-0 ${iconSize}`} fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg xmlns="http://www.w3.org/2000/svg" className={`stroke-current shrink-0 ${iconSize}`} fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className={`stroke-current shrink-0 ${iconSize}`}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    ),
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className={`alert ${alertClass[type]} shadow-md px-3 py-2 text-sm`}>
        <div className="flex items-center gap-2">
          {alertIcon[type]}
          <span>{message}</span>
        </div>
        <button onClick={onClose} className="btn btn-xs btn-ghost ml-2">✕</button>
      </div>
    </div>
  );
}
