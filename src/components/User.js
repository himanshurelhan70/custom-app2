import React from 'react'
import axios from 'axios'

function User({ user }) {

    const updateUserRole = (userId) => {
        console.log(userId);
        const selectedRole = document.querySelector("#selectedRole").value;
        console.log(selectedRole);

        const config = {
            method: "PUT",
            url: `http://localhost:9000/api/v1/updateUserRole/${userId}`,
            withCredentials: true,
            data: {
                role: selectedRole
            }
        }
        axios(config)
            .then((response) => {
                const data = response.data;
                console.log("user role updated", data);
                // fetchData();
            })
            .catch((error) => {
                console.log("error in updating user role");
                console.log(error.message);
            })
    }


    return (
        <tr>
            <td className="border-2 px-2 py-1">{user.name}</td>
            <td className="border-2 px-2 py-1">{user.email}</td>
            <td className="border-2 px-2 py-1">{user.role}</td>
            <td className="border-2 px-2 py-1 flex gap-2">
                <select name="selectedRole" id="selectedRole">
                    <option value="" disabled defaultValue={true}>--Select--</option>
                    <option value="Manager" disabled={user.role === "Manager"}>Manager</option>
                    <option value="Visitor" disabled={user.role === "Visitor"}>Visitor</option>
                    <option value="Admin" disabled={user.role === "Admin"}>Admin</option>
                </select>

                <button className='bg-blue-800 p-2 text-white' onClick={() => updateUserRole(user._id)}>
                    Update
                </button>
            </td>
        </tr>
    )
}

export default User