import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {Loader} from '../components/Loader'


export const UserHomePage = () => {
    const {token} = useContext(AuthContext)
    const {userId} = useContext(AuthContext)
    const {request, loading} = useHttp()
    const [admin, setAdmin] = useState({})

    const getAdmin = useCallback(async () => {
        try {
            const fetched = await request('/api/admin/info', 'POST', {userId}, {
                Authorization: `Bearer ${token}`
            })
            setAdmin(fetched)

        } catch (e) {
        }
    }, [request, userId, token])

    useEffect(() => {
        getAdmin()
    }, [userId])

    if (loading) {
        return <Loader/>
    }

    return (
        <>
            {loading && <Loader/>}
            {!loading && admin && (
                <div style={{
                    "display": "flex",
                    "alignItems": "center",
                    "justifyContent": "center"
                }}>
                    <h1>{admin.name}</h1>
                </div>
            )}
        </>
    )
}
