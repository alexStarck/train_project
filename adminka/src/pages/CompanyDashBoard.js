import React, {useCallback, useContext, useEffect, useState, useRef} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Toast} from 'primereact/toast';
import {Button} from 'primereact/button';
import {Toolbar} from 'primereact/toolbar';
import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';


export const CompanyDashBoard = () => {
    let emptyCompany = {
        name: '',
        nameObject: ''
    };
    const {request} = useHttp()
    const {token} = useContext(AuthContext)
    const [companiesList, setCompaniesList] = useState(null);
    const [companyDialog, setCompanyDialog] = useState(false);
    const [companyEditDialog, setCompanyEditDialog] = useState(false)
    const [company, setCompany] = useState(emptyCompany);
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [deleteCompanyDialog, setDeleteCompanyDialog] = useState(false);
    const [deleteCompaniesDialog, setDeleteCompaniesDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);


    const toast = useRef(null);
    const dt = useRef(null)


    const fetchCompanies = useCallback(async () => {
        try {
            const fetched = await request('/api/company/list', 'POST', {}, {
                Authorization: `Bearer ${token}`
            })
            setCompaniesList(fetched)
        } catch (e) {
        }
    }, [token, request, companiesList])


    useEffect(() => {
        fetchCompanies()
    }, []);


    const openNew = () => {
        setCompany(emptyCompany);
        setSubmitted(false);
        setCompanyDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setCompanyDialog(false);
        setCompanyEditDialog(false);
    }

    const hideDeleteCompanyDialog = () => {
        setDeleteCompanyDialog(false);
    }

    const hideDeleteCompaniesDialog = () => {
        setDeleteCompaniesDialog(false);
    }

    const createCompany = useCallback(async () => {
        try {
            setSubmitted(true);
            const fetched = await request('/api/company/create', 'POST', {...company}, {
                Authorization: `Bearer ${token}`
            })
            setCompanyDialog(false);
            setCompany(emptyCompany);
            fetchCompanies()
        } catch (e) {
        }
    }, [token, request, company])


    const saveCompany = useCallback(async () => {
        try {
            setSubmitted(true);
            const fetched = await request('/api/company/edit', 'POST', {...company}, {
                Authorization: `Bearer ${token}`
            })
            toast.current.show({severity: 'success', summary: 'Successful', detail: fetched.message, life: 3000});
            setCompanyEditDialog(false);
            setCompany(emptyCompany);
            fetchCompanies()
        } catch (e) {
        }
    }, [token, request, company])


    const editCompany = (product) => {
        setCompany({...product});
        setCompanyEditDialog(true);

    }

    const confirmDeleteCompany = (product) => {
        setCompany(product);
        setDeleteCompanyDialog(true);
    }

    const deleteCompany = useCallback(async () => {
        try {
            console.log(company)
            setSubmitted(true);
            const fetched = await request('/api/company/delete', 'POST', {...company}, {
                Authorization: `Bearer ${token}`
            })
            setDeleteCompanyDialog(false);
            setCompany(emptyCompany);
            fetchCompanies()
            toast.current.show({severity: 'success', summary: 'Successful', detail: fetched.message, life: 3000});
        } catch (e) {
        }
    }, [token, request, company])


    const confirmDeleteSelected = () => {
        setDeleteCompaniesDialog(true);
    }

    const deleteSelectedCompanies = useCallback(async () => {
        try {
            setSubmitted(true);
            const fetched = await request('/api/company/deleteM', 'POST', selectedCompanies, {
                Authorization: `Bearer ${token}`
            })

            setDeleteCompaniesDialog(false);
            setSelectedCompanies(null);
            fetchCompanies()
            toast.current.show({severity: 'success', summary: 'Successful', detail: fetched.message, life: 3000});

        } catch (e) {
        }
    }, [token, request, selectedCompanies])


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _user = {...company};
        _user[`${name}`] = val;
        setCompany(_user);
    }


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Создить" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew}/>
                <Button label="Удалить" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected}
                        disabled={!selectedCompanies || !selectedCompanies.length}/>
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
            </React.Fragment>
        )
    }


    const usersBodyTemplate = (rowData) => {

        return <span
            style={{
                borderRadius: ' 2px',
                padding: ' .25em .5rem',
                textTransform: 'uppercase',
                fontWeight: '700',
                fontSize: '12px',
                letterSpacing: '.3px',
                background: '#FFCDD2',
                color: '#C63737'
            }}
        >{rowData.users}</span>
    }

    const adminsBodyTemplate = (rowData) => {

        return <span
            style={{
                borderRadius: ' 2px',
                padding: ' .25em .5rem',
                textTransform: 'uppercase',
                fontWeight: '700',
                fontSize: '12px',
                letterSpacing: '.3px',
                background: '#C8E6C9',
                color: '#256029'
            }}
        >{rowData.admins}</span>

    }


    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2"
                        onClick={() => editCompany(rowData)}/>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning"
                        onClick={() => confirmDeleteCompany(rowData)}/>
            </React.Fragment>
        );
    }

    const header = (
        <div className="table-header">
            <h5 className="p-m-0">Управление Организациями</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search"/>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..."/>
            </span>
        </div>
    );
    const companyEditDialogFooter = (
        <React.Fragment>
            <Button label="Отменить" icon="pi pi-times" className="p-button-text" onClick={hideDialog}/>
            <Button label="Сохранить" icon="pi pi-check" className="p-button-text" onClick={saveCompany}/>
        </React.Fragment>
    );
    const companyDialogFooter = (
        <React.Fragment>
            <Button label="Отменить" icon="pi pi-times" className="p-button-text" onClick={hideDialog}/>
            <Button label="Создать" icon="pi pi-check" className="p-button-text" onClick={createCompany}/>
        </React.Fragment>
    );
    const deleteCompanyDialogFooter = (
        <React.Fragment>
            <Button label="Нет" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCompanyDialog}/>
            <Button label="Да" icon="pi pi-check" className="p-button-text" onClick={deleteCompany}/>
        </React.Fragment>
    );
    const deleteCompaniesDialogFooter = (
        <React.Fragment>
            <Button label="Нет" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCompaniesDialog}/>
            <Button label="Да" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedCompanies}/>
        </React.Fragment>
    );


    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast}/>

            <div className="card">
                <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}/>

                <DataTable ref={dt} value={companiesList} selection={selectedCompanies} onSelectionChange={(e) => {
                    setSelectedCompanies(e.value)
                }}
                           dataKey="_id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                           currentPageReportTemplate="Showing {first} to {last} of {totalRecords} companies"
                           globalFilter={globalFilter}
                           header={header}>

                    <Column selectionMode="multiple" headerStyle={{width: '3rem'}}/>
                    <Column field="name" header="Название" sortable/>
                    <Column field="nameObject" header="Полное название" sortable/>
                    <Column field="admins" header="Админов" body={adminsBodyTemplate}/>
                    <Column field="users" header="Пользователей" body={usersBodyTemplate}/>
                    <Column body={actionBodyTemplate}/>
                </DataTable>
            </div>

            <Dialog visible={companyEditDialog} style={{width: '450px'}} header="Редактирование Организации" modal
                    className="p-fluid" footer={companyEditDialogFooter} onHide={hideDialog}>


                <div className="p-field">
                    <label htmlFor="name">Название</label>
                    <InputText id="name" value={company.name} onChange={(e) => onInputChange(e, 'name')} required
                               autoFocus/>
                    {submitted && !company.name && <small className="p-error">Поле обязательное</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="name">Полное название</label>
                    <InputText id="nameObject" value={company.nameObject}
                               onChange={(e) => onInputChange(e, 'nameObject')} required autoFocus/>
                    {submitted && !company.nameObject && <small className="p-error">Поле обязательное</small>}
                </div>


            </Dialog>

            <Dialog visible={companyDialog} style={{width: '450px'}} header="Создание Организации" modal className="p-fluid"
                    footer={companyDialogFooter} onHide={hideDialog}>
                <div className="p-field">
                    <label htmlFor="name">Название</label>
                    <InputText id="name" value={company.name} onChange={(e) => onInputChange(e, 'name')} required
                               autoFocus/>
                    {submitted && !company.name && <small className="p-error">Поле обязательное</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="name">Полное название</label>
                    <InputText id="nameObject" value={company.nameObject}
                               onChange={(e) => onInputChange(e, 'nameObject')} required autoFocus/>
                    {submitted && !company.nameObject && <small className="p-error">Поле обязательное</small>}
                </div>

            </Dialog>

            <Dialog visible={deleteCompanyDialog} style={{width: '450px'}} header="Подтверждение удаления" modal
                    footer={deleteCompanyDialogFooter} onHide={hideDeleteCompanyDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{fontSize: '2rem'}}/>
                    {company && <span>Удалить выбранную организацию <b>{company.name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteCompaniesDialog} style={{width: '450px'}} header="Подтверждение удаления" modal
                    footer={deleteCompaniesDialogFooter} onHide={hideDeleteCompaniesDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{fontSize: '2rem'}}/>
                    {company && <span>Удалить выбранные организации ?</span>}
                </div>
            </Dialog>
        </div>
    )

}