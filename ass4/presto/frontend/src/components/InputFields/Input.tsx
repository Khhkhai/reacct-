type InputProps = {
    label?: string;
    value?: string;
    defaultValue?: string | number;
    onChange?: (_value: string) => void;
    type: "text" | "email" | "password" | "number" | "color";
    id: string;
    name: string;
    className?: string;
    required?: boolean;
    onBlur?: (_value: string) => void;
    min?: number;
    max?: number;
}

export const Input = (props: InputProps) => {
  return (
    <div className="form-control flex flex-col">
      {props.label && (
        <label htmlFor={props.id} className="label mb-1 mt-2">
          <span className="label-text text-black">{props.label || ''}</span>
        </label>
      )}
      <input
        id={props.id}
        name={props.name}
        type={props.type}
        value={props.value ?? ''}
        onChange={(e) => props.onChange?.(e.target.value)}
        onBlur={(e) => {
          let val = e.target.value;

          if (props.min !== undefined && Number(val) < props.min) {
            val = String(props.min);
          }
          if (props.max !== undefined && Number(val) > props.max) {
            val = String(props.max);
          }

          e.target.value = val;
          props.onBlur?.(val);
        }}
        className={'input ' + (props.className || '')}
        required={props.required}
        min={props.min}
        max={props.max}
      />
    </div>
  );
};