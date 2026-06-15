import React, { useState, useEffect } from "react";
import "./Login.css";
import { Link, useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { loginUser } from "../../axios/instance";
import img from "../../assets/images/login.jpg";
import { useSelector, useDispatch } from "react-redux";
import { setAuth, setMasterKey, setName, setEmail, setPasswords } from "../../redux/actions";
import CryptoJS from 'crypto-js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Login() {
  const isAuthenticated = useSelector(state => state.isAuthenticated);
  const history = useHistory();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      const res = await loginUser(userData);
      if (res.status === 200) {
        const salt = userData.email;
        const derivedKey = CryptoJS.PBKDF2(userData.password, salt, {
          keySize: 256 / 32,
          iterations: 1000
        }).toString();

        sessionStorage.setItem("masterKey", derivedKey);

        dispatch(setMasterKey(derivedKey));
        dispatch(setAuth(true));
        dispatch(setName(res.data.name));
        dispatch(setEmail(res.data.email));
        dispatch(setPasswords(res.data.passwords));
        history.push("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed");
    }
  };

  useEffect(() => {
    if (isAuthenticated) history.replace("/");
  }, [isAuthenticated, history]);

  return (
    <div className="login">
      <ToastContainer />
      <div className="login__wrapper">
        <div className="login_left">
          <div className="inputs">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" value={userData.email} onChange={handleChange} required />
          </div>

          <div className="inputs">
            <label htmlFor="password">Master Password</label>
            <div className="password-input-wrapper">
              <input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                name="password" 
                value={userData.password} 
                onChange={handleChange} 
                required 
              />
              <FontAwesomeIcon 
                icon={showPassword ? faEyeSlash : faEye} 
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-icon"
              />
            </div>
          </div>

          <p>Don't have an account? <Link to="/signup">Signup</Link></p>
          <button type="button" className="login-btn" onClick={handleLogin}>Unlock Vault</button>
        </div>

        <div className="login_right">
          <img src={img} alt="Login Illustration" />
          <div className="login__content">
            <h1>Welcome Back</h1>
            <h4>Secure Your Life</h4>
            <p>The best way to manage your passwords.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;