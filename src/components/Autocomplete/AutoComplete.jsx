import React from 'react'
import { Input, Autocomplete, AutocompleteItem, Avatar, Button } from "@nextui-org/react";
import { UilPlus } from '@iconscout/react-unicons'

const AutoComplete = ({ users, placeholder, selectionChange, values }) => {
    // const updatedUsers = [...users];  // Create a copy of the array
    // updatedUsers.unshift({ "name": "N/A", "_id": null });
    return (
        <div className='flex items-center'>
            <Autocomplete
                selectedKey={values}
                onSelectionChange={selectionChange}
                classNames={{
                    base: " border border- bg-transparent",
                    listboxWrapper: "max-h-[70px]",
                    selectorButton: "text-default-500",
                }}
                defaultItems={users}
                inputProps={{
                    classNames: {
                        input: "text-[0.9rem] ",
                        inputWrapper: " bg-[#fff] font-font1 h-[40px] max-w-full ",
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
                        content: "p-1  border-default-100 ",
                    },
                }}
                variant="flat"
            >
                {(item) => (
                    <AutocompleteItem key={item._id} textValue={item.name}>
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
