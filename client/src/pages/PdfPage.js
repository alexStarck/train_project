import React, { useContext,  useState ,useRef } from "react";
import { renderToString } from 'react-dom/server';
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import { Toast } from 'primereact/toast';
import { jsPDF } from "jspdf";
import 'jspdf-autotable'




export const PdfPage = () => {
    const toast = useRef(null);

    const {token,userId} = useContext(AuthContext)
    const [file,setFile]=useState(null)

   const  jsPdfGenerator =async () => {
        const w=document.getElementById('pdfTable').offsetWidth
       const h=document.getElementById('pdfTable').offsetHeight
        const doc= new jsPDF('p','pt', 'a4', true)
       const source=document.getElementById('pdfTable')
       const Prints = () => (
           <div id='pdfTable' style={{height:'100%',width:'100%'}}>
               <table style={{height:'100%',width:'100%'}} >
                   <tr>
                       <th> </th>
                       <th>2004</th>
                       <th>2005</th>
                       <th>2006</th>
                   </tr>
                   <tr>
                       <td>Рубины</td>
                       <td>43</td>
                       <td>51</td>
                       <td>79</td>
                   </tr>
                   <tr>
                       <td>Изумруды</td>
                       <td>28</td>
                       <td>34</td>
                       <td>48</td>
                   </tr>
                   <tr>
                       <td>Сапфиры</td><td>29</td><td>57</td><td>36</td>
                   </tr>
               </table>
           </div>
       )
        const test=renderToString(<Prints />)
        console.log(test)
       // await doc.html(test,{fontFaces:['weight':'400'],x: 100,y: 100})
       // doc.html(document.getElementById('pdfTable'), {
       //     callback: function () {
       //         window.open(doc.output('bloburl'));
       //     }
       // })
       //  doc.text('lol',10,10, "center")
       //  doc.autoTable({
       //      head:[['Name','Email']],
       //      body:[
       //          ['name1','mail1'],
       //          ['name2','mail2'],
       //          ['name3','mail3']
       //      ],
       //      theme:'striped'
       //  })
       // doc.addPage("a4", "l");
       // doc.text('lol2',10,10, "center")
       // doc.line(20, 20, 60, 20); // horizontal line
       // doc.addImage("examples/images/Octonyan.jpg", "JPEG", 15, 40, 180, 180);
       doc.save('test2.pdf')
   }

    // if (loading) {
    //     return <Loader />
    // }

    return (
        <>
            <Toast ref={toast} />
            <div id='pdfTable'>
                <table >
                    <tr>
                        <th> </th>
                        <th>2004</th>
                        <th>2005</th>
                        <th>2006</th>
                    </tr>
                    <tr>
                        <td>Рубины</td>
                        <td>43</td>
                        <td>51</td>
                        <td>79</td>
                    </tr>
                    <tr>
                        <td>Изумруды</td>
                        <td>28</td>
                        <td>34</td>
                        <td>48</td>
                    </tr>
                    <tr>
                        <td>Сапфиры</td><td>29</td><td>57</td><td>36</td>
                    </tr>
                </table>
            </div>
            <button name="subject" type="submit" onClick={jsPdfGenerator}>создать pdf</button>
        </>
    )
}