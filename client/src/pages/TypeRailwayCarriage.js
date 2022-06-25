import React, {useCallback, useContext, useEffect, useRef, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {Loader} from '../components/Loader'
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";


export const TypeRailwayCarriage = () => {


    let emptyObject = {
        Class: ''
    };

    const {token} = useContext(AuthContext)
    const {request, loading} = useHttp()
    const [types, setTypes] = useState([])
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [objectDialog, setObjectDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [object, setObject] = useState(emptyObject);
    const [deleteObjectsDialog, setDeleteObjectsDialog] = useState(false);

    const toast = useRef(null);
    const dt = useRef(null)

    const getTypes = useCallback(async () => {
        try {
            const fetched = await request('/api/typeOfElement', 'GET', null, {
                Authorization: `Bearer ${token}`
            })

            setTypes(fetched)

        } catch (e) {

        }
    }, [request, token, types])


    const createObject = useCallback(async () => {
        try {
            setSubmitted(true);

            const fetched = await request('/api/typeOfElement', 'POST', {...object}, {
                Authorization: `Bearer ${token}`
            })
            toast.current.show({severity: 'success', summary: 'Уведомление', detail: fetched.message, life: 3000});


            setObjectDialog(false)
            setObject(emptyObject)
            getTypes()

        } catch (e) {
        }
    }, [token, object])

    const deleteObject = useCallback(async () => {
        try {

            setSubmitted(true);
            const array = selectedTypes.map(item => item._id)
            const fetched = await request(`/api/typeOfElement/`, 'DELETE', {array: array}, {
                Authorization: `Bearer ${token}`
            })

            toast.current.show({severity: 'success', summary: 'Уведомление', detail: fetched.message, life: 3000});


            setObjectDialog(false)
            setObject(emptyObject)
            setSelectedTypes([])
            getTypes()

        } catch (e) {
        }
    }, [token, selectedTypes])


    useEffect(() => {
        getTypes()
    }, [])

    if (loading) {
        return <Loader/>
    }


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _user = {...object};
        _user[`${name}`] = val;
        setObject(_user);
    }


    const header = (
        <>
            <div className="PageName p-text-center ">
                <h3>
                    СТРАНИЦА ТИПОВ ВАГОНОВ
                </h3>
            </div>
            <div>
                <div className='p-col-6'>
                    <React.Fragment>
                        <Button label="Создать" icon="pi pi-plus" className="p-button-success p-mr-2"
                                onClick={() => setObjectDialog(true)}/>
                        <Button label="Удалить" icon="pi pi-trash" className="p-button-danger p-mr-2"
                                onClick={deleteObject}
                                disabled={!selectedTypes || !selectedTypes.length}/>
                    </React.Fragment>
                </div>


                <div className='p-field p-col-6'>

                    <span className="p-input-icon-left">
                        <i className="pi pi-search"/>
                        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)}
                                   placeholder="Поиск..."/>
                    </span>
                </div>

            </div>


        </>

    );
    const hideDialog = () => {
        setObject(emptyObject)
        setObjectDialog(false)
    }

    const hideDeleteObjectsDialog = () => {
        setDeleteObjectsDialog(false);
    }


    const objectDialogFooter = (
        <React.Fragment>
            <Button label="Отмена" icon="pi pi-times" className="p-button-text" onClick={hideDialog}/>
            <Button label="Создать" icon="pi pi-check" className="p-button-text" onClick={createObject}/>
        </React.Fragment>
    );

    const deleteObjectsDialogFooter = (
        <React.Fragment>
            <Button label="Нет" icon="pi pi-times" className="p-button-text" onClick={hideDeleteObjectsDialog}/>
            <Button label="Да" icon="pi pi-check" className="p-button-text" onClick={deleteObject}/>
        </React.Fragment>
    );


    const ClassBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Тип Вагона</span>
                {rowData.Class}
            </>
        );
    }


    return (
        <div className="p-grid crud-demo">
            <div className='p-col-12'>
                <Toast ref={toast}/>

                <div className="card">
                    {/*<Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}/>*/}

                    <DataTable ref={dt} value={types} selection={selectedTypes} onSelectionChange={(e) => {
                        setSelectedTypes(e.value)
                    }}
                               dataKey="_id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                               className="datatable-responsive"
                               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                               currentPageReportTemplate="Показано с {first} по {last} из {totalRecords} Типов Вагонов"
                               globalFilter={globalFilter}
                               loading={loading}
                               header={header}>
                        <Column selectionMode="multiple" headerStyle={{width: '3rem'}}/>
                        <Column field="Class" header="Тип Вагона" body={ClassBodyTemplate} sortable/>
                    </DataTable>

                    <Dialog visible={objectDialog} style={{width: '650px'}} header="Создание поезда" modal
                            className="p-fluid" footer={objectDialogFooter} onHide={hideDialog} position='top'>
                        <div className="p-field">
                            <label htmlFor="Class">Тип вагона</label>
                            <InputText id="Class" value={object.Class}
                                       onChange={(e) => onInputChange(e, 'Class')} required autoFocus keyfilter={/[0-9a-zA-Zа-яА-Я]/} minLength="2"  maxLength="7"/>
                            {submitted && !object.Class &&
                            <small className="p-error">Тип вагона обязателен</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteObjectsDialog} style={{width: '450px'}} header="Подтверждение" modal
                            footer={deleteObjectsDialogFooter} onHide={hideDeleteObjectsDialog} position='top'>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{fontSize: '2rem'}}/>
                            {object && <span>Вы точно хотите удалить выбранные тип вагонов  ?</span>}
                        </div>
                    </Dialog>

                </div>

            </div>
        </div>
    )
}
