import React from 'react'
import { RingLoader } from 'react-spinners'

const Loader = () => {
    return (
        <div className=' h-screen flex justify-center items-center'>
            <div>
                <RingLoader color="#c7a44d" />
                <p className='my-3'>Loading.....</p>
            </div>
        </div>
    )
}

export default Loader