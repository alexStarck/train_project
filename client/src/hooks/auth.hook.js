import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData'

export const useAuth = () => {
  const [token, setToken] = useState(null)
  const [company, setCompany] = useState(null)
  const [ready, setReady] = useState(false)
  const [userId, setUserId] = useState(null)

  const login = useCallback((jwtToken, id ,company) => {
    setToken(jwtToken)
    setUserId(id)
    setCompany(company)
    localStorage.setItem(storageName, JSON.stringify({
      userId: id, token: jwtToken , company: company
    }))
  }, [])


  const logout = useCallback(() => {
    setToken(null)
    setUserId(null)
    setCompany(null)
    localStorage.removeItem(storageName)
  }, [])

  useEffect(() => {

    const data = JSON.parse(localStorage.getItem(storageName))
    if (data && data.token) {
      login(data.token, data.userId , data.company)
    }
    setReady(true)
  }, [login])


  return { login, logout, token, userId, ready ,company }
}
