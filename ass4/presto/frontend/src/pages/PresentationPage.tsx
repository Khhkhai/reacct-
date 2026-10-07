import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Modal } from "../components/Modal";
import { Input } from "../components/InputFields/Input";
import { FileInput, type FileInputHandle } from "../components/InputFields/FileInput";
import { Button } from "../components/Button";
import { Slide } from "../components/Slide";
import { usePresentation } from "../hooks/usePresentation";
import { useSlides } from "../hooks/useSlide";
import { useElements } from "../hooks/useElement";
import { ContextMenu } from "../components/ContextMenu";
import { Toolbar } from "../components/Toolbar";

export const PresentationPage = () => {
  const { id, slideIndex } = useParams();
  const navigate = useNavigate();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [titleModalOpen, setTitleModalOpen] = useState(false);
  const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; elementId: string } | null>(null);
  const fileInputRef = useRef<FileInputHandle>(null);
  const [viewSlideModalOpen, setViewSlideModalOpen] = useState(false);

  const index = Number(slideIndex ?? 0);

  const {
    presentation, load,
    name, setName,
    setThumbnail,
    handleDelete, handleTitle, handleThumbnail,
    setDefaultBackground
  } = usePresentation(id);

  const {
    slides, setSlides,
    currentSlideIndex,
    isFirst, isLast,
    handleLeftArrow, handleRightArrow,
    handleCreateSlide, handleDeleteSlide,
    goToSlide
  } = useSlides(load, index, id);

  const element = useElements(slides, currentSlideIndex, setSlides, id);
  const {
    handleSelectElement,
    updateTextElement,
    deleteElement,
  } = element

  useEffect(() => {
    navigate(`/presentation/${id}/slide/${currentSlideIndex + 1}`);
  }, [currentSlideIndex]);

  if (!id) return;

  return (
    <>
      <div className='h-screen flex flex-col'>
        <div className="h-14 bg-base-100 shadow flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button name="back" onClick={() => navigate('/dashboard')}>Back</Button>
            <h1 className="font-bold text-lg">{presentation?.name}</h1>
            <svg name="edit-name" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-5" onClick={() => setTitleModalOpen(true)}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            <div id="edit-thumbnail" onClick={() => setThumbnailModalOpen(true)} className='w-10 h-10 border'>
              {presentation?.thumbnail && (
                <img src={presentation.thumbnail} alt="Presentation thumbnail"/>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button name="preview" onClick={() => window.open(`/preview/${id}/slide/${currentSlideIndex + 1}`, '_blank')}>Preview</Button>

            <Button name="view-slides" onClick={() => setViewSlideModalOpen(true)}>View Slides</Button>

            <Button name="delete" onClick={() => setDeleteModalOpen(true)} aria-label="Delete presentation">Delete</Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden p-3 gap-3">
          <Toolbar elements={element} setDefaultBackground={setDefaultBackground}/>

          <div className='flex-[3] flex flex-col overflow-hidden p-4 gap-2'>
            <div className='flex-1 flex items-center justify-center min-h-0 px-4'>
              {slides.length > 0 ? (
                <div className='w-full aspect-video bg-white'>

                  <Slide
                    slide={slides[currentSlideIndex]}
                    background={presentation?.defaultBackground}
                    onDblClick={(el) => {handleSelectElement(el);}}
                    onContextMenu={(elId, x, y) => setContextMenu({ x, y, elementId: elId })}
                    onTextChange={(elId, text) => updateTextElement(elId, text)}
                    disabled={true}
                  />
                  {contextMenu && (
                    <ContextMenu
                      x={contextMenu.x}
                      y={contextMenu.y}
                      onDelete={() => {
                        deleteElement(contextMenu.elementId);
                        setContextMenu(null);
                      }}
                      onClose={() => setContextMenu(null)}
                    />
                  )}
                </div>
              ) : (
                <p className="text-center text-gray-400">No slides yet</p>
              )}
            </div>

            {slides.length > 0 && (
              <p className="text-center text-sm text-gray-400">
                    Slide {currentSlideIndex + 1} of {slides.length}
              </p>
            )}

            <div className="flex items-center">
              <div className="flex-1" />
              <div className="flex gap-2">
                <Button name="delete-slide" className="btn-circle" onClick={handleDeleteSlide}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                </Button>
                <Button name="create-slide" className="btn-circle" onClick={handleCreateSlide}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                </Button>
              </div>
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
        </div>
      </div>

      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete">
        <p>Are you sure?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button name="delete-no" onClick={() => setDeleteModalOpen(false)}>No</Button>
          <Button name="delete-yes" onClick={handleDelete}>Yes</Button>
        </div>
      </Modal>

      <Modal open={titleModalOpen} onClose={() => setTitleModalOpen(false)} title="Name">
        <Input id="name" name="name" label="Name" type="text" value={name} onChange={setName} required={true}/>
        <div className="flex justify-end gap-2 mt-4">
          <Button name="title-cancel" onClick={() => setTitleModalOpen(false)}>Cancel</Button>
          <Button name="title-confirm" onClick={() => handleTitle(() => setTitleModalOpen(false))}>Confirm</Button>
        </div>
      </Modal>

      <Modal open={thumbnailModalOpen} onClose={() => setThumbnailModalOpen(false)} title="Thumbnail">
        <FileInput name="thumbnail" ref={fileInputRef} id="thumbnail" label="Thumbnail" type="file" onChange={setThumbnail} accept="image/png, image/jpeg"/>
        <div className="flex justify-end gap-2 mt-4">
          <Button name="thumbnail-cancel" onClick={() => setThumbnailModalOpen(false)}>Cancel</Button>
          <Button name="thumbnail-confirm" onClick={() => handleThumbnail(() => setThumbnailModalOpen(false), fileInputRef)}>Confirm</Button>
        </div>
      </Modal>

      <Modal open={viewSlideModalOpen} onClose={() => setViewSlideModalOpen(false)} title="View Slides">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[70vh] overflow-y-auto mt-4">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className="cursor-pointer border p-2 rounded hover:bg-base-200"
              onClick={() => {goToSlide(i); setViewSlideModalOpen(false);}}
            >
              <div className="w-full aspect-video overflow-hidden rounded relative">
                <div
                  style={{
                    transform: "scale(0.2)",
                    transformOrigin: "top left",
                    width: "500%",
                    height: "500%",
                    pointerEvents: "none",
                  }}
                >
                  <Slide slide={slide} background={presentation?.defaultBackground} />
                </div>
              </div>
              <p className="text-xs text-center mt-1">Slide {i + 1}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button name="view-slides-cancel" onClick={() => setViewSlideModalOpen(false)}>Cancel</Button>
        </div>
      </Modal>
    </>
  );
};

