import React from "react";

type ButtonProps = {
    onClick?: () => void;
    name: string;
    type?: "button" | "submit"
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

export const Button = (props: ButtonProps) => {
  return (
    <button 
      name={`${props.name}-button`}
      type={props.type} 
      onClick={props.onClick} 
      className={`btn btn-soft btn-primary ${props.className} `}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};
  
