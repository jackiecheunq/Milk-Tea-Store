import React from "react";

const Input: React.FC<{ [props: string]: string | boolean | number }> = (
  props
) => {
  if ("className" in props) {
    return <input type="text" {...props} />;
  }
  return <input className="input no-spin-button" type="text" {...props} />;
};

export default Input;
