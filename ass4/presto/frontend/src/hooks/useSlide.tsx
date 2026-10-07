import { useState, useEffect } from "react";
import { createSlide, deleteSlide } from "../api/store";
import { useErrorModal } from "../utils/useErrorModal";
import type { SlideType } from "../data";

type LoadResponse = {
    slides: SlideType[];
};

const createId = () => Date.now().toString();

export const useSlides = (load: () => Promise<LoadResponse | null>, index: number, id?: string) => {
  const { showError } = useErrorModal();
  const [slides, setSlides] = useState<SlideType[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(index);

  const isFirst = currentSlideIndex <= 0;
  const isLast = slides.length === 0 || currentSlideIndex >= slides.length - 1;

  useEffect(() => {
    if (!id) {
      showError("Invalid presentation ID");
      return;
    }
    load().then(data => {
      if (!data) return;
      setSlides(data.slides ?? []);
    });
  }, [id]);

  useEffect(() => {
    setCurrentSlideIndex(Math.max(0, index - 1));
  }, [index]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setCurrentSlideIndex(prev => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex(prev => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  const handleLeftArrow = () => setCurrentSlideIndex(prev => Math.max(prev - 1, 0));
  const handleRightArrow = () => setCurrentSlideIndex(prev => Math.min(prev + 1, slides.length - 1));

  const handleCreateSlide = async () => {
    if (!id) {
      showError("Invalid presentation ID");
      return null;
    }
    const newSlide = await createSlide(id, createId());
    setSlides(prev => {
      const updated = [...prev, newSlide];
      setCurrentSlideIndex(updated.length - 1);
      return updated;
    });
  };

  const handleDeleteSlide = async () => {
    if (!id) {
      showError("Invalid presentation ID");
      return null;
    }
    if (slides.length <= 1) {
      showError("You cannot delete the only slide. Delete the presentation instead.");
      return;
    }
    const slideId = slides[currentSlideIndex].id;
    await deleteSlide(id, slideId);
    const updatedSlides = slides.filter(s => s.id !== slideId);
    setSlides(updatedSlides);
    setCurrentSlideIndex(prev => Math.min(prev, updatedSlides.length - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index);
  };
  return {
    slides, setSlides,
    currentSlideIndex, setCurrentSlideIndex,
    isFirst, isLast,
    handleLeftArrow, handleRightArrow,
    handleCreateSlide, handleDeleteSlide,
    goToSlide
  };
};