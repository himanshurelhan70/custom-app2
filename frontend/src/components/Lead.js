import React, {useState} from "react";
import axios from "axios";

function Lead({ record }) {

  const [selectedValue, setSelectedValue] = useState(record.CD_Primary ? record.CD_Primary : "-None-");

  // update lead status to approve in CRM
  // const approveRecord = async (leadId) => {
  //   console.log("approve is clicked", leadId);
  //   const config = {
  //     method: "PUT",
  //     withCredentials: true,
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     url: `http://localhost:9000/api/v1/updateRecord/approve/${leadId}`,
  //   };

  //   axios(config)
  //     .then((response) => {
  //       const data = response.data;
  //       console.log(data);
  //       alert("Record is updated");
  //     })
  //     .catch((error) => {
  //       console.log("error", error.message);
  //       alert("error");
  //     });
  // };


  // update lead status to reject in CRM
  // const rejectRecord = async (leadId) => {
  //   console.log("Reject is clicked", leadId);
  //   const config = {
  //     method: "PUT",
  //     withCredentials: true,
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     url: `http://localhost:9000/api/v1/updateRecord/update/${leadId}`,
  //   };

  //   axios(config)
  //     .then((response) => {
  //       const data = response.data;
  //       console.log(data);
  //       alert("Record is updated");
  //     })
  //     .catch((error) => {
  //       console.log("error", error.message);
  //       alert("error");
  //     });
  // };

  // update lead 
  const updateRecord = async (leadId) => {
    console.log("Update is clicked", leadId, selectedValue);
    const config = {
      method: "PUT",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
      url: `http://localhost:9000/api/v1/updateRecord/update/${leadId}`,
      data: {
        selectedValue: selectedValue
      }
    };

    axios(config)
      .then((response) => {
        const data = response.data;
        console.log(data);
        alert("Record is updated");
      })
      .catch((error) => {
        console.log("error", error.message);
        alert("error");
      });
  };

  
  const handleChange = (e) => {
    console.log(e.target.value);
    setSelectedValue(e.target.value);
    }


  return (
    <tr>
      <td className="border-2 px-2 py-1">{record.Name}</td>
      <td className="border-2 px-2 py-1">{record.Mobile}</td>
      <td className="border-2 px-2 py-1">{record.City_New1?.name}</td>
      <td className="border-2 px-2 py-1">{record.Asset_Type}</td>
      <td className="border-2 px-2 py-1">{record.Loan_Amt_Rs_Lacs}</td>
      <td className="border-2 px-2 py-1">{record.Model}</td>
      <td className="border-2 px-2 py-1">{record.Lead_Status}</td>
      <td className="border-2 px-2 py-1">
        <select name="" id="" value={selectedValue} onChange={handleChange}>
          <option value="-None-">-None-</option>
          <option value="Follow Up">Follow Up</option>
          <option value="Logged In">Logged In</option>
          <option value="Approved">Approved</option>
          <option value="Disbursed">Disbursed</option>
          <option value="Rejected">Rejected</option>
        </select>
      </td>
      <td className="border-2 px-2 py-1">
        <button
            id="reject"
            className="bg-blue-800 text-white p-1"
            onClick={() => updateRecord(record.id)}
          >
            Update
          </button> 
      </td>

    </tr>
  );
}

export default Lead;
