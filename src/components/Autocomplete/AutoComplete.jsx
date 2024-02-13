import React from 'react'
import { Input, Autocomplete, AutocompleteItem, Button } from "@nextui-org/react";
import { UilPlus } from '@iconscout/react-unicons'

const AutoComplete = ({ users,placeholder,selectionChange ,values}) => {
    return (
        <div className='flex items-center'>
            <Autocomplete
                selectedKey={values}
                onSelectionChange={selectionChange}
                classNames={{
                    base: " border border- bg-transparent",
                    listboxWrapper: "max-h-[300px]",
                    selectorButton: "text-default-500",
                    }}
                defaultItems={users}
                inputProps={{
                    classNames: {
                        input: "text-[1rem] ",
                        inputWrapper: " bg-[#fff] font-font1 h-[48px] max-w-full ",
                    },
                }}
                listboxProps={{
                    hideSelectedIcon: true,
                    itemClasses: {
                        base: [

                        ],
                    },
                }}
                aria-label="Select an employee"
                placeholder={placeholder}
                popoverProps={{
                    offset: 10,
                    classNames: {
                        base: "",
                        content: "p-1  border-default-100 bg-background",
                    },
                }}
                variant="flat"
            >
                {(item) => (
                    <AutocompleteItem key={item.id} textValue={item.name}>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2 items-center">
                                <div className="flex flex-col">
                                    <span className="text-small">{item.name}</span>
                                </div>
                            </div>
                        </div>
                    </AutocompleteItem>
                )}
            </Autocomplete>
        </div>
    )
}

export default AutoComplete
