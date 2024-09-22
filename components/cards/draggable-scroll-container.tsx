/* eslint-disable react/no-array-index-key */
/* eslint-disable react/require-default-props */

'use client';

import React, { useState, forwardRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { SwiperOptions, Swiper as SwiperType } from 'swiper/types';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// Types

interface NavigationButtonProps {
  direction: 'left' | 'right';
  className?: string;
  initial?: string;
  animate?: string;
  exit?: string;
  onClick?: () => void;
}

const NavigationButton = forwardRef<HTMLDivElement, NavigationButtonProps>(
  function NavigationButton({ direction, className, ...motionProps }, ref) {
    const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
    const variants = {
      hidden: {
        opacity: 0,
        x: direction === 'left' ? -20 : 20,
        scale: 0.8,
      },
      visible: {
        opacity: 1,
        x: 0,
        scale: 1,
      },
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'absolute -top-0 z-50 flex h-full',
          direction === 'left'
            ? 'left-0 bg-gradient-to-r'
            : 'right-0 bg-gradient-to-l',
          'from-background to-transparent',
          className
        )}
        variants={variants}
        transition={{ duration: 0.2 }}
        {...motionProps}
      >
        <button type="button" className="rounded-full p-2 text-foreground">
          <Icon size={24} />
        </button>
      </motion.div>
    );
  }
);

NavigationButton.displayName = 'NavigationButton';

interface NavigationButtonsProps {
  isHovered: boolean;
  showLeftNav: boolean;
  showRightNav: boolean;
  onPrevClick: () => void;
  onNextClick: () => void;
}

function NavigationButtons({
  isHovered,
  showLeftNav,
  showRightNav,
  onPrevClick,
  onNextClick,
}: NavigationButtonsProps): JSX.Element {
  return (
    <>
      <AnimatePresence>
        {isHovered && showLeftNav && (
          <NavigationButton
            direction="left"
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="cursor-pointer"
            onClick={onPrevClick}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isHovered && showRightNav && (
          <NavigationButton
            direction="right"
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="cursor-pointer"
            onClick={onNextClick}
          />
        )}
      </AnimatePresence>
    </>
  );
}

interface DraggableScrollContainerProps {
  children: React.ReactNode;
  swiperOptions?: SwiperOptions;
}

function useSwiperConfig(swiperOptions: SwiperOptions): SwiperOptions {
  return {
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      640: {
        slidesPerView: 4,
        spaceBetween: 15,
      },
      1020: {
        slidesPerView: 8,
        spaceBetween: 20,
      },
    },
    slidesPerView: 8,
    spaceBetween: 20,
    ...swiperOptions,
  };
}

function DraggableScrollContainer({
  children,
  swiperOptions = {},
}: DraggableScrollContainerProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const [showLeftNav, setShowLeftNav] = useState(false);
  const [showRightNav, setShowRightNav] = useState(true);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  const defaultSwiperOptions = useSwiperConfig(swiperOptions);

  const handlePrev = () => swiper?.slidePrev();
  const handleNext = () => swiper?.slideNext();

  return (
    <div
      className="relative overflow-hidden scrollbar-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Swiper
        {...defaultSwiperOptions}
        modules={[Navigation]}
        onSwiper={setSwiper}
        onSlideChange={(swi) => {
          setShowLeftNav(!swi.isBeginning);
          setShowRightNav(!swi.isEnd);
        }}
        onReachBeginning={() => setShowLeftNav(false)}
        onReachEnd={() => setShowRightNav(false)}
      >
        {React.Children.map(children, (child, index) => (
          <SwiperSlide key={index}>{child}</SwiperSlide>
        ))}
      </Swiper>
      <NavigationButtons
        isHovered={isHovered}
        showLeftNav={showLeftNav}
        showRightNav={showRightNav}
        onPrevClick={handlePrev}
        onNextClick={handleNext}
      />
    </div>
  );
}

export default DraggableScrollContainer;
