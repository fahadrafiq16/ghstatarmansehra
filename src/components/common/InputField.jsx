import React from 'react'

const InputField = ({ label, name, type = "text", register, errors }) => {
    return (
        <div>
            <label>{label}</label>
            <input
                id={name}
                type={type}
                {...register(name, { required: `${label} is required` })}
            />
            {/* Display validation error */}
            {errors[name] && <p style={{ color: "red", fontSize:"10px", fontWeight:500, marginTop:'10px' }}>{errors[name].message}</p>}
        </div>
    )
}

export default InputField
