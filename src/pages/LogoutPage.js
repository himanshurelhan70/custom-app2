import React from 'react'
import axios from 'axios'
import {useNavigate} from "react-router-dom"

function LogoutPage({isLoggedIn, setIsLoggedIn}) {

    const navigate = useNavigate();

    const config = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
        url: "http://localhost:9000/api/v1/logout"
    };


    axios(config)
        .then((response) => {
            console.log("logout successful");
            const data = response.data;
            console.log(data);
            alert("Logout Successful");
            setIsLoggedIn(false);
            navigate("/login");

        })
        .catch((error) => {
            console.log("error while logging out");
            console.log(error);
        });

  return (
    <h1>Logout Page</h1>
  )
}

export default LogoutPage