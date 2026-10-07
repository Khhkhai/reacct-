
type CellProps = {
    value: string
}

export const Cell = (props: CellProps) => {
    return (
        <td className="border-1 aspect-square">{props.value}</td>
    )
}