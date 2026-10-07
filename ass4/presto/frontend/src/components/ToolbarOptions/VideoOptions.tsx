import { Input } from "../InputFields/Input";
import { Checkbox } from "../InputFields/Checkbox";
import type { VideoElementType } from "../../data";
import { Button } from "../Button";
import { ShapeOptions } from "./ShapeOptions";

type VideoOptionProps = {
    width: string; setWidth: (_width: string) => void;
    height: string; setHeight: (_height: string) => void;
    posX: string; setPosX: (_posX: string) => void;
    posY: string; setPosY: (_posY: string) => void;
    selectedElement: VideoElementType;
    videoUrl: string; setVideoUrl: (_url: string) => void;
    autoplay: boolean; setAutoplay: (_autoplay: boolean) => void;
    handleUpdateVideo: () => void;
};

export const VideoOptions = (props: VideoOptionProps) => {
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
        <span className="text-sm w-12">URL</span>
        <Input name="url" type="text" id={`url-${props.selectedElement.id}`} value={props.videoUrl} onChange={props.setVideoUrl} className="input-xs w-full" />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm w-12">Autoplay</span>
        <Checkbox name="autoplay" id="autoplay" label="" checked={props.autoplay} onChange={props.setAutoplay} className="toggle-xs" />
      </div>
      <Button name="update-video" onClick={props.handleUpdateVideo} className="btn-xs">Update Video</Button>
    </div>
  );
};