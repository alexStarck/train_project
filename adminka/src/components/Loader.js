import React from 'react'
import { ProgressSpinner } from 'primereact/progressspinner';

export const Loader = (props) => {
    // let res=60
    // if(props.weight){
    //     let weight=props.weight
    //     res=Math.trunc((weight/12)*100)
    //
    // }

    return(
        <>
            <div >
                <ProgressSpinner style={{'display':'block',"height":"100%"}}/>
            </div>
        </>
    )

}
