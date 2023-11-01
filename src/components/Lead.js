import React, {useEffect, useState} from "react";
import axios from "axios";

function Lead({ record }) {

  const [selectedValue, setSelectedValue] = useState(record.CD_Primary ? record.CD_Primary : "-None-");

  // update lead 
  const updateRecord = async (leadId) => {
    console.log("Update is clicked", leadId, selectedValue);
    const config = {
      method: "PUT",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
      url: `http://127.0.0.1:9000/api/v1/updateRecord/update/${leadId}`,
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

  // download attachment
  const downloadAttachments = async (leadId) => {
    console.log("Download is clicked", leadId);
    const config = {
      method: "GET",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
      url: `http://127.0.0.1:9000/api/v1/getAttachments/${leadId}`,
    };

    axios(config)
      .then((response) => {
        const data = response.data;
        console.log(data);
        alert("Files are downloaded");
      })
      .catch((error) => {
        console.log("error", error);
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
          <option value="Rejected">Rejected</option>
          <option value="Disbursed">Disbursed</option>
          <option value="Docs Processing">Docs Processing</option>
          <option value="Pending Feedback">Pending Feedback</option>
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

      <td className="border-2 px-2 py-1">
        <button
            id="reject"
            className="bg-green-800 text-white p-1"
            onClick={() => downloadAttachments(record.id)}
          >
            Download
          </button> 
      </td>
    </tr>
  );
}

export default Lead;
