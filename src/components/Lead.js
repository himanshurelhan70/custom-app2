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
      url: `https://custom-app2.onrender.com/api/v1/updateRecord/update/${leadId}`,
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

    const fetchData = () => {
      console.log("fetching records");

      axios.get("http://localhsot:9000/api/v1/getAttachments", {
          withCredentials: true
      })
          .then((response) => {
              const res = response.data;
              console.log("fetched records", res);
          })
          .catch((error) => {
              console.log("error", error);
              alert("Something went wrong");
          });
  }


  useEffect(() => {
      fetchData();
  }, []);


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
