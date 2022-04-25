import React, { useContext,  useState ,useRef } from "react";
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'

import { Toast } from 'primereact/toast';






export const ImagePage = () => {
    const toast = useRef(null);
    let url='http://localhost:5000/uploads/'

    const {token,userId} = useContext(AuthContext)
    const [file,setFile]=useState(null)

    const fileChangedHandler = (event) => {
        console.log(event.target.files[0])
        let file=event.target.files[0]
        file.user=userId
        setFile(file)
    }
    const uploadHandler= async () => {
        const formData = new FormData()
        formData.append(
            'user',
            userId
        )
        formData.append(
            'file',
            file,
            file.name
        )
        fetch('/upload', {
            method: 'POST',
            body: formData,
            headers:{
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            return response.json();
        })
            .then((data) => {
                console.log(data);
            });

    }


    // if (loading) {
    //     return <Loader />
    // }

    return (
        <>
            <Toast ref={toast} />
            {/*encType='multipart/form-data'*/}
            {/*/606f6713efe4962194aaeb58/1620204563638a.jpg*/}
            {/*<a href=url target="_blank">text</a>*/}
            {/*<a href="http://www.sites/default/files/2019-01/560_12thMarkSheet.pdf" target="_blank" type="application/pdf; download='some_pdf_name'> length=362340">download</a>*/}
            <div  >
                <input type="file" name="file"  onChange={fileChangedHandler}/>
                    <button onClick={uploadHandler}>Upload!</button>
            </div>

        </>
    )
}