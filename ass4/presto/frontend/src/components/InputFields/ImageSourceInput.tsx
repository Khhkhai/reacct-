import { Input } from "./Input";
import { FileInput, type FileInputHandle } from "./FileInput";
import React from "react";
import { Button } from "../Button";
import type { ImageSource } from "../../data";

type ImageSourceInputProps = {
  value: ImageSource;
  onChange: (_val: ImageSource) => void;
};

export const ImageSourceInput = React.forwardRef<FileInputHandle, ImageSourceInputProps>(
  ({ value, onChange }, ref) => {
    const setType = (type: 'file' | 'url') =>
      onChange({ ...value, type });

    const setUrl = (url: string) =>
      onChange({ ...value, url });

    const setFile = (file: File | null) =>
      onChange({ ...value, file });

    return (
      <>
        <div className="tabs tabs-boxed">
          <Button
            name="upload-file"
            className={`tab ${value.type === 'file' ? 'tab-active' : ''}`}
            onClick={() => setType('file')}
          >
            Upload File
          </Button>

          <Button
            name="upload-url"
            className={`tab ${value.type === 'url' ? 'tab-active' : ''}`}
            onClick={() => setType('url')}
          >
            From URL
          </Button>
        </div>

        {value.type === 'file' ? (
          <FileInput
            name="file"
            ref={ref}
            id="image"
            label=""
            type="file"
            onChange={setFile}
            accept="image/png, image/jpeg"
            required
          />
        ) : (
          <Input
            name="url"
            id="url"
            label=""
            type="text"
            value={value.url}
            onChange={setUrl}
            required
          />
        )}
      </>
    );
  }
);

ImageSourceInput.displayName = "ImageSourceInput";
