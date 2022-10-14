import React, { useState } from "react";
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
  const [isOnLastSlide, setisOnLastSlide] = useState(false);

  const { scrollYProgress } = useScroll({ container: scrollContainerRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const useParallax = (
    slideNumber: number,
    value: MotionValue<number>,
    slideIndex: number,
    distance: number = 700
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
    return { translateY, opacity };
  };

  const slideNumber = 3;

  const adjustedUseParallax = useParallax.bind(
    null,
    slideNumber,
    scrollYProgress
  );

  const y = (slideIndex: number, noOpacity?: boolean) => {
    let motionStyle;
    if (noOpacity) {
      motionStyle = adjustedUseParallax(slideIndex, slideNumber * 1100);
      return { y: motionStyle.translateY };
    }
    motionStyle = adjustedUseParallax(slideIndex);
    return { y: motionStyle.translateY, opacity: motionStyle.opacity };
  };

  const onScrollHandler = () => {
    if (scrollYProgress.get() > 0.99) {
      setisOnLastSlide(true);
    } else {
      setisOnLastSlide(false);
    }
  };

  const scrollArrowAnimationVariant = {
    y: [0, 5],
    x: 0,
    transition: {
      y: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  const Slides = props.slideInfo.slides.map((info, index) => {
    let photo = (
      <motion.img
        className="max-h-[50rem] max-w-[50rem]"
        style={y(index, true)}
        src={info.photoUrl}
        alt={info.photoUrl}
      />
    );

    let caption = (
      <motion.div style={y(index)}>
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
        <div
          key={index}
          className={`w-full h-full shrink-0 snap-center snap-always ${info.backgroundColor} flex justify-around items-center snap-alway`}
        >
          {caption}
          {photo}
        </div>
      );
    } else {
      content = (
        <div
          key={index}
          className={`w-full h-full shrink-0 snap-center snap-always ${info.backgroundColor} flex justify-around items-center snap-alway`}
        >
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
    <div className="grow w-full px-36 relative overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="w-full h-full overflow-scroll snap-y snap-mandatory flex flex-col scrollbar-hide"
        onScroll={onScrollHandler}
      >
        <div className="w-full h-full shrink-0 snap-center snap-always bg-purple-100  flex justify-center items-center">
          <h1 className="text-8xl font-['Anton']">{props.slideInfo.title}</h1>
        </div>
        {Slides}
      </div>
      <div className="h-14 sticky bottom-12 text-center">
        <h3>scroll to discover</h3>
        {isOnLastSlide ? (
          <motion.i
            className="fa-solid fa-arrow-up"
            animate={scrollArrowAnimationVariant}
          ></motion.i>
        ) : (
          <motion.i
            className="fa-solid fa-arrow-down"
            animate={scrollArrowAnimationVariant}
          ></motion.i>
        )}
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