import type { TextElementType } from "../../data";
import { Input } from "../InputFields/Input";
import { ShapeOptions } from "./ShapeOptions";

type TextOptionsProps = {
    width: string; setWidth: (_width: string) => void;
    height: string; setHeight: (_height: string) => void;
    posX: string; setPosX: (_posX: string) => void;
    posY: string; setPosY: (_posY: string) => void;
    selectedElement: TextElementType;
    fontFamily: string; setFontFamily: (_fontFamily: string) => void;
    fontSize: string; setFontSize: (_fontSize: string) => void;
    color: string; setColor: (_color: string) => void;
}

export const TextOptions = (props: TextOptionsProps) => {
  return (
    <div className="flex flex-col gap-2">
      <ShapeOptions
        width={props.width} setWidth={props.setWidth}
        height={props.height} setHeight={props.setHeight}
        posX={props.posX} setPosX={props.setPosX}
        posY={props.posY} setPosY={props.setPosY}
        selectedElement={props.selectedElement}
      />
      <div className="flex flex-col gap-3">
        <span className="text-sm w-12">FontFamily</span>
        <select value={props.fontFamily} onChange={(e) => props.setFontFamily(e.target.value)} className="select">
          <option value="Arial">Arial</option>
          <option value="Inter">Inter</option>
          <option value="Courier New">Courier New</option>
        </select>
      </div>   
      <div className="flex items-center gap-3">
        <span className="text-sm w-12">FontSize</span>
        <Input 
          name="fontSize"
          type="number" id={`fontSize-${props.selectedElement.id}`} 
          defaultValue={props.selectedElement.fontSize} 
          min={0} max={100}
          onBlur={props.setFontSize}
          className="input input-xs w-16"
        />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm w-12">Color</span>
        <Input 
          name="color"
          type="color" id={`color-${props.selectedElement.id}`} 
          value={props.selectedElement.color || "#000000"}
          onChange={props.setColor}
        />
      </div>
    </div>
  );
};