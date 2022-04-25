import React from 'react'
import { ProgressSpinner } from 'primereact/progressspinner';

export const Loader = () => {


    return(
        <>
            <div >
                <ProgressSpinner style={{'display':'block',"height":"5em",'width':'5em','paddingTop':'55%'}}/>
            </div>
        </>
    )

}
