import React, { useState, useRef } from "react";

// Icons
import { IoIosArrowDown } from "react-icons/io";

// Styles
import Style from "./SelectComponent.module.css";

const SelectComponent = ({
  className,
  classNameOpened,
  classNameOption,
  placeholder,
  setValue,
  columns,
  columnLabel,
  columnValue,
  selectedItem,
}) => {
  const [open, setOpen] = useState(false);
  const isntNormalList = columns.some((el) => typeof el === "object");

  const selectRef = useRef(null);

  const checkPosition = (selectRef) => {
    setOpen((OldState) => !OldState);
    const select = selectRef.current;
    const selectTop = select.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (windowHeight - selectTop < 150) {
      select.style.top = `-148px`;
      select.style.borderTopColor = "inherit";
      select.style.borderBottomColor = "transparent";
      select.style.borderBottomLeftRadius = "0px";
      select.style.borderBottomRightRadius = "0px";
      select.style.borderTopRightRadius = "6px";
      select.style.borderTopLeftRadius = "6px";
    } else if (windowHeight - selectTop >= 150) {
      select.style.top = "97%";
      select.style.borderTopColor = "transparent";
      select.style.borderBottomColor = "inherit";
      select.style.borderTopLeftRadius = "0px";
      select.style.borderTopRightRadius = "0px";
      select.style.borderBottomRightRadius = "6px";
      select.style.borderBottomLeftRadius = "6px";
    } else {
      select.style.top = "0";
    }

  };

  return (
    <div
      className={Style.select + " " + className}
      onClick={() => {
        checkPosition(selectRef);
      }}
    // onMouseLeave={() => { setOpen(false); selectRef.current.style.top = "97%" }}
    >
      <div className={Style.selected}>
        <span>{selectedItem || placeholder}</span>
        <span className={open ? Style.arrowOpened : Style.arrow}>
          <IoIosArrowDown />
        </span>
      </div>

      <div
        ref={selectRef}
        className={classNameOpened}
        style={
          open
            ? {
              maxHeight: "150px",
              overflow: "auto",
              position: "absolute",
              zIndex: 3,
              opacity: 1,
              transition: "all 0.3s",
              visibility: "visible",
            }
            : {
              maxHeight: 0,
              overflow: "hidden",
              position: "absolute",
              visibility: "hidden",
              transition: "all 0.2s",
              zIndex: 3,
              opacity: 0,
            }
        }
      >
        {isntNormalList
          ? columns
            .filter((item) => item.searchable !== false)
            .map((option, i) => (
              <div
                key={i}
                className={classNameOption}
                onClick={() => {
                  setValue(columnValue ? option[columnValue] : option.value);
                }}
              >
                {columnLabel ? option[columnLabel] : option.label}
              </div>
            ))
          : columns.map((option, i) => (
            <div
              key={i}
              className={classNameOption}
              onClick={() => {
                setValue(option);
              }}
            >
              {option}
            </div>
          ))}
      </div>
    </div>
  );
};

export default SelectComponent;
