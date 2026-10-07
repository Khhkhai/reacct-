import { useEffect } from "react";

type ContextMenuProps = {
    x: number;
    y: number;
    onDelete: () => void;
    onClose: () => void;
}

export const ContextMenu = ({ x, y, onDelete, onClose }: ContextMenuProps) => {
  useEffect(() => {
    const handleClick = () => onClose();
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div 
      className="fixed bg-base-100 border rounded shadow-lg z-50"
      style={{ top: y, left: x }}
    >
      <ul className="menu bg-base-200 rounded-box w-32 shadow">
        <li>
          <a id="context-menu-delete" className="text-error" onClick={onDelete}>Delete</a>
        </li>
      </ul>
    </div>
  );
};