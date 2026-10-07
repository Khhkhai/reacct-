import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Slide } from "../components/Slide";
import { useSlides } from "../hooks/useSlide";
import { usePresentation } from "../hooks/usePresentation";
import { Button } from "../components/Button";

export const PreviewPage = () => {
  const { id, slideIndex } = useParams();
  const navigate = useNavigate();

  const { presentation, load } = usePresentation(id);
  const slidesHook = useSlides(load, Number(slideIndex ?? 0), id);

  const {
    slides,
    currentSlideIndex,
    isFirst, isLast,
    handleLeftArrow, handleRightArrow,
  } = slidesHook;

  useEffect(() => {
    if (!id) return;
    navigate(`/preview/${id}/slide/${currentSlideIndex + 1}`, { replace: true });
  }, [currentSlideIndex]);

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="w-screen h-screen bg-black relative">
      <Slide
        slide={currentSlide}
        disabled={true}
        background={presentation?.defaultBackground}
      />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/60 px-6 py-2 rounded-full text-white">
        <p className="text-center text-sm text-gray-400">
            Slide {currentSlideIndex + 1} of {slides.length}
        </p>   
        <div className='flex flex-1 justify-end'>
          <Button name="previous-slide" onClick={handleLeftArrow} disabled={isFirst}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
          </Button>
          <Button name="next-slide" onClick={handleRightArrow} disabled={isLast}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
          </Button>
        </div>
      </div>
    </div>
  );
};