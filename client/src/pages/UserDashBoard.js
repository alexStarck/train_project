import React, {useCallback, useContext, useEffect, useState,useRef} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputMask } from 'primereact/inputmask';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import {Password} from 'primereact/password';
import {Loader} from "../components/Loader";



export const UserDashBoard = () => {
    let emptyUser = {
        login:'',
        password:'',
        name:'',
        surname:'',
        phoneNumber:'',
        personnelNumber:'',

    };
    const { request,loading} = useHttp()
    const {token} = useContext(AuthContext)
    const [usersList, setUsersList] = useState(null);
    const [userDialog, setUserDialog] = useState(false);
    const [userEditDialog,setUserEditDialog]=useState(false)
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
            const fetched = await request('/api/user/list', 'POST',{} , {
                Authorization: `Bearer ${token}`
            })
            setUsersList(fetched)
        } catch (e) {}
    }, [token, request, usersList])









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
            const fetched = await request('/api/user/create', 'POST',{...user} , {
                Authorization: `Bearer ${token}`
            })
            toast.current.show({ severity: 'success', summary: 'Successful', detail: fetched.message, life: 3000 });
            setUserDialog(false);
            setUser(emptyUser);
        } catch (e) {}
    }, [token, request, user])



    const saveUser = useCallback(async () => {
        try {
            setSubmitted(true);
            const fetched = await request('/api/user/edit', 'POST',{...user} , {
                Authorization: `Bearer ${token}`
            })
            toast.current.show({ severity: 'success', summary: 'Successful', detail: fetched.message, life: 3000 });
            setUserEditDialog(false);
            setUser(emptyUser);
        } catch (e) {}
    }, [token, request, user])



    const editUser = (product) => {
        window.scrollTo(0, 0);
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
            const fetched = await request('/api/user/delete', 'POST',{...user} , {
                Authorization: `Bearer ${token}`
            })
            setDeleteUserDialog(false);
            setUser(emptyUser);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: fetched.message, life: 3000 });
        } catch (e) {}
    }, [token, request, user])




    const confirmDeleteSelected = () => {
        setDeleteUsersDialog(true);
    }

    const deleteSelectedProducts = useCallback(async () => {
        try {
            setSubmitted(true);
            const fetched = await request('/api/user/deleteM', 'POST',selectedUsers , {
                Authorization: `Bearer ${token}`
            })

            setDeleteUsersDialog(false);
            setSelectedUsers(null);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: fetched.message, life: 3000 });

        } catch (e) {}
    }, [token, request, selectedUsers])



    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _user = {...user};
        _user[`${name}`] = val;
        setUser(_user);
    }

    const surnameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Фамилия</span>
                {rowData.surname}
            </>
        );
    }

    const loginBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Логин</span>
                {rowData.login}
            </>
        );
    }

    const phoneBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Телефон</span>
                {rowData.phoneNumber}
            </>
        );
    }

    const personnelNumberBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Персональный номер</span>
                {rowData.personnelNumber}
            </>
        );
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Имя</span>
                {rowData.name}
            </>
        );
    }













    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editUser(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteUser(rowData)} />
            </React.Fragment>
        );
    }

    const header = (
        <>
            <div className="PageName p-text-center " >
                <h3>
                    СТРАНИЦА СОТРУДНИКОВ
                </h3>
            </div>
            <div>
                <div className='p-col-6'>
                    <React.Fragment >
                        <Button label="Создать" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew}  />
                        <Button label="Удалить" icon="pi pi-trash" className="p-button-danger p-mr-2" onClick={confirmDeleteSelected}  disabled={!selectedUsers || !selectedUsers.length} />
                    </React.Fragment>
                </div>


                    <div className='p-field p-col-6'>

                    <span className="p-input-icon-left" >
                        <i className="pi pi-search" />
                        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Поиск..." />
                    </span>
                    </div>

            </div>



        </>

    );
    const userEditDialogFooter = (
        <React.Fragment>
            <Button label="Отмена" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Сохранить" icon="pi pi-check" className="p-button-text" onClick={saveUser} />
        </React.Fragment>
    );
    const userDialogFooter = (
        <React.Fragment>
            <Button label="Отмена" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Создать" icon="pi pi-check" className="p-button-text" onClick={createUser} />
        </React.Fragment>
    );
    const deleteUserDialogFooter = (
        <React.Fragment>
            <Button label="Нет" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUserDialog} />
            <Button label="Да" icon="pi pi-check" className="p-button-text" onClick={deleteUser} />
        </React.Fragment>
    );
    const deleteUsersDialogFooter = (
        <React.Fragment>
            <Button label="Нет" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUsersDialog} />
            <Button label="Да" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );



    useEffect(() => {
        fetchUsers()
    }, [token,createUser,deleteSelectedProducts,deleteUser,saveUser]);



    return(<>


                <div>

                    <div className="p-grid crud-demo">
                        <div className='p-col-12'>


                            <Toast ref={toast} />

                            <div className="card">


                                <DataTable ref={dt} value={usersList} selection={selectedUsers} onSelectionChange={(e) =>{setSelectedUsers(e.value)} }
                                           dataKey="_id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                           currentPageReportTemplate="Показано с {first} по {last} из {totalRecords} сотрудников"
                                           globalFilter={globalFilter} loading={loading}
                                           header={header}>

                                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}/>
                                    <Column field="surname" header="Фамилия" body={surnameBodyTemplate} sortable/>
                                    <Column field="name" header="Имя" body={nameBodyTemplate} sortable/>
                                    <Column field="login" header="Логин" body={loginBodyTemplate} sortable/>
                                    <Column field="phoneNumber" header="Номер телефона"style={{width: '300px'}} body={phoneBodyTemplate} sortable/>
                                    <Column field="personnelNumber" header="Персональный  номер"style={{width: '300px'}} body={personnelNumberBodyTemplate} sortable/>
                                    <Column body={actionBodyTemplate}/>
                                </DataTable>
                            </div>

                            <Dialog visible={userEditDialog} style={{ width: '450px' }} header="Редактирование пользователя" modal className="p-fluid" footer={userEditDialogFooter} onHide={hideDialog} position='top'>
                                <div className="p-field">
                                    <label htmlFor="login">Логин</label>
                                    <InputText id="login" value={user.login} onChange={(e) => onInputChange(e, 'login')} required autoFocus  />
                                    {submitted && !user.login && <small className="p-error">login is required.</small>}
                                </div>
                                <div className="p-field">
                                    <label htmlFor="Password">Пароль</label>
                                    <Password  value={user.password} onChange={(e) => onInputChange(e, 'password')}    />
                                </div>

                                <div className="p-field">
                                    <label htmlFor="Name">Имя</label>
                                    <InputText id="name" value={user.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus  />
                                    {submitted && !user.name && <small className="p-error">Name is required.</small>}
                                </div>
                                <div className="p-field">
                                    <label htmlFor="Surname">Фамилия</label>
                                    <InputText id="surname" value={user.surname} onChange={(e) => onInputChange(e, 'surname')} required autoFocus  />
                                    {submitted && !user.surname && <small className="p-error">Surname is required.</small>}
                                </div>
                                <div className="p-field">
                                    <label htmlFor="phoneNumber">Телефонный номер</label>
                                    <InputMask id="phone" mask="(999) 999-9999"  placeholder="(999) 999-9999" value={user.phoneNumber} onChange={(e) => onInputChange(e, 'phoneNumber')} required autoFocus  />
                                    {submitted && !user.phoneNumber && <small className="p-error">PhoneNumber is required.</small>}
                                </div>
                                <div className="p-field">
                                    <label htmlFor="personnelNumber">Персональный номер</label>
                                    <InputText id="personnelNumber" value={user.personnelNumber} onChange={(e) => onInputChange(e, 'personnelNumber')} required autoFocus  />
                                    {submitted && !user.personnelNumber && <small className="p-error">PersonnelNumber is required.</small>}
                                </div>






                            </Dialog>

                            <Dialog visible={userDialog} style={{ width: '450px' }} header="Создание пользователя" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog} position='top'>
                                <div className="p-field">
                                    <label htmlFor="login">Логин</label>
                                    <InputText id="login" value={user.login} onChange={(e) => onInputChange(e, 'login')} required autoFocus  />
                                    {submitted && !user.login && <small className="p-error">login is required.</small>}
                                </div>
                                <div className="p-field">
                                    <label htmlFor="Password">Пароль</label>
                                    <Password  value={user.password} onChange={(e) => onInputChange(e, 'password')}    />
                                    {submitted && !user.password && <small className="p-error">Password is required.</small>}
                                </div>
                                <div className="p-field">
                                    <label htmlFor="Name">Имя</label>
                                    <InputText id="name" value={user.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus  />
                                    {submitted && !user.name && <small className="p-error">Name is required.</small>}
                                </div>
                                <div className="p-field">
                                    <label htmlFor="Surname">Фамилия</label>
                                    <InputText id="surname" value={user.surname} onChange={(e) => onInputChange(e, 'surname')} required autoFocus  />
                                    {submitted && !user.surname && <small className="p-error">Surname is required.</small>}
                                </div>
                                <div className="p-field">
                                    <label htmlFor="phoneNumber">Телефонный номер</label>
                                    <InputMask id="phone" mask="(999) 999-9999"  placeholder="(999) 999-9999" value={user.phoneNumber} onChange={(e) => onInputChange(e, 'phoneNumber')} required autoFocus  />
                                    {submitted && !user.phoneNumber && <small className="p-error">PhoneNumber is required.</small>}
                                </div>
                                <div className="p-field">
                                    <label htmlFor="personnelNumber">Персональный номер</label>
                                    <InputText id="personnelNumber" value={user.personnelNumber} onChange={(e) => onInputChange(e, 'personnelNumber')} required autoFocus  />
                                    {submitted && !user.personnelNumber && <small className="p-error">PersonnelNumber is required.</small>}
                                </div>






                            </Dialog>

                            <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Подтверждение" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog} position='top'>
                                <div className="confirmation-content">
                                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                                    {user && <span>Вы точно хотите удалить   <b>{user.login}</b>?</span>}
                                </div>
                            </Dialog>

                            <Dialog visible={deleteUsersDialog} style={{ width: '450px' }} header="Подтверждение" modal footer={deleteUsersDialogFooter} onHide={hideDeleteUsersDialog} position='top'>
                            <div className="confirmation-content">
                                <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                                {user && <span>Вы точно хотите удалить выбранных пользователей ?</span>}
                            </div>
                        </Dialog>
                        </div>
                    </div>
                </div>



    </>


    )

}