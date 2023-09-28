import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Lead from '../components/Lead'
import Loader from '../components/Loader';

function LeadsPage() {
    const [records, setRecords] = useState([]);

    const [isLoading, setIsLoading] = useState(false);


    const fetchData = () => {
        // loader
        setIsLoading(true);

        axios.get("https://custom-app2.onrender.com/api/v1/getData", {
            withCredentials: true
        })
            .then((response) => {
                const res = response.data;
                console.log("fetched records", res);
                // loader
                setIsLoading(false);
                setRecords(res);
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
            <h1 className='text-2xl font-bold mb-4'>All CRM Leads</h1>
            {isLoading ? (<Loader />) : (<table className='border-collapse'>
                <thead>
                    <tr>
                        <th className='border-2 px-2 py-1'>Full Name</th>
                        <th className='border-2 px-2 py-1'>Mobile</th>
                        <th className='border-2 px-2 py-1'>City</th>
                        <th className='border-2 px-2 py-1 '>Loan Type</th>
                        <th className='border-2 px-2 py-1'>Loan Amount(Lacs)</th>
                        <th className='border-2 px-2 py-1'>Model</th>
                        <th className='border-2 px-2 py-1'>Lead Status</th>
                        <th className='border-2 px-2 py-1'>CD Primary</th>
                        <th className='border-2 px-2 py-1'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record) => <Lead record={record} key={record.id} />)}
                </tbody>
            </table>)}

        </div>
    )


}

export default LeadsPage