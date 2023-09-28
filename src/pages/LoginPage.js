import React from 'react'
import Login from '../components/Login'

function LoginPage({ loginData, setLoginData, setIsLoggedIn, setCurrentUser }) {
    return (
        <Login loginData={loginData} setLoginData={setLoginData} 
        setCurrentUser={setCurrentUser} setIsLoggedIn={setIsLoggedIn} />
    )
}

export default LoginPage