import React from "react";

import "./styles.css";

function Button({ size, color, text, onClick, isDisabled, className }) {
  return (
    <div>
      {/* <div>
        <aside />
        <main />
        <aside />
      </div>
      <div>
        <aside />
        <main />
        <aside />
      </div> */}

      {/* 4 pontas de triangulo que deletam as pontas do div com gradiente */}
      {/* tipos de botao e outras props? */}
      <div>
        <aside />
        <main
          className={`Button-container 
        Button-${size} Button-${color} 
        ${isDisabled && "Button-disabled"} ${className}`}
          onClick={!isDisabled ? onClick : () => {}}
        >
          <span>{text}</span>
        </main>
        <aside />
      </div>
    </div>
  );
}

export default Button;
