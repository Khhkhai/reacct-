import { useState } from "react";
import { createElement, updateSlide } from "../api/store";
import { detectLanguage } from "../utils/detectLanguage";
import { useErrorModal } from "../utils/useErrorModal";
import type { SlideType, SlideElementType } from "../data";

type UpdateSlides = (_updater: (_prev: SlideType[]) => SlideType[]) => void;

const createId = () => Date.now().toString();

export const useElements = (
  slides: SlideType[],
  currentSlideIndex: number,
  setSlides: UpdateSlides,
  presentationId?: string, 
) => {
  const { showError } = useErrorModal(); 
  const [height, setHeight] = useState('0');
  const [width, setWidth] = useState('0');
  const [posX, setPosX] = useState('0');
  const [posY, setPosY] = useState('0');
  const [fontSize, setFontSize] = useState('1');
  const [fontFamily, setFontFamily] = useState('1');
  const [color, setColor] = useState('#000000');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const selectedElement: SlideElementType | null = selectedElementId
    ? slides[currentSlideIndex]?.elements.find((e: SlideElementType) => e.id === selectedElementId) ?? null
    : null;

  const getCurrentSlide = () => slides[currentSlideIndex];

  const applyUpdate = async ( updated: SlideElementType, slide: SlideType) => {
    if (!presentationId) {
      showError("Invalid presentation ID");
      return null;
    }
    const updatedSlide: SlideType = {
      ...slide,
      elements: slide.elements.map(e =>
        e.id === updated.id ? updated : e
      )
    };
    setSlides(prev =>
      prev.map(s => (s.id === slide.id ? updatedSlide : s))
    );
    await updateSlide(presentationId, updatedSlide);
  };

  const handleSelectElement = (el: SlideElementType | null) => {
    setSelectedElementId(el?.id ?? null);
    if (!el) return;

    setWidth(el.width.toString());
    setHeight(el.height.toString());
    setPosX(el.x.toString());
    setPosY(el.y.toString());
    if (el.type === 'text') {
      setFontSize(el.fontSize.toString());
      setColor(el.color);
    }
    if (el.type === 'code') {
      setFontSize(el.fontSize.toString());
    }
  };

  const createElementBase = async ( element: SlideElementType) => {
    if (!presentationId) {
      showError("Invalid presentation ID");
      return null;
    }
    const slide = getCurrentSlide();
    if (!slide) return;

    await createElement(presentationId, slide.id, element);
    setSelectedElementId(element.id);

    setSlides(prev =>
      prev.map(s => s.id === slide.id ? { ...s, elements: [...s.elements, element] } : s)
    );
  };

  // Create Element and store in database
  const createRect = () =>
    createElementBase({
      id: createId(),
      type: 'rectangle',
      x: 0,
      y: 0,
      width: 20,
      height: 20,
      fill: "orange",
    });

  const createText = () =>
    createElementBase({
      id: createId(),
      type: 'text',
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      text: "Add text",
      fontFamily: 'Arial',
      fontSize: 1,
      color: "black",
    });

  const createImage = ( src: string, alt: string, w: string, h: string) =>
    createElementBase({
      id: createId(),
      type: 'image',
      x: 0,
      y: 0,
      width: Number(w),
      height: Number(h),
      src,
      alt,
    });

  const createVideo = ( src: string, w: string, h: string, autoplay: boolean) =>
    createElementBase({
      id: createId(),
      type: 'video',
      x: 0,
      y: 0,
      width: Number(w),
      height: Number(h),
      src,
      autoplay,
    });

  const createCode = ( code: string, w: string, h: string, fs: string) =>
    createElementBase({
      id: createId(),
      type: 'code',
      x: 0,
      y: 0,
      width: Number(w),
      height: Number(h),
      fontSize: Number(fs),
      code,
      language: detectLanguage(code),
    });

  // Update Element and store in database
  const updateElement = async () => {
    const slide = getCurrentSlide();
    if (!slide || !selectedElement) return;
    console.log("updating element", selectedElement.id, { width, height, posX, posY, fontSize, fontFamily, color });
    const base = {
      width: Number(width),
      height: Number(height),
      x: Number(posX),
      y: Number(posY),
    };

    let updated: SlideElementType;
    switch (selectedElement.type) {
    case "rectangle":
      updated = { ...selectedElement, ...base};
      break;
    case "text":
      updated = { ...selectedElement, ...base, fontFamily: fontFamily, fontSize: Number(fontSize), color};
      break;
    case "image":
      updated = { ...selectedElement, ...base};
      break;
    case "video":
      updated = { ...selectedElement, ...base};
      break;
    case "code":
      updated = { ...selectedElement, ...base};
      break;
    default:
      return;
    }
    await applyUpdate(updated, slide);
  };

  const updateTextElement = async ( elId: string, text: string) => {
    const slide = getCurrentSlide();
    if (!slide) return;

    const el = slide.elements.find(e => e.id === elId && e.type === "text");
    if (!el) return;

    const updated = { ...el, text };
    await applyUpdate(updated, slide);
  };

  const updateImage = async (src: string) => {
    const slide = getCurrentSlide();
    if (!slide || !selectedElement || selectedElement.type !== "image") return;
    await applyUpdate({ ...selectedElement, src }, slide);
  };

  const updateVideo = async ( src: string, autoplay: boolean) => {
    const slide = getCurrentSlide();
    if (!slide || !selectedElement || selectedElement.type !== "video") return;
    await applyUpdate({ ...selectedElement, src, autoplay }, slide);
  };

  const updateCode = async ( code: string, fontSize: string) => {
    const slide = getCurrentSlide();
    if (!slide || !selectedElement || selectedElement.type !== 'code') return;

    await applyUpdate({
      ...selectedElement,
      code,
      fontSize: Number(fontSize),
      language: detectLanguage(code),
    }, slide);
  };
  
  const deleteElement = async (elId: string) => {
    if (!presentationId) {
      showError("Invalid presentation ID");
      return null;
    }
    const slide = slides[currentSlideIndex];
    if (!slide) return;
    
    const updatedSlide = {
      ...slide,
      elements: slide.elements.filter((e: SlideElementType) => e.id !== elId),
    };
    setSlides(prev => prev.map((s: SlideType) => s.id === slide.id ? updatedSlide : s));
    await updateSlide(presentationId, updatedSlide);
    if (selectedElementId === elId) setSelectedElementId(null);
  };

  const moveUpDown = async (direction: 'up' | 'down') => {
    if (!presentationId) {
      showError("Invalid presentation ID");
      return null;
    }
    const slide = getCurrentSlide();
    if (!slide || !selectedElement) return;

    const elements = [...slide.elements];
    const index = elements.findIndex(e => e.id === selectedElement.id);
    const swapIndex = direction === 'up' ? index + 1 : index - 1;
    if (swapIndex < 0 || swapIndex >= elements.length) return;

    [elements[index], elements[swapIndex]] = [elements[swapIndex], elements[index]];
    const updatedSlide = { ...slide, elements };
    setSlides(prev => prev.map(s => (s.id === slide.id ? updatedSlide : s)));
    await updateSlide(presentationId, updatedSlide);
  };

  return {
    width, setWidth,
    height, setHeight,
    posX, setPosX,
    posY, setPosY,
    fontSize, setFontSize,
    fontFamily, setFontFamily,
    color, setColor,
    selectedElement,
    handleSelectElement,
    createRect,
    createText,
    createImage,
    createVideo,
    createCode,
    updateTextElement,
    updateElement,
    updateImage,
    updateVideo,
    updateCode,
    deleteElement,
    moveUpDown
  };
};