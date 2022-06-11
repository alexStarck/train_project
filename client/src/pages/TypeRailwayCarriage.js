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
import {Dropdown} from "primereact/dropdown";


export const TypeRailwayCarriage = () => {
    const {token} = useContext(AuthContext)
    const {request, loading} = useHttp()
    const [types, setTypes] = useState([])
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [typeDialog, setTypeDialog] = useState(false)
    const [deleteObjectDialog, setDeleteObjectDialog] = useState(false);
    const [deleteObjectsDialog, setDeleteObjectsDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);


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

    useEffect(() => {
        getTypes()
    }, [])

    if (loading) {
        return <Loader/>
    }

    const header = (
        <>
            <div className="PageName p-text-center ">
                <h3>
                    СТРАНИЦА вагонов
                </h3>
            </div>
            <div>
                <div className='p-col-6'>
                    <React.Fragment>
                        <Button label="Создать" icon="pi pi-plus" className="p-button-success p-mr-2"
                                onClick={() => console.log('create')}/>
                        <Button label="Удалить" icon="pi pi-trash" className="p-button-danger p-mr-2"
                                onClick={() => console.log('delete')}
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

    const objectEditDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog}/>
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={createObject}/>
        </React.Fragment>
    );


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
                               currentPageReportTemplate="Показано с {first} по {last} из {totalRecords} Поездов"
                               globalFilter={globalFilter}
                               loading={loading}
                               header={header}>
                        <Column selectionMode="multiple" headerStyle={{width: '3rem'}}/>
                        {/*<Column field="Class" header="Тип Вагона" body={ObjectNameBodyTemplate} sortable/>*/}
                    </DataTable>
                </div>

                <Dialog visible={typeDialog} style={{width: '650px'}} header="Создание вагона" modal
                        className="p-fluid" footer={objectEditDialogFooter} onHide={hideDialog} position='top'>

                    <div className="p-field">
                        <label htmlFor="objectName">Номер</label>
                        <InputText id="objectName" value={object.objectName}
                                   onChange={(e) => onInputChange(e, 'objectName')} required autoFocus/>
                        {submitted && !object.objectName && <small className="p-error">objectName is required.</small>}
                    </div>

                    <div className="p-field">
                        <label htmlFor="type">Тип</label>
                        <InputText id="type" value={object.type} onChange={(e) => onInputChange(e, 'type')} required
                                   autoFocus/>
                        {submitted && !object.type && <small className="p-error">type is required.</small>}
                    </div>
                    <div className="p-field" style={{height: height}}>
                        <label htmlFor="type">Состав</label>
                        <Dropdown value={valueComposition} options={valuesCom} onChange={onValueCompositionChange}
                                  optionLabel="name" placeholder="Select a value of composition"/>
                    </div>
                    {composition !== null && (composition.map((item, index) => {
                            return (
                                <div className="p-mb-2 p-d-flex " key={index}>
                                    <InputText className="p-mr-2 p-d-inline-flex" value={item.number} disabled/>
                                    <Dropdown className="p-d-inline-flex" value={item.class} options={classList}
                                              onChange={(e) => onCompositionChange(e, item.number)}
                                              placeholder="тип вагона" minLength={2} maxLength={2} editable required/>
                                    {submitted && !item.class && <small className="p-error">class is required.</small>}
                                </div>
                            )
                        })
                    )}
                    <div className="p-field">
                        <label htmlFor="detail">Детали</label>
                        <InputText id="detail" value={object.detail} onChange={(e) => onInputChange(e, 'detail')}
                                   required autoFocus/>
                        {submitted && !object.detail && <small className="p-error">detail is required.</small>}
                    </div>
                </Dialog>

                {/*<Dialog visible={objectDialog} style={{width: '650px'}} header="Создание поезда" modal*/}
                {/*        className="p-fluid" footer={objectDialogFooter} onHide={hideDialog} position='top'>*/}
                {/*    <div className="p-field">*/}
                {/*        <label htmlFor="objectName">Номер</label>*/}
                {/*        <InputText id="objectName" value={object.objectName}*/}
                {/*                   onChange={(e) => onInputChange(e, 'objectName')} required autoFocus/>*/}
                {/*        {submitted && !object.objectName && <small className="p-error">objectName is required.</small>}*/}
                {/*    </div>*/}

                {/*    <div className="p-field">*/}
                {/*        <label htmlFor="type">Тип</label>*/}
                {/*        <InputText id="type" value={object.type} onChange={(e) => onInputChange(e, 'type')} required*/}
                {/*                   autoFocus/>*/}
                {/*        {submitted && !object.type && <small className="p-error">type is required.</small>}*/}
                {/*    </div>*/}

                {/*    <div className="p-field" style={{height: height}}>*/}
                {/*        <label htmlFor="type">Состав</label>*/}
                {/*        <Dropdown value={valueComposition} options={valuesCom} onChange={onValueCompositionChange}*/}
                {/*                  optionLabel="name" placeholder="Select a value of composition"/>*/}
                {/*        {submitted && !object.type && <small className="p-error">type is required.</small>}*/}
                {/*    </div>*/}
                {/*    {composition !== null && (composition.map((item, index) => {*/}
                {/*            return (*/}
                {/*                <div className="p-mb-2 p-d-flex " key={index}>*/}
                {/*                    <InputText className="p-mr-2 p-d-inline-flex" value={item.number} disabled/>*/}
                {/*                    <InputText className="p-d-inline-flex" value={item.class}*/}
                {/*                               keyfilter={/^[0-9а-яА-Я]+$/}*/}
                {/*                               onChange={(e) => onCompositionChange(e, item.number)}*/}
                {/*                               placeholder="тип вагона" minLength={2} maxLength={2} required/>*/}
                {/*                </div>*/}
                {/*            )*/}
                {/*        })*/}
                {/*    )}*/}
                {/*    <div className="p-field">*/}
                {/*        <label htmlFor="detail">Детали</label>*/}
                {/*        <InputText id="detail" value={object.detail} onChange={(e) => onInputChange(e, 'detail')}*/}
                {/*                   required autoFocus/>*/}
                {/*        {submitted && !object.detail && <small className="p-error">detail is required.</small>}*/}
                {/*    </div>*/}

                {/*</Dialog>*/}

                {/*<Dialog visible={deleteObjectDialog} style={{width: '450px'}} header="Подтверждение" modal*/}
                {/*        footer={deleteObjectDialogFooter} onHide={hideDeleteObjectDialog} position='top'>*/}
                {/*    <div className="confirmation-content">*/}
                {/*        <i className="pi pi-exclamation-triangle p-mr-3" style={{fontSize: '2rem'}}/>*/}
                {/*        {object && <span>Вы точно хотите удалить  <b>{object.name}</b>?</span>}*/}
                {/*    </div>*/}
                {/*</Dialog>*/}

                {/*<Dialog visible={deleteObjectsDialog} style={{width: '450px'}} header="Подтверждение" modal*/}
                {/*        footer={deleteObjectsDialogFooter} onHide={hideDeleteObjectsDialog} position='top'>*/}
                {/*    <div className="confirmation-content">*/}
                {/*        <i className="pi pi-exclamation-triangle p-mr-3" style={{fontSize: '2rem'}}/>*/}
                {/*        {object && <span>Вы точно хотите удалить выбранные поезда ?</span>}*/}
                {/*    </div>*/}
                {/*</Dialog>*/}
            </div>
        </div>
    )
}
