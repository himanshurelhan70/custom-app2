import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function Login({ loginData, setLoginData, setIsLoggedIn, setCurrentUser }) {

    const navigate = useNavigate();

    const inputHandler = (event) => {
        const { name, value } = event.target;
        // console.log(name, value);
        setLoginData({
            ...loginData,
            [name]: value
        })
    }

    const submitHandler = (event) => {
        event.preventDefault();
        console.log(loginData);

        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
            data: loginData,
            url: "http://localhost:9000/api/v1/login"
        };


        axios(config)
            .then((response) => {
                console.log("login successful");
                const data = response.data;
                console.log(data);
                alert("Login Successful");



                if (data?.user?.role === 'Manager') {
                    navigate("/leads");
                }
                else if (data?.user?.role === 'Admin') {
                    navigate("/users");
                }
                else if (data?.user?.role === 'Visitor') {
                    navigate("/createRecord");
                }

                setIsLoggedIn(true);
                setCurrentUser(data?.user?.name);

            })
            .catch((error) => {
                console.log("error while login");
                console.log(error);
            });
    }

    return (
        <div className='w-[400px] flex flex-col justify-center mx-auto'>
            <h1 className='text-center text-2xl my-4'>Login form</h1>
            <form onSubmit={submitHandler}>
                <label htmlFor="" >Email</label>
                <input
                    type="email"
                    name="email"
                    className=' w-full block border-2 border-slate-400 rounded-md mb-2'
                    onChange={inputHandler}
                    value={loginData.email} />

                <label htmlFor="" >Password</label>
                <input
                    type="password"
                    name="password"
                    className=' w-full block border-2 border-slate-400 rounded-md mb-2'
                    onChange={inputHandler}
                    value={loginData.password} />

                <input type="submit" className='w-full bg-slate-500 text-white py-1 rounded-md' />
            </form>
        </div>
    )
}

export default Login