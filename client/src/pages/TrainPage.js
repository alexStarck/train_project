import React, {useCallback, useContext, useEffect, useState, useRef} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Toast} from 'primereact/toast';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import {Dropdown} from 'primereact/dropdown';


export const TrainPage = () => {
    let emptyObject = {
        objectName: '',
        type: '',
        company: '',
        composition: [],
        detail: ''
    };
    const {request, loading} = useHttp()
    const {token} = useContext(AuthContext)
    const [localComposition, setLocalComposition] = useState(null)
    const [composition, setComposition] = useState(null)
    const [valueComposition, setValueComposition] = useState(null)
    const [height, setHeight] = useState('250px')
    const [objectsList, setObjectsList] = useState(null);
    const [classList, setClassList] = useState(null);
    const [objectDialog, setObjectDialog] = useState(false);
    const [objectEditDialog, setObjectEditDialog] = useState(false)
    const [object, setObject] = useState(emptyObject);
    const [selectedObjects, setSelectedObjects] = useState([]);
    const [deleteObjectDialog, setDeleteObjectDialog] = useState(false);
    const [deleteObjectsDialog, setDeleteObjectsDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);


    const toast = useRef(null);
    const dt = useRef(null)


    const fetchObjects = useCallback(async () => {
        try {
            const fetched = await request('/api/objects/list', 'POST', null, {
                Authorization: `Bearer ${token}`
            })
            if (JSON.stringify(fetched) !== JSON.stringify(objectsList)) {
                setObjectsList(fetched)
            }
        } catch (e) {
        }
    }, [token, request, objectsList])
    const fetchClasses = useCallback(async () => {
        try {
            const fetched = await request('/api/typeOfElement', 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            setClassList(fetched)
        } catch (e) {
        }
    }, [token, request, classList])


    useEffect(() => {
        fetchObjects()
        fetchClasses()
    }, []);


    const openNew = () => {
        setObject(emptyObject);
        setSubmitted(false);
        setObjectDialog(true);
        setComposition(null)
        setLocalComposition(null)
        setValueComposition(null)
    }

    const hideDialog = () => {
        setSubmitted(false);
        setObjectDialog(false);
        setObjectEditDialog(false);
        setComposition(null)
        setLocalComposition(null)
        setValueComposition(null)
    }

    const hideDeleteObjectDialog = () => {
        setDeleteObjectDialog(false);
    }

    const hideDeleteObjectsDialog = () => {
        setDeleteObjectsDialog(false);
    }

    const createObject = useCallback(async () => {
        try {
            setSubmitted(true);

            const fetched = await request('/api/objects/create', 'POST', {...object, composition}, {
                Authorization: `Bearer ${token}`
            })
            toast.current.show({severity: 'success', summary: 'Уведомление', detail: fetched.message, life: 3000});

            if (JSON.stringify(fetched) !== JSON.stringify(objectsList)) {

            }
            setObjectDialog(false);
            setObject(emptyObject);
            setComposition(null)
            setLocalComposition(null)
            setValueComposition(null)
            fetchObjects()


        } catch (e) {
        }
    }, [token, request, object])


    const saveObject = useCallback(async () => {
        try {
            setSubmitted(true);
            if (!composition.find(el => el.class.length === 0) || !composition.find(el => el.class.length === 1)) {

                const fetched = await request('/api/objects/edit', 'POST', {...object, composition}, {
                    Authorization: `Bearer ${token}`
                })

                if (JSON.stringify(fetched) !== JSON.stringify(objectsList)) {

                }
                toast.current.show({severity: 'success', summary: 'Уведомление', detail: fetched.message, life: 3000});
                setObjectEditDialog(false);
                setObject(emptyObject);
                setComposition(null)
                setLocalComposition(null)
                setValueComposition(null)


                fetchObjects()
            }


        } catch (e) {
        }
    }, [token, request, composition, object])


    const editObject = (object) => {
        setObject({...object});

        setValueComposition({name: object.composition.length.toString()})
        if (object.composition.length !== 0) {
            setHeight('100px')
        }
        createComposition(object.composition.length, object.composition)
        setObjectEditDialog(true);

    }

    const confirmDeleteObject = (product) => {
        setObject(product);
        setDeleteObjectDialog(true);
    }

    const deleteObject = useCallback(async () => {
        try {
            setSubmitted(true);

            const fetched = await request('/api/objects/delete', 'POST', {...object}, {
                Authorization: `Bearer ${token}`
            })


            setDeleteObjectDialog(false);
            setObject(emptyObject);
            fetchObjects()
            toast.current.show({severity: 'success', summary: 'Уведомление', detail: fetched.message, life: 3000});
            //fetchUsers()
        } catch (e) {
        }
    }, [token, request, object])


    const confirmDeleteSelected = () => {

        setDeleteObjectsDialog(true);
    }

    const deleteSelectedObjects = useCallback(async () => {
        try {
            setSubmitted(true);

            const fetched = await request('/api/objects/deleteM', 'POST', selectedObjects, {
                Authorization: `Bearer ${token}`
            })


            setDeleteObjectsDialog(false);
            setSelectedObjects(null);
            fetchObjects()
            toast.current.show({severity: 'success', summary: 'Уведомление', detail: fetched.message, life: 3000});
        } catch (e) {
        }
    }, [token, request, selectedObjects])


    const onValueCompositionChange = (e) => {
        setValueComposition(e.value);
        setHeight('100px')
        createComposition(e.value.name, [])
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _user = {...object};
        _user[`${name}`] = val;
        setObject(_user);
    }


    const valuesCom = [
        {name: '1'},
        {name: '2'},
        {name: '3'},
        {name: '4'},
        {name: '5'},
        {name: '6'},
        {name: '7'},
        {name: '8'},
        {name: '9'},
        {name: '10'},
        {name: '11'},
        {name: '12'},
        {name: '13'},
        {name: '14'},
        {name: '15'},
        {name: '16'},
        {name: '17'},
        {name: '18'},
        {name: '19'},
        {name: '20'},
        {name: '21'},
        {name: '22'},
        {name: '23'},
        {name: '24'},
        {name: '25'},
        {name: '26'},
        {name: '27'},
        {name: '28'}
    ];


    const compositionBodyTemplate = (rowData) => {

        return (
            <div>
                <span className="p-column-title">Состав</span>
                <span>{rowData.composition.length}</span>
            </div>
        )
    }


    const createComposition = (value, array) => {

        if (localComposition !== null) {
            let arr = []
            if (Number(value) < localComposition.length) {
                for (let i = 0; i < Number(value); i++) {
                    arr.push(localComposition[i])
                }
            } else if (object.composition.length !== 0) {

                let j = 0
                while (j < localComposition.length) {
                    arr.push(localComposition[j])
                    j++
                }

                for (let i = j + 1; i < Number(value) + 1; i++) {
                    arr.push({
                        number: i,
                        class: ''
                    })
                }
            } else {

                let j = 0
                while (j < localComposition.length) {
                    arr.push(localComposition[j])
                    j++
                }
                for (let i = j + 1; i < Number(value) + 1; i++) {
                    arr.push({
                        number: i,
                        class: ''
                    })
                }
            }

            setComposition(arr)
            setLocalComposition(arr)
        } else {

            let arr = []
            if (array.length !== 0) {

                for (let i = 1; i < Number(value) + 1; i++) {
                    arr.push({
                        number: Number(array[i - 1].number),
                        class: array[i - 1].class
                    })
                }

            } else {
                for (let i = 1; i < Number(value) + 1; i++) {
                    arr.push({
                        number: i,
                        class: ''
                    })
                }
            }

            setComposition(arr.sort(function (a, b) {
                if (a.number > b.number) {
                    return 1;
                }
                if (a.number < b.number) {
                    return -1;
                }

                return 0;
            }))
            setLocalComposition(arr.sort(function (a, b) {
                if (a.number > b.number) {
                    return 1;
                }
                if (a.number < b.number) {
                    return -1;
                }

                return 0;
            }))
        }

    }


    const onCompositionChange = (e, name) => {

        switch (e.target.value.length) {
            case 0:
                Save()
                break;
            case 1:
                if (e.target.value.match(/^[0-9а-яА-Я]+$/) !== null) {
                    Save()
                } else {
                    e.target.value = ''
                }
                break;
            case 2:
                if (e.target.value.match(/^[0-9а-яА-Я]+$/) !== null) {
                    Save()
                } else {
                    e.target.value = composition[Number(name) - 1].class
                }
                break;
        }

        function Save() {
            setComposition(composition.map(function (obj) {

                if (obj.number === name)
                    return {...obj, class: e.target.value}

                return obj
            }))

            setLocalComposition(composition.map(function (obj) {

                if (obj.number === name)
                    return {...obj, class: e.target.value}

                return obj
            }))
        }


    }


    const TypeNameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Тип</span>
                {rowData.type}
            </>
        );
    }

    const ObjectNameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Номер</span>
                {rowData.objectName}
            </>
        );
    }

    const DetailBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Детали</span>
                {rowData.detail}
            </>
        );
    }


    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => {
                    editObject(rowData);
                    if (!rowData.composition.length) setHeight('250px')
                }}/>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning"
                        onClick={() => confirmDeleteObject(rowData)}/>
            </React.Fragment>
        );
    }


    const header = (
        <>
            <div className="PageName p-text-center ">
                <h3>
                    СТРАНИЦА СОТРУДНИКОВ
                </h3>
            </div>
            <div>
                <div className='p-col-6'>
                    <React.Fragment>
                        <Button label="Создать" icon="pi pi-plus" className="p-button-success p-mr-2"
                                onClick={openNew}/>
                        <Button label="Удалить" icon="pi pi-trash" className="p-button-danger p-mr-2"
                                onClick={confirmDeleteSelected} disabled={!selectedObjects || !selectedObjects.length}/>
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
            <Button label="Отмена" icon="pi pi-times" className="p-button-text" onClick={hideDialog}/>
            <Button label="Сохранить" icon="pi pi-check" className="p-button-text" onClick={saveObject}/>
        </React.Fragment>
    );
    const objectDialogFooter = (
        <React.Fragment>
            <Button label="Отмена" icon="pi pi-times" className="p-button-text" onClick={hideDialog}/>
            <Button label="Создать" icon="pi pi-check" className="p-button-text" onClick={createObject}/>
        </React.Fragment>
    );
    const deleteObjectDialogFooter = (
        <React.Fragment>
            <Button label="Нет" icon="pi pi-times" className="p-button-text" onClick={hideDeleteObjectDialog}/>
            <Button label="Да" icon="pi pi-check" className="p-button-text" onClick={deleteObject}/>
        </React.Fragment>
    );
    const deleteObjectsDialogFooter = (
        <React.Fragment>
            <Button label="Нет" icon="pi pi-times" className="p-button-text" onClick={hideDeleteObjectsDialog}/>
            <Button label="Да" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedObjects}/>
        </React.Fragment>
    );


    return (
        <div className="p-grid crud-demo">
            <div className='p-col-12'>
                <Toast ref={toast}/>

                <div className="card">
                    {/*<Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}/>*/}

                    <DataTable ref={dt} value={objectsList} selection={selectedObjects} onSelectionChange={(e) => {
                        setSelectedObjects(e.value)
                    }}
                               dataKey="_id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                               className="datatable-responsive"
                               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                               currentPageReportTemplate="Показано с {first} по {last} из {totalRecords} Поездов"
                               globalFilter={globalFilter}
                               loading={loading}
                               header={header}>
                        <Column selectionMode="multiple" headerStyle={{width: '3rem'}}/>
                        <Column field="objectName" header="Номер" body={ObjectNameBodyTemplate} sortable/>
                        <Column field="type" header="Тип" body={TypeNameBodyTemplate} sortable/>
                        <Column field="composition" header="Состав" body={compositionBodyTemplate}/>
                        <Column field="detail" header="Детали" headerStyle={{width: '500px'}}
                                body={DetailBodyTemplate}/>
                        <Column body={actionBodyTemplate}/>
                    </DataTable>
                </div>

                <Dialog visible={objectEditDialog} style={{width: '650px'}} header="Редактирование поезда" modal
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

                <Dialog visible={objectDialog} style={{width: '650px'}} header="Создание поезда" modal
                        className="p-fluid" footer={objectDialogFooter} onHide={hideDialog} position='top'>
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
                        {submitted && !object.type && <small className="p-error">type is required.</small>}
                    </div>
                    {composition !== null && (composition.map((item, index) => {
                            return (
                                <div className="p-mb-2 p-d-flex " key={index}>
                                    <InputText className="p-mr-2 p-d-inline-flex" value={item.number} disabled/>
                                    <InputText className="p-d-inline-flex" value={item.class}
                                               keyfilter={/^[0-9а-яА-Я]+$/}
                                               onChange={(e) => onCompositionChange(e, item.number)}
                                               placeholder="тип вагона" minLength={2} maxLength={2} required/>
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

                <Dialog visible={deleteObjectDialog} style={{width: '450px'}} header="Подтверждение" modal
                        footer={deleteObjectDialogFooter} onHide={hideDeleteObjectDialog} position='top'>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{fontSize: '2rem'}}/>
                        {object && <span>Вы точно хотите удалить  <b>{object.name}</b>?</span>}
                    </div>
                </Dialog>

                <Dialog visible={deleteObjectsDialog} style={{width: '450px'}} header="Подтверждение" modal
                        footer={deleteObjectsDialogFooter} onHide={hideDeleteObjectsDialog} position='top'>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{fontSize: '2rem'}}/>
                        {object && <span>Вы точно хотите удалить выбранные поезда ?</span>}
                    </div>
                </Dialog>
            </div>
        </div>
    )

}