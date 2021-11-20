import React from "react";
//  import api from "../../services/api";

import "./styles.css";

function Button({ text, onClick, isDisabled, className }) {
  // const history = useHistory();

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  function HandleClick() {
    onClick();
  }

  return (
    <div className={`Button-container ${isDisabled && "button-disabled"} ${className}`} onClick={HandleClick}>
      <div>
        <h5>{text}</h5>
      </div>
    </div>
  );
}

export default Button;
