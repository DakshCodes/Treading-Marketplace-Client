import './DashboardLayout.css'
import React from 'react'

const DashBoardLayout = ({ children }) => {
    return (
        <div className='layout-main'>
            {children}
        </div>
    )
}

export default DashBoardLayout
