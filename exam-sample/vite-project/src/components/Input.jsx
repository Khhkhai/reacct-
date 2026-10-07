
export const input = () => {
    return (
        <label htmlFor={props.id} className="label mb-1 mt-2">
            <span className="label-text text-black">{props.label || ''}</span>
        </label>
    )
}