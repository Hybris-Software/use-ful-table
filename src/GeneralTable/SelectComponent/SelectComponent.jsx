import React, { useState } from 'react'

// Icons
import { IoIosArrowDown } from 'react-icons/io'

// Styles
import Style from './SelectComponent.module.css'

const SelectComponent = ({ className, classNameOpened, classNameOption, placeholder, setValue, columns, columnLabel, columnValue, selectedItem }) => {

    const [open, setOpen] = useState(false)
    const isntNormalList = columns.some((el) => typeof el === 'object');

    return (
        <div
            className={Style.select + ' ' + className}
            onClick={() => { setOpen((OldState) => !OldState) }}
            onMouseLeave={() => setOpen(false)}
        >
            <div className={Style.selected}>
                <span>
                    {selectedItem || placeholder}
                </span>
                <span className={open ? Style.arrowOpened : Style.arrow}>
                    <IoIosArrowDown />
                </span>
            </div>

            <div
                className={classNameOpened}
                style={open
                    ? {
                        maxHeight: "150px",
                        position: "absolute",
                        zIndex: 5,
                        opacity: 1,
                        transition: "all 0.2s",
                        visibility: "visible",

                    }
                    : {
                        maxHeight: 0,
                        overflow: "hidden",
                        position: "absolute",
                        visibility: "hidden",
                        transition: "all 0.3s",
                        zIndex: 5,
                        opacity: 0,

                    }
                }
            >
                {isntNormalList
                    ?
                    columns
                        .map((option, i) => (
                            <div
                                key={i}
                                className={classNameOption}
                                onClick={() => { setValue(columnValue ? option[columnValue] : option.value) }}
                            >
                                {columnLabel ? option[columnLabel] : option.label}
                            </div>
                        ))

                    :
                    columns.map((option, i) => (
                        <div
                            key={i}
                            className={classNameOption}
                            onClick={() => { setValue(option); console.log(option) }}
                        >
                            {option}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default SelectComponent