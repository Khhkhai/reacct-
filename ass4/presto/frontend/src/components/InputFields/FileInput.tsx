import React, { useImperativeHandle, useRef } from "react";

export type FileInputHandle = {
  reset: () => void;
};

type FileInputProps = {
  name: string;
  label: string;
  onChange: (_file: File | null) => void;
  type: "file";
  id: string;
  className?: string;
  required?: boolean;
  accept?: string;
};

export const FileInput = React.forwardRef<FileInputHandle, FileInputProps>(
  (props, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (inputRef.current) inputRef.current.value = '';
      },
    }));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      props.onChange(file);
    };

    return (
      <div className="form-control w-full flex flex-col">
        <label htmlFor={props.id} className="label mb-1 mt-2">
          <span className="label-text text-black">{props.label}</span>
        </label>
        <input
          name={props.name}
          ref={inputRef}
          id={props.id}
          type={props.type}
          onChange={handleChange}
          className={`file-input ${props.className}`}
          required={props.required}
          accept={props.accept}
        />
      </div>
    );
  }
);

FileInput.displayName = "FileInput";