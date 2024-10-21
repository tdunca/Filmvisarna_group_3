import React from 'react';

interface ButtonProps {
  className: string;
  text: string;

  onClick?: () => void; //
}

const Button: React.FC<ButtonProps> = ({ text, className, onClick }) => {

  return (
    <button className={className} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;