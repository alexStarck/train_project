import React, {useCallback, useContext, useEffect, useState, useRef} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Toast} from 'primereact/toast';
import {Button} from 'primereact/button';
import {Toolbar} from 'primereact/toolbar';
import {InputMask} from 'primereact/inputmask';
import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import {Password} from 'primereact/password';
import {Dropdown} from "primereact/dropdown";


export const AdminDashBoard = () => {
    let emptyUser = {
        login: '',
        password: '',
        name: '',
        surname: '',
        phoneNumber: '',
        personnelNumber: '',
        company: ''
    };
    const {request} = useHttp()
    const {token} = useContext(AuthContext)
    const [usersList, setUsersList] = useState(null);
    const [companies, setCompanies] = useState([])
    const [valueCompany, setValueCompany] = useState(null)
    const [userDialog, setUserDialog] = useState(false);
    const [userEditDialog, setUserEditDialog] = useState(false)
    const [user, setUser] = useState(emptyUser);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);


    const toast = useRef(null);
    const dt = useRef(null)


    const fetchUsers = useCallback(async () => {
        try {
            const fetched = await request('/api/admin/list', 'POST', null, {
                Authorization: `Bearer ${token}`
            })
            setUsersList(fetched)
        } catch (e) {
        }
    }, [token, request, usersList])


    const fetchCompanies = useCallback(async () => {
        try {
            const fetched = await request('/api/company/list', 'POST', null, {
                Authorization: `Bearer ${token}`
            })
            if (companies.toString() !== fetched.toString()) {
                setCompanies(fetched)
            }
        } catch (e) {
        }
    }, [token, request, companies])


    useEffect(() => {
        fetchCompanies()
        fetchUsers()
    }, []);


    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
        setUserEditDialog(false);
    }

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    }

    const hideDeleteUsersDialog = () => {
        setDeleteUsersDialog(false);
    }

    const createUser = useCallback(async () => {
        try {
            setSubmitted(true);
            const fetched = await request('/api/admin/create', 'POST', {...user}, {//,company:valueCompany._id
                Authorization: `Bearer ${token}`
            })
            toast.current.show({severity: 'success', summary: 'Создано', detail: fetched.message, life: 3000});
            setUserDialog(false);
            setValueCompany(null)
            setUser(emptyUser);
            fetchCompanies()
            fetchUsers()
        } catch (e) {
        }
    }, [token, request, user])


    const saveUser = useCallback(async () => {
        try {
            setSubmitted(true);
            const fetched = await request('/api/admin/edit', 'POST', {...user,companyName:valueCompany.name}, {
                Authorization: `Bearer ${token}`
            })
            toast.current.show({severity: 'success', summary: 'Изменено', detail: fetched.message, life: 3000});
            setUserEditDialog(false);
            setValueCompany(null)
            setUser(emptyUser);
            fetchCompanies()
            fetchUsers()
        } catch (e) {
        }
    }, [token, request, user])


    const editUser = (product) => {
        setValueCompany(companies.find(company => company._id.toString() === product.company))
        setUser({...product});
        setUserEditDialog(true);
    }

    const confirmDeleteUser = (product) => {
        setUser(product);
        setDeleteUserDialog(true);
    }

    const deleteUser = useCallback(async () => {
        try {
            setSubmitted(true);
            const fetched = await request('/api/admin/delete', 'POST', {...user}, {
                Authorization: `Bearer ${token}`
            })
            setDeleteUserDialog(false);
            setUser(emptyUser);
            fetchCompanies()
            fetchUsers()
            toast.current.show({severity: 'success', summary: 'Удален', detail: fetched.message, life: 3000});
        } catch (e) {
        }
    }, [token, request, user])


    const confirmDeleteSelected = () => {
        setDeleteUsersDialog(true);
    }

    const deleteSelectedProducts = useCallback(async () => {
        try {
            setSubmitted(true);
            const fetched = await request('/api/admin/deleteM', 'POST', selectedUsers, {
                Authorization: `Bearer ${token}`
            })

            setDeleteUsersDialog(false);
            setSelectedUsers(null);
            fetchCompanies()
            fetchUsers()
            toast.current.show({severity: 'success', summary: 'Удалены', detail: fetched.message, life: 3000});

        } catch (e) {
        }
    }, [token, request, selectedUsers])
    const onValueCompositionChange = (e) => {
        let _user = {...user};
        _user[`company`] = e.value._id;
        setUser(_user);
        setValueCompany(e.value)
    }


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _user = {...user};
        _user[`${name}`] = val;
        setUser(_user);
    }


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Создать" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew}/>
                <Button label="Удалить" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected}
                        disabled={!selectedUsers || !selectedUsers.length}/>
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <>
            </>
        )
    }


    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2"
                        onClick={() => editUser(rowData)}/>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning"
                        onClick={() => confirmDeleteUser(rowData)}/>
            </React.Fragment>
        );
    }

    const header = (
        <div className="table-header">
            <h5 className="p-m-0">Управление Администраторами</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search"/>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..."/>
            </span>
        </div>
    );
    const userEditDialogFooter = (
        <React.Fragment>
            <Button label="Отменить" icon="pi pi-times" className="p-button-text" onClick={hideDialog}/>
            <Button label="Сохранить" icon="pi pi-check" className="p-button-text" onClick={saveUser}/>
        </React.Fragment>
    );
    const userDialogFooter = (
        <React.Fragment>
            <Button label="Отменить" icon="pi pi-times" className="p-button-text" onClick={hideDialog}/>
            <Button label="Создать" icon="pi pi-check" className="p-button-text" onClick={createUser}/>
        </React.Fragment>
    );
    const deleteUserDialogFooter = (
        <React.Fragment>
            <Button label="Нет" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUserDialog}/>
            <Button label="Да" icon="pi pi-check" className="p-button-text" onClick={deleteUser}/>
        </React.Fragment>
    );
    const deleteUsersDialogFooter = (
        <React.Fragment>
            <Button label="Нет" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUsersDialog}/>
            <Button label="Да" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts}/>
        </React.Fragment>
    );


    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast}/>

            <div className="card">
                <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}/>

                <DataTable ref={dt} value={usersList} selection={selectedUsers} onSelectionChange={(e) => {
                    setSelectedUsers(e.value)
                }}
                           dataKey="_id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                           currentPageReportTemplate="Показано {first} из  {last} всего {totalRecords} администраторов"
                           globalFilter={globalFilter}
                           header={header}>

                    <Column selectionMode="multiple" headerStyle={{width: '3rem'}}/>
                    <Column field="personnelNumber" header="Персональный номер" sortable/>
                    <Column field="login" header="логин" sortable/>
                    <Column field="name" header="Имя" sortable/>
                    <Column field="surname" header="Фамилия" sortable/>
                    <Column field="companyName" header="Компания" sortable/>
                    <Column body={actionBodyTemplate}/>
                </DataTable>
            </div>

            <Dialog visible={userEditDialog} style={{width: '450px'}} header="Редактирование Администратора" modal className="p-fluid"
                    footer={userEditDialogFooter} onHide={hideDialog}>
                <div className="p-field">
                    <label htmlFor="login">Логин</label>
                    <InputText id="login" value={user.login} onChange={(e) => onInputChange(e, 'login')} required
                               autoFocus/>
                    {submitted && !user.login && <small className="p-error">Поле обязательное</small>}
                </div>

                <div className="p-field">
                    <label htmlFor="name">Имя</label>
                    <InputText id="name" value={user.name} onChange={(e) => onInputChange(e, 'name')} required
                               autoFocus/>
                    {submitted && !user.name && <small className="p-error">Поле обязательное</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="surname">Фамилия</label>
                    <InputText id="surname" value={user.surname} onChange={(e) => onInputChange(e, 'surname')} required
                               autoFocus/>
                    {submitted && !user.surname && <small className="p-error">Поле обязательное</small>}
                </div>

                <div className="p-field">
                    <label htmlFor="phoneNumber">Телефонный номер</label>
                    <InputMask id="phone" mask="(999) 999-9999" placeholder="(999) 999-9999" value={user.phoneNumber}
                               onChange={(e) => onInputChange(e, 'phoneNumber')} required autoFocus/>
                </div>
                <div className="p-field">
                    <label htmlFor="personnelNumber">Персональный номер</label>
                    <InputText id="personnelNumber" value={user.personnelNumber}
                               onChange={(e) => onInputChange(e, 'personnelNumber')} required autoFocus/>
                    {submitted && !user.personnelNumber &&
                    <small className="p-error">Поле обязательное</small>}
                </div>
                {companies !== null && (
                    <div className="p-field">
                        <label htmlFor="type">Организация</label>
                        <Dropdown value={valueCompany} options={companies} onChange={onValueCompositionChange}
                                  optionLabel="name" placeholder="Select a value of companies"/>
                    </div>
                )}


            </Dialog>

            <Dialog visible={userDialog} style={{width: '450px'}} header="Создание Администратора" modal className="p-fluid"
                    footer={userDialogFooter} onHide={hideDialog}>
                <div className="p-field">
                    <label htmlFor="login">Логин</label>
                    <InputText id="login" value={user.login} onChange={(e) => onInputChange(e, 'login')} required
                               autoFocus/>
                    {submitted && !user.login && <small className="p-error">Поле обязательное</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="password">Пароль</label>
                    <Password value={user.password} onChange={(e) => onInputChange(e, 'password')}/>
                    {submitted && !user.password && <small className="p-error">Поле обязательное</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="name">Имя</label>
                    <InputText id="name" value={user.name} onChange={(e) => onInputChange(e, 'name')} required
                               autoFocus/>
                    {submitted && !user.name && <small className="p-error">Поле обязательное</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="surname">Фамилия</label>
                    <InputText id="surname" value={user.surname} onChange={(e) => onInputChange(e, 'surname')} required
                               autoFocus/>
                    {submitted && !user.surname && <small className="p-error">Поле обязательное</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="phoneNumber">Телефонный номер</label>
                    <InputMask id="phone" mask="(999) 999-9999" placeholder="(999) 999-9999" value={user.phoneNumber}
                               onChange={(e) => onInputChange(e, 'phoneNumber')} required autoFocus/>
                    {submitted && !user.phoneNumber && <small className="p-error">Поле обязательное</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="personnelNumber">Персональный номер</label>
                    <InputText id="personnelNumber" value={user.personnelNumber}
                               onChange={(e) => onInputChange(e, 'personnelNumber')} required autoFocus/>
                    {submitted && !user.personnelNumber &&
                    <small className="p-error">Поле обязательное</small>}
                </div>
                {companies !== null && (
                    <div className="p-field">
                        <label htmlFor="type">Организация</label>
                        <Dropdown value={valueCompany} options={companies} onChange={onValueCompositionChange}
                                  optionLabel="name" placeholder="Select a value of companies"/>
                    </div>
                )}
            </Dialog>

            <Dialog visible={deleteUserDialog} style={{width: '450px'}} header="Подтвержение" modal
                    footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{fontSize: '2rem'}}/>
                    {user && <span>Удалить выбранного администратора<b>  {user.name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteUsersDialog} style={{width: '450px'}} header="Подтвержение" modal
                    footer={deleteUsersDialogFooter} onHide={hideDeleteUsersDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{fontSize: '2rem'}}/>
                    {user && <span>Удалить выбранных администраторов ?</span>}
                </div>
            </Dialog>
        </div>
    )

}