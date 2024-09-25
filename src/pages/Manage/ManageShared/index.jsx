import React from "react";

import "./index.css";
import BTN from "../../../components/Shared/Button";
export const Input = React.forwardRef((props, ref) => {
  const [show, setShow] = React.useState(false);

  return (
    <div className="manage-shared-input_cont form_col">
      <label className="admin_label">{props.label}</label>

      <input
        {...props}
        type={show ? "text" : props.type}
        className="manage-shared-input"
        ref={ref}
      />

      {props.type === "password" && <></>}
    </div>
  );
});

export const TextArea = React.forwardRef((props, ref) => {
  return (
    <div className="form_col">
      <label className="admin_label">{props.label}</label>
      <textarea
        className="manage-shared-textarea"
        {...props}
        ref={ref}
      ></textarea>
    </div>
  );
});

export const Select = React.forwardRef((props, ref) => {
  return (
    <div className="form_col">
      <label className="admin_label">{props.label}</label>
      <select className="manage-shared-select" {...props} ref={ref}>
        {props.children}
      </select>
    </div>
  );
});

export const Radio = React.forwardRef((props, ref) => {
  return (
    <input type="radio" className="manage-shared-radio" {...props} ref={ref} />
  );
});

export function Checkbox(props) {
  return (
    <input type="checkbox" className="manage-shared-checkbox" {...props} />
  );
}

export function Button(props) {
  return (
    <BTN
      {...props}
      disabled={props.disabled || props.loading}
      onClick={() => {
        props.onClick && props.onClick();
      }}
      className={`manage-shared-button ${props.className}`}
    >
      {props.loading && <div className="loader"></div>}
      {props.children}
    </BTN>
  );
}

export const Switch = React.forwardRef((props, ref) => {
  const handleInputChange = (e) => {
    e.stopPropagation();
    props.onChange && props.onChange(e);
  };

  return (
    <label className="manage-switch-input">
      <input
        type="checkbox"
        {...props}
        onClick={(e) => e.stopPropagation()}
        onChange={handleInputChange}
        ref={ref}
      />
      <span className="slider round"></span>
    </label>
  );
});
