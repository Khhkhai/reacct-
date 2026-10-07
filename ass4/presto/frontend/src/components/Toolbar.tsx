import React, { useState, useRef } from "react";
import { Button } from "./Button";
import { ShapeOptions } from "./ToolbarOptions/ShapeOptions";
import { TextOptions } from "./ToolbarOptions/TextOptions";
import { ImageSourceInput } from "./InputFields/ImageSourceInput";
import { Input } from "./InputFields/Input";
import { Modal } from "./Modal";
import { fileToDataUrl } from "../utils/file";
import { ImageOptions } from "./ToolbarOptions/ImageOptions";
import { Checkbox } from "./InputFields/Checkbox";
import { VideoOptions } from "./ToolbarOptions/VideoOptions";
import { CodeOptions } from "./ToolbarOptions/CodeOptions";
import type { useElements } from "../hooks/useElement";
import type { FileInputHandle } from "./InputFields/FileInput";
import type { Background, CodeElementType, VideoElementType, ImageSource } from "../data"
import { ThemeModal } from "./Modals/ThemeModal";

type ToolbarProps = {
    elements: ReturnType<typeof useElements>;
    setDefaultBackground: (_bg: Background) => Promise<void | null>;
}

export const Toolbar = ({elements, setDefaultBackground}: ToolbarProps) => {
  // Image Element States
  const [createImageModalOpen, setCreateImageModalOpen] = useState(false);
  const [imageWidth, setImageWidth] = useState('');
  const [imageHeight, setImageHeight] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const fileInputRef = useRef<FileInputHandle>(null);
  const [imageSource, setImageSource] = useState<ImageSource>({ type: "file", url: "", file: null});

  // Video Element States
  const [createVideoModalOpen, setCreateVideoModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoWidth, setVideoWidth] = useState('');
  const [videoHeight, setVideoHeight] = useState('');
  const [autoplay, setAutoplay] = useState(false);

  // Coode Element States
  const [createCodeModalOpen, setCreateCodeModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [codeWidth, setCodeWidth] = useState('');
  const [codeHeight, setCodeHeight] = useState('');
  const [codeFontSize, setCodeFontSize] = useState('');

  // Background Image  States
  const [createThemeModalOpen, setCreateThemeModalOpen] = useState(false);

  const commonProps = {
    width: elements.width,
    setWidth: elements.setWidth,
    height: elements.height,
    setHeight: elements.setHeight,
    posX: elements.posX,
    setPosX: elements.setPosX,
    posY: elements.posY,
    setPosY: elements.setPosY,
    selectedElement: elements.selectedElement,
  };

  const resetImageForm = () => {
    setImageWidth('');
    setImageHeight('');
    setImageDescription('');
    setImageSource({
      type: "file",
      url: "",
      file: null,
    });
    fileInputRef.current?.reset();
  };

  const resetVideoForm = () => {
    setVideoUrl('');
    setVideoWidth('');
    setVideoHeight('');
    setAutoplay(false);
  };

  const resetCodeForm = () => {
    setCode('');
    setCodeWidth('');
    setCodeHeight('');
    setCodeFontSize('');
  };


  const getImageSrc = async (imageSource: ImageSource): Promise<string> => {
    if (imageSource.type === "file" && imageSource.file) {
      return await fileToDataUrl(imageSource.file) as string;
    }
    if (imageSource.type === "url" && imageSource.url.trim()) {
      return imageSource.url;
    }
    return "";
  };

  const handleCreateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    const src = await getImageSrc(imageSource);
    elements.createImage(src, imageDescription, imageWidth, imageHeight);
    setCreateImageModalOpen(false);
    resetImageForm();
  };

  const handleUpdateImage = async () => {
    const src = await getImageSrc(imageSource);
    if (!src) return;
    elements.updateImage(src);
    resetImageForm();
  };

  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;
    elements.createVideo(videoUrl.trim(), videoWidth, videoHeight, autoplay);
    setCreateVideoModalOpen(false);
    resetVideoForm();
  };

  const handleCreateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    elements.createCode(code.trim(), codeWidth, codeHeight, codeFontSize);
    setCreateCodeModalOpen(false);
    resetCodeForm();
  };

  const renderTypeOptions = () => {
    const el = elements.selectedElement;
    if (!el) return null;

    switch (el.type) {
    case 'rectangle':
      return (
        <ShapeOptions 
          key={el.id}
          {...commonProps} 
          selectedElement={el} 
        />
      );

    case 'text':
      return (
        <TextOptions
          key={el.id}
          {...commonProps}
          selectedElement={el}
          fontSize={elements.fontSize}
          setFontSize={elements.setFontSize}
          fontFamily={elements.fontFamily}
          setFontFamily={elements.setFontFamily}
          color={elements.color}
          setColor={elements.setColor}
        />
      );

    case 'image':
      return (
        <ImageOptions
          key={el.id}
          {...commonProps}
          selectedElement={el}
          imageSource={imageSource}
          setImageSource={setImageSource}
          imageDescription={imageDescription}
          setImageDescription={setImageDescription}
          handleUpdateImage={handleUpdateImage}
        />
      );

    case 'video':
      return (
        <VideoOptions
          key={el.id}
          {...commonProps}
          selectedElement={el as VideoElementType}
          videoUrl={videoUrl}
          setVideoUrl={setVideoUrl}
          autoplay={autoplay}
          setAutoplay={setAutoplay}
          handleUpdateVideo={() => elements.updateVideo(videoUrl, autoplay)}
        />
      );

    case 'code':
      return (
        <CodeOptions
          key={el.id}
          {...commonProps}
          selectedElement={el as CodeElementType}
          code={code}
          setCode={setCode}
          fontSize={codeFontSize}
          setFontSize={setCodeFontSize}
          handleUpdateCode={() => elements.updateCode(code, codeFontSize)}
        />
      );

    default:
      return null;
    }
  }

  return (
    <div className="flex flex-col border w-full md:w-64 gap-3 rounded-lg p-3 bg-base-200 overflow-auto">
      <Button name="theme" onClick={() => setCreateThemeModalOpen(true)} className="w-full aspect-square rounded-lg">Theme</Button>

      <div className="grid grid-cols-3 md:grid-cols-2 gap-3 w-full">
        <Button name="shape" onClick={elements.createRect} className="w-full aspect-square rounded-lg">Shape</Button>
        <Button name="text" onClick={elements.createText} className="w-full aspect-square rounded-lg">Text</Button>
        <Button name="image" onClick={() => setCreateImageModalOpen(true)} className="w-full aspect-square rounded-lg">Image</Button>
        <Button name="video" onClick={() => setCreateVideoModalOpen(true)} className="w-full aspect-square rounded-lg">Video</Button>
        <Button name="code" onClick={() => setCreateCodeModalOpen(true)} className="w-full aspect-square rounded-lg">Code</Button>
      </div>

      {elements.selectedElement && (
        <div className="flex flex-col gap-2">
          {renderTypeOptions()}
          <Button name="save" onClick={() => { elements.updateElement(); } }>Save</Button>
          <div className="flex items-center gap-2">
            <span className="text-sm w-12">Layer</span>
            <Button name="move-up" aria-label="Move element up" onClick={() => elements.moveUpDown('up')}>^</Button>
            <Button name="move-down" aria-label="Move element down" onClick={() => elements.moveUpDown('down')}>v</Button>
          </div>
        </div>
      )}

      <Modal open={createImageModalOpen} onClose={() => { setCreateImageModalOpen(false); resetImageForm(); }} title="Add Image">
        <form onSubmit={handleCreateImage} className="flex flex-col gap-4">
          <ImageSourceInput
            value={imageSource}
            onChange={setImageSource}
            ref={fileInputRef}
          />
          <Input name="description" id="description" label="Description" type="text" value={imageDescription} onChange={setImageDescription} required={true}/>
          <Input name="imageWidth" id="imageWidth" label="Width" type="number" value={imageWidth} onChange={setImageWidth} required={true} min={0} max={100}/>
          <Input name="imageHeight" id="imageHeight" label="Height" type="number" value={imageHeight} onChange={setImageHeight} required={true} min={0} max={100}/>
          <div className="flex justify-end gap-2">
            <Button name="cancel" type="button" onClick={() => { setCreateImageModalOpen(false); resetImageForm(); }}>Cancel</Button>
            <Button name="create" type="submit">Create</Button>
          </div>
        </form>
      </Modal>

      <Modal open={createVideoModalOpen} onClose={() => { setCreateVideoModalOpen(false); resetVideoForm(); }} title="Add Video">
        <form onSubmit={handleCreateVideo} className="flex flex-col gap-4">
          <Input name="url" id="url" label="Url" type="text" value={videoUrl} onChange={setVideoUrl} required={true}/>
          <Input name="videoWidth" id="videoWidth" label="Width" type="number" value={videoWidth} onChange={setVideoWidth} required={true} min={0} max={100}/>
          <Input name="videoHeight" id="videoHeight" label="Height" type="number" value={videoHeight} onChange={setVideoHeight} required={true} min={0} max={100}/>
          <Checkbox name="autoplay" id="autoplay" label="Autoplay" checked={autoplay} onChange={setAutoplay} className="toggle"/>

          <div className="flex justify-end gap-2">
            <Button name="cancel" type="button" onClick={() => { setCreateVideoModalOpen(false); resetVideoForm(); }}>Cancel</Button>
            <Button name="create" type="submit">Create</Button>
          </div>
        </form>
      </Modal>

      <Modal open={createCodeModalOpen} onClose={() => { setCreateCodeModalOpen(false); resetCodeForm(); }} title="Add Code">
        <form onSubmit={handleCreateCode} className="flex flex-col gap-4">          
          <Input name="codeWidth" id="codeWidth" label="Width" type="number" value={codeWidth} onChange={setCodeWidth} required={true} min={0} max={100}/>
          <Input name="codeHeight" id="codeHeight" label="Height" type="number" value={codeHeight} onChange={setCodeHeight} required={true} min={0} max={100}/>
          <Input name="codeFontSize" id="codeFontSize" label="Font Size" type="number" value={codeFontSize} onChange={setCodeFontSize} required={true} min={0} max={100}/>
          <div className="flex flex-col gap-1">
            <label className="text-sm">Code</label>
            <textarea
              className="textarea w-full font-mono h-48"
              placeholder="Paste your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ whiteSpace: 'pre', fontFamily: 'monospace' }}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button name="cancel" type="button" onClick={() => { setCreateCodeModalOpen(false); resetCodeForm(); }}>Cancel</Button>
            <Button name="create" type="submit">Create</Button>
          </div>
        </form>
      </Modal>
      <ThemeModal
        open={createThemeModalOpen}
        onClose={() => setCreateThemeModalOpen(false)}
        onSubmit={setDefaultBackground}
        setDefaultBackground={setDefaultBackground}
        getImageSrc={getImageSrc}
      />
    </div>
  );
};