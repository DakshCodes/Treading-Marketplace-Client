import React from 'react'
import { CircularProgress } from "@nextui-org/react";

const Loader = () => {
    return (
        <div className='fixed h-screen w-screen bg-[#000000] flex justify-center items-center'>
            <CircularProgress color="danger" size='lg' aria-label="Loading..." />
        </div>
    )
}

export default Loader
