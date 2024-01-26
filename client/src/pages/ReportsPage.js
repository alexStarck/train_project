import React, {useCallback, useContext, useEffect, useRef, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Toast} from 'primereact/toast';
import {InputText} from 'primereact/inputtext';


export const ReportsPage = () => {
    const emptyReport = {
        objectName: '',
        data: [],
        dateIn: '',
        dateOut: '',
        gps: ''
    }
    const {request, loading} = useHttp()
    const {token} = useContext(AuthContext)
    const [reportsList, setReportsList] = useState(null);

    const [selectedUsers, setSelectedUsers] = useState([]);

    const [globalFilter, setGlobalFilter] = useState(null);
    const [reportDialog, setReportDialog] = useState(false)
    const [report, setReport] = useState(emptyReport)
    const toast = useRef(null);
    const dt = useRef(null)





    const fetchReports = useCallback(async () => {
        try {
            const fetched = await request('/api/report/list', 'POST',null , {
                Authorization: `Bearer ${token}`
            })

            setReportsList(fetched)
        } catch (e) {}
    }, [token, request, reportsList])




    useEffect(() => {
       //saveReport()
       fetchReports()
    }, [token]);


    const GetImage=async (url,test)=>{

        const response = await fetch('http://195.161.68.151:5000/' + url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        let blob= await response.blob()
        if(test){
            window.open(window.URL.createObjectURL(blob))
        }else{
            let win = window.open(window.URL.createObjectURL(blob));
            if (win == null || typeof(win)=='undefined'){
                toast.current.show({ severity: 'error', summary: 'Уведомление', detail: 'у вас выключена блокировка всплывающих окон ', life: 3000 });
            }
        }

            // .then((response) => response.blob())
            // .then(blob=>{window.open(window.URL.createObjectURL(blob))})
    }







    const Open = (e) => {


            if(e.value.hasOwnProperty('dateOut')){
                if(window.screen.availWidth>=1024){
                    GetImage(e.value.pathToPdf,true)
                }else {
                    GetImage(e.value.pathToPdf,false)
                }

                // setReport(e.value);
                // setReportDialog(true);
                // setSelectedUsers(e.value)
            }else{
                toast.current.show({ severity: 'error', summary: 'Уведомление', detail: 'Отчет не завершен', life: 3000 });
            }




    }
    const NumberBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Номер</span>
                {rowData.number}
            </>
        );
    }

    const DateInBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Дата начала</span>
                {rowData.dateIn}
            </>
        );
    }

    const TimeInBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Время начала</span>
                {rowData.timeIn}
            </>
        );
    }

    const DateOutBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Дата конца</span>
                {rowData.dateOut}
            </>
        );
    }

    const TimeOutBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Время конца</span>
                {rowData.timeOut}
            </>
        );
    }

    const NameObjectBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Номер Поезда</span>
                {rowData.objectName}
            </>
        );
    }

    const NameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Имя</span>
                {rowData.owner.name}
            </>
        );
    }

    const SurnameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Фамилия</span>
                {rowData.owner.surname}
            </>
        );
    }



    const statusBodyTemplate = (rowData) => {
        if(rowData.hasOwnProperty('dateOut')){
            return ( <div>
                    <span className="p-column-title">Статус</span>
                    <span className={`report-badge status-completed`}>Завершен</span>
                    </div>
                    )


        }else{
            return ( <div>
                <span className="p-column-title">Статус</span>
                <span className='report-badge status-process'>В процессе</span>
            </div>)



        }

    }


    const header = (
        <>
            <div className="PageName p-text-center " >
                <h3>
                    СТРАНИЦА ОТЧЕТОВ
                </h3>
            </div>
            <div className="table-header" style={{justifyContent:'flex-end',display: 'flex',width:'100%'}}>


                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="Поиск" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
                </span>
            </div>
        </>
    );






    return(
        <>

              <>


                  <div className="p-grid crud-demo">
                      <div className='p-col-12'>
                        <Toast ref={toast} />

                        <div className="card">


                            <DataTable ref={dt} value={reportsList} selectionMode="single" selection={selectedUsers} onSelectionChange={(e) =>{Open(e)} }
                                       dataKey="_id" paginator rows={10} rowsPerPageOptions={[10, 20, 50]} className="datatable-responsive"
                                       paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                       currentPageReportTemplate="Показано с  {first} по  {last} из {totalRecords} отчетов"
                                       globalFilter={globalFilter}
                                       resizableColumns columnResizeMode="expand"
                                       loading={loading}
                                       style={{width:'100%',height:'100%'}}
                                       header={header}>


                                <Column field="number" header="номер" body={NumberBodyTemplate}    sortable/>
                                <Column field="dateIn" header="Дата начала" body={DateInBodyTemplate}    sortable/>
                                <Column field="timeIn" header="Время начала" body={TimeInBodyTemplate}  sortable/>
                                <Column field="dateOut" header="Дата конца" body={DateOutBodyTemplate}  sortable/>
                                <Column field="timeOut" header="Время конца" body={TimeOutBodyTemplate}  sortable/>
                                <Column field="objectName" header="Номер поезда" style={{width:'14%'}} body={NameObjectBodyTemplate}  sortable/>
                                <Column field="owner.name" header="Имя" style={{width:'10%'}} body={NameBodyTemplate}  sortable/>
                                <Column field="owner.surname" header="Фамилия" style={{width:'11%'}} body={SurnameBodyTemplate}  sortable/>
                                <Column field="status" body={statusBodyTemplate} header="Статус" style={{width:'10%'}} sortable />

                            </DataTable>
                        </div>




                      </div>
                </div>
            </>



        </>
    )

}