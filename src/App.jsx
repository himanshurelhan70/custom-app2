import "./App.css";
import { NavLink, Route, Routes } from 'react-router-dom';
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import LeadsPage from "./pages/LeadsPage";
import UsersPage from "./pages/UsersPage";
import CreateRecord from "./pages/CreateRecord";
import Home from "./pages/Home";

import { useState } from "react";

import Cookies from "js-cookie"

function App() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  // accessing jwt from frontend
  const jwtToken = Cookies.get("token");
  console.log(jwtToken);

  const [isLoggedIn, setIsLoggedIn] = useState(jwtToken ? true : false);

  const [currentUser, setCurrentUser] = useState("");

  return (
    <>
      <header className="w-full bg-slate-500">
        <div className="container w-full max-w-[1200px] mx-auto flex justify-between items-center bg-transparent">

          <div>
            <NavLink to="/" className="text-xl text-white block p-4">Logo</NavLink>
          </div>

          <nav>
            <ul className="flex justify-between items-center">

            {isLoggedIn && <p className="text-lg text-white block p-4">Hi {currentUser}</p>}

             {!isLoggedIn && <li>
                <NavLink to="/signup" className="text-lg text-white block p-4">SignUp</NavLink>
              </li>}

             {
              !isLoggedIn &&  <li>
                <NavLink to="/login" className="text-lg text-white block p-4">Login</NavLink>
              </li>
             }

             {
              isLoggedIn &&  <li>
                <NavLink to="/logout" className="text-lg text-white block p-4">Logout</NavLink>
              </li>
             }

            </ul>
          </nav>

        </div>
      </header>

      <Routes>
        <Route index element={<Home />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/login' element={<LoginPage loginData={loginData} setLoginData={setLoginData} 
        setIsLoggedIn={setIsLoggedIn} setCurrentUser={setCurrentUser}/>} />

        <Route path='/leads' element={<LeadsPage />} />
        <Route path='/users' element={<UsersPage />} />
        <Route path='/createRecord' element={<CreateRecord />} />

        <Route path='/logout' element={<LogoutPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}  />} />
      </Routes>
    </>
  )
}

export default App;
