import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Signup() {

    const [signupData, setSignupData] = useState({
        name: "",
        email: "",
        password: "",
        state: ""
    });

    const navigate = useNavigate();

    // ////// input handler
    const inputHandler = (event) => {
        const { name, value } = event.target;
        // console.log(name, value);
        setSignupData({
            ...signupData,
            [name]: value
        });
    }

    // submit handler
    const submitHandler = (event) => {
        event.preventDefault();
        console.log(signupData);

        axios({
            method: 'post',
            url: 'https://custom-app2.onrender.com/api/v1/signup',
            data: signupData
        })
            .then((response) => {
                console.log('response :', response.data);
                alert("Account created successfully");
                navigate("/login");
            })
            .catch((error) => {
                console.log('error', error);
            })
    }

    return (
        <div className='w-[400px] flex flex-col justify-center mx-auto'>
            <h1 className='text-center text-2xl my-4'>SignUp form</h1>
            <form onSubmit={submitHandler}>
                <label htmlFor="" className='mb-2'>Name</label>
                <input
                    type="text"
                    name="name"
                    className='w-full block border-2 border-slate-400 rounded-md mb-2'
                    onChange={inputHandler}
                    value={signupData.name}
                />

                <label htmlFor="" >Email</label>
                <input
                    type="email"
                    name="email"
                    className=' w-full block border-2 border-slate-400 rounded-md mb-2'
                    onChange={inputHandler}
                    value={signupData.email} />

                <label htmlFor="" >Password</label>
                <input
                    type="password"
                    name="password"
                    className='w-full block border-2 border-slate-400 rounded-md mb-2'
                    onChange={inputHandler}
                    value={signupData.password}
                />

                <label htmlFor="" >State</label>
                <input
                    type="text"
                    name="state"
                    className='w-full block border-2 border-slate-400 rounded-md mb-2'
                    onChange={inputHandler}
                    value={signupData.state}
                />

                <input type="submit" className='w-full bg-slate-500 text-white py-1 rounded-md' />
            </form>
        </div>
    )
}

export default Signup