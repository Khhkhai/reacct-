import type { SlideType } from "../data";

type CardProps = {
    key: string
    id: string
    name: string;
    thumbnail: string | null;
    description: string;
    slides: SlideType[];
    onClick: () => void;
}

export const Card = (props: CardProps) => {
  return (
    <div id={props.id} className="card h-full min-w-[100px] bg-base-100 shadow-sm" onClick={props.onClick}>
      <figure>
        {props.thumbnail ? (
          <img
            src={props.thumbnail}
            alt="thumbnail"
            className="aspect-[2/1] w-full object-contain md:object-cover"
          />
        ) : (
          <div className="bg-gray-300 aspect-[2/1] w-full"></div>
        )}
      </figure>
      <div className="card-body">
        <h2 className="card-title">{props.name}</h2>
        <p className="line-clamp-2">{props.description}</p>
        <span className="badge">{props.slides.length}</span>
      </div>
    </div>
  )
}