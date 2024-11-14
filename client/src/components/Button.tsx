import React from "react";

interface ButtonProps {
   text: string;
   onClick?: () => void;
   className?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, className }) => {
   return (
      <button
         onClick={onClick}
         className={`border border-custom-gray text-custom-gray tracking-custom-wide px-4 py-2 transition duration-200 ease-out transform hover:bg-custom-gray hover:text-white ${className}`}
         style={{
            transition:
               "opacity 0.2s ease-out, visibility 0.2s ease-out, transform 0.2s ease-out",
         }}>
         {text}
      </button>
   );
};

export default Button;
