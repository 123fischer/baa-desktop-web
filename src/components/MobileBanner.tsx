'use client';

import React, { useState, useEffect } from 'react';

export const MobileBanner = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobileScreen = window.innerWidth < 768;
      setIsMobile(mobileScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white text-center p-3 z-50">
      <p className="text-sm md:text-base">Use Desktop</p>
    </div>
  );
};
