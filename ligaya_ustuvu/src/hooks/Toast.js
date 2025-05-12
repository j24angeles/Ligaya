import { useEffect, useState } from 'react';

/**
 * Ultra-minimal single-line Toast component
 * @param {Object} props - Component props
 * @param {string} props.message - The message to display
 * @param {string} props.type - The type of toast (error, success, warning, info)
 * @param {boolean} props.show - Whether to show the toast
 * @param {function} props.onClose - Function to call when toast is closed
 * @param {number} props.duration - Duration in ms before auto-close (default: 3000)
 * @returns {JSX.Element}
 */
export default function Toast({ message, type = 'error', show, onClose, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, onClose, duration]);

  if (!show) return null;

  const alertClass = {
    error: 'bg-red-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };
  
  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`rounded-full shadow-md ${alertClass[type]} px-8 py-2 text-center whitespace-nowrap`}>
        <span className="text-white font-normal text-sm">{message}</span>
      </div>
    </div>
  );
}