import React, { useState, useEffect } from 'react'
import axios from 'axios'
import User from "../components/User"
import Loader from '../components/Loader';

function UsersPage() {
    const [users, setUsers] = useState([]);

    const [isLoading, setIsLoading] = useState(false);


    const fetchData = () => {
        setIsLoading(true);
        axios.get("http://localhost:9000/api/v1/getAllUsers", {
            withCredentials: true
        })
            .then((response) => {
                const res = response.data.data;
                console.log(res);
                setIsLoading(false);
                setUsers(res);
            })
            .catch((error) => {
                console.log("error", error);
                alert("you are not permitted to see this page");
            });
            
    }


    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='flex flex-col items-center justify-center my-10'>
            <h1 className='text-2xl font-bold mb-4'>All Users</h1>

            {isLoading ? (<Loader />) : ( <table className='border-collapse'>
                <thead>
                    <tr>
                        <th className='border-2 px-2 py-1'>Name</th>
                        <th className='border-2 px-2 py-1'>Email</th>
                        <th className='border-2 px-2 py-1'>Role</th>
                        <th className='border-2 px-2 py-1'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => <User user={user} key={user._id} />)}
                </tbody>
            </table>)}
           
        </div>
    )
}

export default UsersPage