import React, { useRef, useState } from "react";
import { Button } from "../Button";
import { ImageSourceInput } from "../InputFields/ImageSourceInput";
import { Modal } from "../Modal";
import type { FileInputHandle } from "../InputFields/FileInput";
import type { Background, BgType, ImageSource } from "../../data";


type ThemeModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (_bg: Background) => Promise<void | null>;
  setDefaultBackground: (_bg: Background) => Promise<void | null>;
  getImageSrc: (_source: ImageSource) => Promise<string | null>;
};

export const ThemeModal = (props: ThemeModalProps) => {
  const [bgType, setBgType] = useState<"solid" | "gradient" | "image">("solid");
  const [solidColor, setSolidColor] = useState("#ffffff");
  const [gradientFrom, setGradientFrom] = useState("#000000");
  const [gradientTo, setGradientTo] = useState("#ffffff");
  const fileInputRef = useRef<FileInputHandle>(null);
  const [bgImageSource, setBgImageSource] = useState<ImageSource>({ type: "file", url: "", file: null});

  const resetThemeForm = () => {
    setBgType('solid');
    setSolidColor('#ffffff');
    setGradientFrom('#000000');
    setGradientTo('#ffffff');  
    setBgImageSource({
      type: "file",
      url: "",
      file: null,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let bg: Background;
    const src = await props.getImageSrc(bgImageSource);
    switch (bgType) {
    case "solid":
      bg = { type: "solid", color: solidColor };
      break;

    case "gradient":
      bg = { type: "gradient", from: gradientFrom, to: gradientTo };
      break;

    case "image":
      if (!src) return;
      bg = { type: "image", src };
      break;

    default:
      bg = { type: "solid", color: "#ffffff" };
    }

    await props.setDefaultBackground(bg);
    props.onClose();
    resetThemeForm();
  }

  return (
    <Modal open={props.open} onClose={props.onClose} title="Add Image">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">          
        <select value={bgType} onChange={(e) => setBgType(e.target.value as BgType)}>
          <option value="solid">Solid</option>
          <option value="gradient">Gradient</option>
          <option value="image">Image</option>
        </select>

        {bgType === "solid" && (
          <input type="color" value={solidColor} onChange={e => setSolidColor(e.target.value)} />
        )}

        {bgType === "gradient" && (
          <>
            <input type="color" value={gradientFrom} onChange={e => setGradientFrom(e.target.value)} />
            <input type="color" value={gradientTo} onChange={e => setGradientTo(e.target.value)} />
          </>
        )}

        {bgType === "image" && (
          <ImageSourceInput value={bgImageSource} onChange={setBgImageSource} ref={fileInputRef}/>
        )}

        <div className="flex justify-end gap-2">
          <Button name="cancel" type="button" onClick={props.onClose}>Cancel</Button>
          <Button name="create" type="submit">Create</Button>
        </div>
      </form>
    </Modal>
  );
};