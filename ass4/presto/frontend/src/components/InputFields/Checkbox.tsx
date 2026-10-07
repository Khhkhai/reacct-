type CheckboxProps = {
  label?: string;
  checked?: boolean;
  onChange?: (_value: boolean) => void;
  id: string;
  name: string;
  className?: string;
  required?: boolean;
}

export const Checkbox = (props: CheckboxProps) => {
  return (
    <div className="form-control flex flex-col">
      {props.label && (
        <label htmlFor={props.id} className="label mb-1 mt-2">
          <span className="label-text text-black">{props.label}</span>
        </label>
      )}

      <input
        id={props.id}
        name={props.name}
        type="checkbox"
        checked={props.checked}
        onChange={(e) => props.onChange?.(e.target.checked)}
        className={`toggle ${props.className}`}
        required={props.required}
      />
    </div>
  );
};