import { Input } from "../InputFields/Input";
import { ImageSourceInput } from "../InputFields/ImageSourceInput";
import { Button } from "../Button";
import { ShapeOptions } from "./ShapeOptions";
import type { ImageElementType, ImageSource } from "../../data"

type ImageOptionsProps = {
    width: string; setWidth: (_width: string) => void;
    height: string; setHeight: (_height: string) => void;
    posX: string; setPosX: (_posX: string) => void;
    posY: string; setPosY: (_posY: string) => void;
    selectedElement: ImageElementType;
    imageSource: ImageSource; setImageSource: (_val: ImageSource) => void;
    imageDescription: string; setImageDescription: (_imageDes: string) => void;
    handleUpdateImage: () => void;
}

export const ImageOptions = (props: ImageOptionsProps) => {
  return (
    <div className="flex flex-col gap-2">
      <ShapeOptions
        width={props.width} setWidth={props.setWidth}
        height={props.height} setHeight={props.setHeight}
        posX={props.posX} setPosX={props.setPosX}
        posY={props.posY} setPosY={props.setPosY}
        selectedElement={props.selectedElement}
      />
      <div className="flex gap-1 flex-col">
        <span className="text-sm w-12">Description</span>
        <Input 
          name=""
          type="text" 
          id={`alt-${props.selectedElement.id}`} 
          value={props.imageDescription}
          onChange={(val) => props.setImageDescription(val)} 
          label=""
        />
      </div>

      <ImageSourceInput
        value={props.imageSource}
        onChange={props.setImageSource}
      />
      <Button name="update-image" onClick={props.handleUpdateImage} className="btn-xs">Update Image</Button>
    </div>
  )
}