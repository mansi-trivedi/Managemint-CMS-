import React from 'react'
import "./Error.css"

/* this will render whenever any function catches any error */
const Error = () => {
    return (
        <>
            <div className="Error">
                <div className="ErrorContent">
                    <h4>OOPS..!!!</h4>
                    <h6>Something Went Wrong</h6>
                </div>
            </div>
        </>
    )
}

export default Error