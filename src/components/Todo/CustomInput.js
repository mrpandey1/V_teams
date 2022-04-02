import React from 'react'

const CustomInput = React.forwardRef((props,ref) => {

    return (
       <h5 onClick={props.onClick} ref={ref} style={{paddingTop:'4px'}}>
         {props.value || props.placeholder}
       </h5>
    )

})

export default CustomInput;
