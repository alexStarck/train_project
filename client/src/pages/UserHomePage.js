import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {Loader} from '../components/Loader'



export const UserHomePage = () => {
    const {token} = useContext(AuthContext)
    const {request, loading} = useHttp()
    const [admin, setAdmin] = useState({})

    const getAdmin = useCallback(async () => {
        try {
            const fetched = await request('/api/admin/info', 'POST', {}, {
                Authorization: `Bearer ${token}`
            })

            setAdmin(fetched)

        } catch (e) {}
    }, [request,  token])

    useEffect(() => {
        getAdmin()
    }, [getAdmin])

    if (loading) {
        return <Loader />
    }

    return (
        <>
            {/*{!loading && <div className="p-text-center">Здравствуйте ,{admin.surname} {admin.name}</div> }*/}







        </>
    )
}
