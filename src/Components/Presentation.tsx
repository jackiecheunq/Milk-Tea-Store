import React from "react";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import Button from "./uiComponents/Button";

type slideInfo = {
  slideInfo: {
    title: string;
    slides: Array<{
      id: string;
      caption: string;
      caption2?: string;
      additionalLink?: string;
      photoUrl: string;
      backgroundColor: string;
    }>;
  };
};

const Presentation: React.FC<slideInfo> = (props) => {
  const scrollContainerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: scrollContainerRef });

  const slideNumber = props.slideInfo.slides.length;

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const useParallax = (
    slideNumber: number,
    value: MotionValue<number>,
    slideIndex: number,
    distance = 700
  ) => {
    const startPoint = (1 / slideNumber) * slideIndex;

    const translateY = useTransform(
      value,
      [startPoint, startPoint + 1 / slideNumber],
      [-distance, 0]
    );
    const opacity = useTransform(
      value,
      [startPoint, startPoint + 1 / slideNumber],
      [0, 1]
    );

    const zIndex = useTransform(
      value,
      [startPoint, startPoint + 1 / slideNumber],
      [-1, 10]
    );

    return { translateY, opacity, zIndex };
  };

  const adjustedUseParallax = useParallax.bind(
    null,
    slideNumber,
    scrollYProgress
  );

  const y = (slideIndex: number, noOpacity?: boolean) => {
    let motionStyle;
    if (noOpacity) {
      motionStyle = adjustedUseParallax(slideIndex, 1400);
      return { y: motionStyle.translateY, opacity: motionStyle.opacity };
    }
    motionStyle = adjustedUseParallax(slideIndex);
    return {
      y: motionStyle.translateY,
      opacity: motionStyle.opacity,
      zIndex: motionStyle.zIndex,
    };
  };

  const Slides = props.slideInfo.slides.map((info, index) => {
    const photo = (
      <motion.img
        className="max-h-[50rem] max-w-[50rem]"
        style={y(index, true)}
        src={info.photoUrl}
        alt={info.photoUrl}
      />
    );

    const caption = (
      <motion.div style={y(index)} className="p-10">
        <h1 className="text-8xl leading-normal">{info.caption}</h1>
        {info.caption2 && (
          <h2 className="text-4xl leading-normal">{info.caption2}</h2>
        )}
        {info.additionalLink && (
          <Button to={info.additionalLink}>產品詳情</Button>
        )}
      </motion.div>
    );

    let content;
    if (index % 2 === 0) {
      content = (
        <div key={info.id} className={`slide ${info.backgroundColor}`}>
          {caption}
          {photo}
        </div>
      );
    } else {
      content = (
        <div key={info.id} className={`slide ${info.backgroundColor}`}>
          <div className="w-5/6 h-4/6 flex justify-around items-center">
            {photo}
            {caption}
          </div>
        </div>
      );
    }
    return content;
  });

  return (
    <div className="grow w-full relative overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="w-full h-full overflow-scroll snap-y snap-mandatory flex flex-col scrollbar-hide scroll-smooth"
      >
        <div className="w-full h-full shrink-0 snap-center bg-purple-100  flex justify-center items-center snap-always">
          <h1 className="text-8xl font-['Anton']">{props.slideInfo.title}</h1>
        </div>
        {Slides}
      </div>
      <div className="h-14 sticky bottom-12 text-center">
        <h3>scroll to discover</h3>
        <i className="fa-solid fa-arrow-down"></i>
      </div>
      <div className="h-2 sticky bottom-0 bg-slate-200">
        <motion.div
          style={{ scaleX }}
          className="h-full sticky bottom-0 bg-purple-900 origin-left"
        >
          &nbsp;
        </motion.div>
      </div>
    </div>
  );
};

export default Presentation;
