import axios from "axios";
import { BACKEND_PORT } from "../../backend.config.json";
import type { PresentationType, SlideType, SlideElementType } from "../data"

const BASE_URL = `http://localhost:${BACKEND_PORT}`;

type Store = Record<string, PresentationType>;

export const getStore = async (): Promise<Store> => {
  const res = await axios.get(BASE_URL + '/store', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return res.data.store || {};
};

export const updateStore = async (newData: Store): Promise<void> => {
  await axios.put(BASE_URL + '/store', { store: newData }, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

export const getPresentation = async (id: string): Promise<PresentationType> => {
  const store = await getStore();
  return { ...store[id] };
};

export const createPresentation = async (data: PresentationType): Promise<void> => {
  const store = await getStore();
  store[data.id] = data;
  await updateStore(store);
};

export const deletePresentation = async (id: string): Promise<void> => {
  const store = await getStore();
  delete store[id];
  await updateStore(store);
};

export const updatePresentationField = async (
  id: string,
  field: keyof PresentationType,
  value: PresentationType[keyof PresentationType]
): Promise<void> => {
  const store = await getStore();
  store[id] = { ...store[id], [field]: value };
  await updateStore(store);
};

export const getSlide = async (
  presentationId: string, 
  slideId: string
): Promise<SlideType | undefined> => {
  const presentation = await getPresentation(presentationId);
  return presentation.slides.find((s) => s.id === slideId);
};

export const createSlide = async (
  presentationId: string, 
  slideId: string
): Promise<SlideType> => {
  const presentation = await getPresentation(presentationId);
  const newSlide: SlideType = { id: slideId, elements: []};
  const updatedSlides = [...(presentation.slides || []), newSlide];
  await updatePresentationField(presentationId, "slides", updatedSlides);
  return newSlide;
};

export const updateSlide = async (
  presentationId: string, 
  slide: SlideType
): Promise<void> => {
  const presentation = await getPresentation(presentationId);
  const updatedSlides = presentation.slides.map((s) =>
    s.id === slide.id ? slide : s
  );
  await updatePresentationField(presentationId, "slides", updatedSlides);
};

export const deleteSlide = async (
  presentationId: string, 
  slideId: string
): Promise<void> => {
  const presentation = await getPresentation(presentationId);
  const updatedSlides = presentation.slides.filter((s) => s.id !== slideId);
  await updatePresentationField(presentationId, "slides", updatedSlides);
};

export const createElement = async (
  presentationId: string,
  slideId: string,
  element: SlideElementType
): Promise<void> => {
  const presentation = await getPresentation(presentationId);
  const updatedSlides = presentation.slides.map((s) =>
    s.id === slideId
      ? { ...s, elements: [...s.elements, element] }
      : s
  );
  await updatePresentationField(presentationId, "slides", updatedSlides);
};