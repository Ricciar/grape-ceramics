import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface OrderRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderRequestModal: React.FC<OrderRequestModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const isMounted = useRef(true);

  // Animation config
  const animationConfig = {
    appearDelay: 10,
    exitDuration: 400,
    overlayTransition: 'opacity duration-300 ease-in-out',
    modalTransition: 'opacity 0.4s ease-in-out',
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Fetch content when modal opens for the first time
  useEffect(() => {
    const fetchContent = async () => {
      if (isOpen && content === '' && !error) {
        try {
          setIsLoading(true);
          const abortController = new AbortController();

          const response = await axios.get('/api/pages?slug=orderforfragan', {
            signal: abortController.signal,
          });

          if (isMounted.current && response.data && response.data.length > 0) {
            setContent(response.data[0]?.content?.rendered || '');
          } else if (
            isMounted.current &&
            (!response.data || response.data.length === 0)
          ) {
            setError(true);
            setContent(
              '<p>Ingen information hittades. Vänligen kontakta kundtjänst.</p>'
            );
          }

          return () => {
            abortController.abort();
          };
        } catch (error) {
          if (isMounted.current) {
            console.error('Error fetching order request content:', error);
            setError(true);
            setContent(
              '<p>Det gick inte att ladda innehållet. Vänligen försök igen senare.</p>'
            );
          }
        } finally {
          if (isMounted.current) {
            setIsLoading(false);
          }
        }
      }
    };

    fetchContent();
  }, [isOpen, content, error]);

  // Handle opening and closing animations
  useEffect(() => {
    if (isOpen) {
      // Step 1: Start displaying the element
      setIsAnimating(true);
      setIsVisible(false);

      // Step 2: Short delay to ensure DOM has updated
      const showTimer = setTimeout(() => {
        setIsVisible(true);
      }, animationConfig.appearDelay);

      return () => clearTimeout(showTimer);
    } else if (isAnimating) {
      // Step 1: Start exit animation
      setIsVisible(false);

      // Step 2: Wait until animation completes
      const hideTimer = setTimeout(() => {
        setIsAnimating(false);
      }, animationConfig.exitDuration);

      return () => clearTimeout(hideTimer);
    }
  }, [
    isOpen,
    isAnimating,
    animationConfig.appearDelay,
    animationConfig.exitDuration,
  ]);

  // When modal is open, prevent body scrolling
  useEffect(() => {
    if (isOpen) {
      // Save the current overflow value
      const originalOverflow = document.body.style.overflow;
      // Lock scrolling
      document.body.style.overflow = 'hidden';

      // Restore original overflow on cleanup
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isAnimating) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-request-title"
    >
      {/* Background overlay */}
      <div
        className={`fixed inset-0 bg-black transition-${animationConfig.overlayTransition}`}
        style={{ opacity: isVisible ? 0.5 : 0 }}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Modal content */}
      <div
        className="relative w-[calc(100%-16px)] max-w-lg bg-white shadow-lg rounded-lg mx-2"
        style={{
          maxHeight: '85vh',
          opacity: isVisible ? 1 : 0,
          transition: animationConfig.modalTransition,
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-3 sm:px-4 py-3 sm:py-4 border-b">
          <h2
            id="order-request-title"
            className="text-base sm:text-lg font-light tracking-[2.5px] sm:tracking-[2.85px]"
          >
            ORDERFÖRFRÅGAN
          </h2>
          <button
            className="p-1 sm:p-2 text-xl sm:text-2xl"
            onClick={onClose}
            aria-label="Stäng orderförfrågan"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div
          className="px-3 sm:px-4 py-3 sm:py-4 overflow-y-auto"
          style={{ maxHeight: 'calc(85vh - 130px)' }}
        >
          {isLoading ? (
            <div className="flex justify-center py-6 sm:py-8">
              <div className="animate-pulse flex space-x-3 sm:space-x-4">
                <div className="flex-1 space-y-3 sm:space-y-4 py-1">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="font-light tracking-[1.5px] sm:tracking-[1.8px] text-sm sm:text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-3 sm:px-4 py-3 sm:py-4 border-t">
          <button
            className="w-full bg-black text-white py-2 text-sm sm:text-base font-light tracking-[2.5px] sm:tracking-[2.85px]"
            onClick={onClose}
          >
            STÄNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderRequestModal;
