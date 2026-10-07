import { Input } from "../InputFields/Input";
import { Button } from "../Button";
import { ShapeOptions } from "./ShapeOptions";
import type { CodeElementType } from "../../data";

type CodeOptionProps = {
    width: string; setWidth: (_width: string) => void;
    height: string; setHeight: (_height: string) => void;
    posX: string; setPosX: (_posX: string) => void;
    posY: string; setPosY: (_posY: string) => void;
    selectedElement: CodeElementType;

    code: string; setCode: (_code: string) => void;
    fontSize: string; setFontSize: (_fontSize: string) => void;
    handleUpdateCode: () => void;
};

export const CodeOptions = (props: CodeOptionProps) => {
  return (
    <div className="flex flex-col gap-2">
      <ShapeOptions
        width={props.width} setWidth={props.setWidth}
        height={props.height} setHeight={props.setHeight}
        posX={props.posX} setPosX={props.setPosX}
        posY={props.posY} setPosY={props.setPosY}
        selectedElement={props.selectedElement}
      />
      <div className="flex items-center gap-3">
        <span className="text-sm w-12">FontSize</span>
        <Input 
          type="number" 
          name="fontSize"
          id={`fontSize-${props.selectedElement.id}`} 
          defaultValue={props.selectedElement.fontSize} 
          min={0} max={100}
          onBlur={props.setFontSize}
          className="input input-xs w-16"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm">Code</label>
        <textarea
          className="textarea w-full font-mono h-28"
          placeholder="Paste your code here..."
          value={props.code}
          onChange={(e) => props.setCode(e.target.value)}
          style={{ whiteSpace: 'pre', fontFamily: 'monospace' }}
          name="code"
        />
      </div>
      <Button name="update-code" onClick={props.handleUpdateCode} className="btn-xs">Update Code</Button>
    </div>
  );
};