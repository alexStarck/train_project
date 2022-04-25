import React, {useCallback, useContext, useEffect, useState,useRef} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';



export const TasksPage = () => {

    const { request,loading} = useHttp()
    const {token} = useContext(AuthContext)
    const [localComposition,setLocalComposition]=useState(null)
    const [composition,setComposition]=useState(null)
    const [valueComposition,setValueComposition]=useState(null)
    const [height,setHeight]=useState('250px')
    const [objectsList, setObjectsList] = useState(null);
    const [objectEditDialog,setObjectEditDialog]=useState(false)
    const [object, setObject] = useState([]);
    const [selectedObjects, setSelectedObjects] = useState([]);
    const [deleteObjectDialog, setDeleteObjectDialog] = useState(false);
    const [deleteObjectsDialog, setDeleteObjectsDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);


    const toast = useRef(null);
    const dt = useRef(null)




    const fetchObjects = useCallback(async () => {
        try {
            const fetched = await request('/api/task/list', 'POST',{} , {
                Authorization: `Bearer ${token}`
            })

            if (JSON.stringify(fetched) !== JSON.stringify(objectsList)) {
                setObjectsList(fetched)
            }
        } catch (e) {}
    }, [token, request, objectsList])










    const hideDialog = () => {

        setObjectEditDialog(false);
    }

    const hideDeleteObjectDialog = () => {
        setDeleteObjectDialog(false);
    }

    const hideDeleteObjectsDialog = () => {
        setDeleteObjectsDialog(false);
    }

    const createObject = useCallback(async () => {
        try {

            const fetched = await request('/api/task/create', 'POST',{...object,arr:composition} , {
                Authorization: `Bearer ${token}`
            })

            if (JSON.stringify(fetched) !== JSON.stringify(objectsList)) {

            }

            setObjectEditDialog(false)
            setObject([]);
            setComposition(null)
            setLocalComposition(null)
            setValueComposition(null)



        } catch (e) {}
    }, [token, request, object,composition])






    const editObject = (item) => {
        setObject({...item});

        setValueComposition({name:item.composition.length.toString()})
        if(item.composition.length!==0){
            setHeight('100px')
        }
        createComposition(item.composition.length,item.composition)
        setObjectEditDialog(true);

    }



    const deleteObject = useCallback(async () => {
        try {


            const fetched = await request('/api/task/delete', 'POST',{...object} , {
                Authorization: `Bearer ${token}`
            })


            setDeleteObjectDialog(false);
            setObject([]);


            toast.current.show({ severity: 'success', summary: 'Successful', detail: fetched.message, life: 3000 });
            //fetchUsers()
        } catch (e) {}
    }, [token, request, object])






    const deleteSelectedObjects = useCallback(async () => {
        try {


            const fetched = await request('/api/task/deleteM', 'POST',selectedObjects , {
                Authorization: `Bearer ${token}`
            })


            setDeleteObjectsDialog(false);
            setSelectedObjects(null);


            toast.current.show({ severity: 'success', summary:
                    'Successful', detail: fetched.message, life: 3000 });
        } catch (e) {}
    }, [token, request, selectedObjects])




    const onValueCompositionChange = (e) => {
        setValueComposition(e.value);
        setHeight('100px')
        createComposition(e.value.name,[])
    }






    const valuesCom = [
        { name: '1' },
        { name: '2' },
        { name: '3' },
        { name: '4' },
        { name: '5' },
        { name: '6' },
        { name: '7' },
        { name: '8' },
        { name: '9' },
        { name: '10' },
        { name: '11' },
        { name: '12' },
        { name: '13' }
    ];






    const compositionBodyTemplate = (rowData) => {

        return <span >{rowData.composition.length}</span>;
    }


    const createComposition=(value,array)=>{
        if(localComposition!==null){
            let arr=[]

            if(Number(value)<localComposition.length){
                for(let i=0;i<Number(value);i++){
                    arr.push(localComposition[i])
                }
            }else if(object.composition.length!==0){

                let j=0
                while (j<localComposition.length){
                    arr.push(localComposition[j])
                    j++
                }

                for(let i=j+1;i<Number(value)+1;i++){
                    arr.push({
                        number:i,
                        name:''
                    })
                }
            }else{

                let j=0
                while (j<localComposition.length){
                    arr.push(localComposition[j])
                    j++
                }
                for(let i=j+1;i<Number(value)+1;i++){
                    arr.push({
                        number:i,
                        name:''
                    })
                }
            }
            setComposition(arr)
            setLocalComposition(arr)
        }else{
            let arr=[]
            if(array.length!==[]){
                for(let i=1;i<Number(value)+1;i++){
                    arr.push({
                        number:Number(array[i-1].order),
                        name:array[i-1].name
                    })
                }

            }else{
                for(let i=1;i<Number(value)+1;i++){
                    arr.push({
                        number:i,
                        name:''
                    })
                }
            }

            setComposition(arr.sort(function (a, b) {
                if (a.order > b.order) {
                    return 1;
                }
                if (a.order < b.order) {
                    return -1;
                }

                return 0;
            }))
            setLocalComposition(arr.sort(function (a, b) {
                if (a.order > b.order) {
                    return 1;
                }
                if (a.order < b.order) {
                    return -1;
                }

                return 0;
            }))
        }

    }




    const onCompositionChange=(e, name)=>{
        setComposition(composition.map(function(obj) {
            if(obj.number===name)
                return {...obj,name:e.target.value}
            return obj
        }))

        setLocalComposition(composition.map(function(obj) {

            if(obj.number===name)
                return {...obj,name:e.target.value}

            return obj
        }))

    }



    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => {editObject(rowData);if(!rowData.composition.length)setHeight('250px')}} />
            </React.Fragment>
        );
    }

    const header = (
        <>
            <div className="PageName p-text-center " >
                <h3>
                   СТРАНИЦА ЗАДАЧ
                </h3>
            </div>
            <div className="p-d-flex">

                <div className="table-header" style={{justifyContent:'flex-end',display: 'flex',width:'100%'}}>

                    <span className="p-input-icon-left" >
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Поиск..." />
            </span>
                </div>
            </div>

        </>
    );
    const objectEditDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={createObject} />
        </React.Fragment>
    );

    const deleteObjectDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteObjectDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteObject} />
        </React.Fragment>
    );
    const deleteObjectsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteObjectsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedObjects} />
        </React.Fragment>
    );




    useEffect(() => {
        fetchObjects()

    }, [token,deleteObject,deleteSelectedObjects,createObject,fetchObjects,objectsList]);



    return(
        <div className="datatable-crud-demo">
            <Toast ref={toast} />

            <div className="card">


                <DataTable ref={dt} value={objectsList} selection={selectedObjects} onSelectionChange={(e) =>{setSelectedObjects(e.value)} }
                           dataKey="_id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                           currentPageReportTemplate="Показано с {first} по {last} из {totalRecords} типов вагонов"
                           globalFilter={globalFilter}
                           loading={loading}
                           header={header}>
                    <Column field="Class" header="Тип вагона" sortable/>
                    <Column field="composition" header="Кол-во задач" body={compositionBodyTemplate}/>
                    <Column body={actionBodyTemplate}/>
                </DataTable>
            </div>



            <Dialog visible={objectEditDialog} style={{ width: '650px' }} header="Редактирование Задач" modal className="p-fluid" footer={objectEditDialogFooter} onHide={hideDialog} position='top'>
                <div className="p-field">
                    <label className="p-text-center">{object.Class}</label>
                </div>
                <div className="p-field" style={{height:height}}>
                    <label htmlFor="value">Задачи</label>
                    <Dropdown value={valueComposition} options={valuesCom} onChange={(e)=>{onValueCompositionChange(e)}}  optionLabel="name" placeholder="Select a value of composition" />
                </div>
                {composition!==null && (composition.map((item,index)=>{

                        return(
                            <div className="p-mb-2 p-d-flex " key={index}>
                                <InputTextarea className="p-mr-2 p-d-inline-flex" rows={5} cols={30} value={item.name} onChange={(e) => onCompositionChange(e, item.number)} autoResize />
                            </div>
                        )
                    })
                )}

            </Dialog>

            <Dialog visible={deleteObjectDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteObjectDialogFooter} onHide={hideDeleteObjectDialog} position='top'>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                    {object && <span>вы точно хотите удалить  <b>{object.name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteObjectsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteObjectsDialogFooter} onHide={hideDeleteObjectsDialog} position='top'>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                    {object && <span>Вы точно хотите удалить выбранные типы вагонов ?</span>}
                </div>
            </Dialog>
        </div>
    )

}