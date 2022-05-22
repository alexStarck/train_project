import React from 'react'
import {ProgressSpinner} from 'primereact/progressspinner';

export const Loader = (props) => {


    return (
        <>
            <div>
                <ProgressSpinner style={{'display': 'block', "height": "100%"}}/>
            </div>
        </>
    )

}
