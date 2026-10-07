import React,{ useRef, useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import type {
  SlideType,
  SlideElementType,
  TextElementType,
  Background,
} from "../data";

type SlideProps = {
  slide?: SlideType | null;
  background?: Background;
  disabled?: boolean;
  onDblClick?: (_el: SlideElementType | null) => void;
  onContextMenu?: (_id: string, _x: number, _y: number) => void;
  onTextChange?: (_id: string, _text: string) => void;
  updateElementPartial?: (_id: string, _updates: Partial<SlideElementType>) => void;
};

export const Slide = (props: SlideProps) => {
  const elements = props.slide?.elements ?? [];
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const toPixels = (el: SlideElementType) => {
    const width = (el.width / 100) * size.width;
    const height = (el.height / 100) * size.height;
    let x = (el.x / 100) * size.width - width / 2;
    let y = (el.y / 100) * size.height - height / 2;

    x = Math.max(0, Math.min(x, size.width - width));
    y = Math.max(0, Math.min(y, size.height - height));

    return { width, height, x, y };
  };

  const renderContent = (el: SlideElementType) => {
    switch (el.type) {
    // currently only a rectangle element is available with orange color
    case "rectangle":
      return <div className="w-full h-full bg-orange-400" />;

    case "text":
      return (
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) =>
            props.onTextChange?.(el.id, e.currentTarget.innerText)
          }
          style={{
            fontSize: `${(el as TextElementType).fontSize}em`,
            color: (el as TextElementType).color,
            fontFamily: (el as TextElementType).fontFamily || "Arial",
          }}
          className="w-full h-full outline-none overflow-auto"
        >
          {(el as TextElementType).text}
        </div>
      );

    case "image":
      return (
        <img
          src={el.src}
          alt={el.alt}
          className="w-full h-full object-contain"
        />
      );

    case "video":
      return (
        <div className="w-full h-full bg-gray-200">
          <iframe
            src={el.src}
            className="w-[90%] h-[90%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            allow="autoplay"
          />
        </div>
      );

    case "code":
      return (
        <div className="w-full h-full overflow-auto text-sm p-2">
          <SyntaxHighlighter
            language={el.language }
            style={atomOneDark}
            customStyle={{
              margin: 0,
              height: "100%",
              width: "100%",
              fontSize: `${el.fontSize * 12}px`,
              whiteSpace: "pre",
              overflow: "auto",
            }}
          >
            {el.code}
          </SyntaxHighlighter>
        </div>
      );

    default:
      return null;
    }
  };
  const getBackgroundStyle = (bg: Background | undefined): React.CSSProperties => {
    if (!bg) {
      return { background: "white" };
    }
    switch (bg.type) {
    case "solid":
      return { background: bg.color };

    case "gradient":
      return {
        background: `linear-gradient(${bg.from}, ${bg.to})`
      };

    case "image":
      return {
        backgroundImage: `url(${bg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };

    default:
      return { background: "white" };
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-white" style={getBackgroundStyle(props.background)}>
      {elements.map((el) => {
        const frame = toPixels(el);
        return (
          <Rnd
            key={el.id}
            size={{ width: frame.width, height: frame.height }}
            position={{ x: frame.x, y: frame.y }}
            bounds="parent"
            onDoubleClick={() => props.onDblClick?.(el)}
            onContextMenu={(e: React.MouseEvent<HTMLDivElement>) => {
              e.preventDefault();
              props.onContextMenu?.(el.id, e.clientX, e.clientY)
            }}
            disableDragging={props.disabled}
            enableResizing={!props.disabled}
            className="border border-transparent hover:border-gray-400"
          >
            {renderContent(el)}
          </Rnd>
        );
      })}
    </div>
  );
};