import { Input } from "../InputFields/Input";
import type { SlideElementType } from "../../data"

export type ShapeOptionsProps = {
    width: string; setWidth: (_width: string) => void;
    height: string; setHeight: (_height: string) => void;
    posX: string; setPosX: (_posX: string) => void;
    posY: string; setPosY: (_posY: string) => void;
    selectedElement: SlideElementType;
}

export const ShapeOptions = (props: ShapeOptionsProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <span className="text-sm w-12">Width</span>
        <Input 
          name="width"
          type="number" 
          id={`w-${props.selectedElement.id}`} 
          value={props.width}
          onChange={(val) => props.setWidth(val)} 
          min={0} max={100}
          className="input input-xs w-16"
        />
        <span className="text-sm">%</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm w-12">Height</span>
        <Input 
          name="height"
          type="number" id={`h-${props.selectedElement.id}`}         
          value={props.height}
          onChange={(val) => props.setHeight(val)} 
          min={0} max={100}
          className="input input-xs w-16"
        />
        <span className="text-sm">%</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm w-12">X</span>
        <Input 
          name="posX"
          type="number" id={`x-${props.selectedElement.id}`}        
          value={props.posX}
          onChange={(val) => props.setPosX(val)} 
          min={0} max={100}
          className="input input-xs w-16"
        />
        <span className="text-sm">%</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm w-12">Y</span>
        <Input 
          name="posY"
          type="number" id={`y-${props.selectedElement.id}`}         
          value={props.posY}
          onChange={(val) => props.setPosY(val)} 
          min={0} max={100}
          className="input input-xs w-16"
        />
        <span className="text-sm">%</span>
      </div>
    </div>
  )
}