export type PresentationType = {
    id: string;
    name: string;
    description: string;
    thumbnail: string | null;
    slides: SlideType[];
    defaultBackground: Background;
};

export type SlideType = {
    id: string;
    elements: SlideElementType[];
};

export type BaseElementType = {
    id: string;
    type: 'text' | 'image' | 'rectangle' | 'video' | 'code';
    x: number;
    y: number;
    width: number;
    height: number;
}

export type TextElementType = BaseElementType & {
    type: 'text';
    text: string;
    fontFamily: string;
    fontSize: number;
    color: string;
}

export type RectangleElementType = BaseElementType & {
    type: 'rectangle';
    fill: string;
}

export type ImageElementType = BaseElementType & {
    type: 'image';
    alt: string; 
    src: string;
}

export type VideoElementType = BaseElementType & {
    type: 'video';
    src: string;
    autoplay: boolean;
}

export type CodeElementType = BaseElementType & {
    type: 'code';
    code: string;
    fontSize: number;
    language: Language;
}

export type Language = 'javascript' | 'python' | 'c' | 'unknown';
export type SlideElementType = TextElementType | RectangleElementType | ImageElementType | VideoElementType | CodeElementType; 

export type SolidBackground = {
  type: "solid";
  color: string;
};

export type GradientBackground = {
  type: "gradient";
  from: string;
  to: string;
};

export type ImageBackground = {
  type: "image";
  src: string;
};

export type BgType = "solid" | "gradient" | "image";
export type Background = SolidBackground | GradientBackground | ImageBackground;

export type ImageSource = {
  type: 'file' | 'url';
  url: string;
  file: File | null;
};