import React, { useState, useEffect } from "react";
import "./Signup.css";
import { Link, useHistory } from "react-router-dom";
import img from "../../assets/images/signup.jpg";
import { ToastContainer, toast } from "react-toastify";
import { signupUser } from "../../axios/instance";
import { useSelector, useDispatch } from "react-redux";
import ReactLoading from "react-loading";
import CryptoJS from 'crypto-js';
import { setMasterKey } from "../../redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Signup() {
  const isAuthenticated = useSelector(state => state.isAuthenticated);
  const history = useHistory();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showCPass, setShowCPass] = useState(false);
  const [userData, setUserData] = useState({ name: "", email: "", password: "", cpassword: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    if (!hasAgreed) return toast.error("Please acknowledge the security policy.");
    if (userData.password !== userData.cpassword) return toast.error("Passwords do not match.");

    setIsLoading(true);
    try {
      const salt = userData.email;
      const derivedKey = CryptoJS.PBKDF2(userData.password, salt, {
        keySize: 256 / 32,
        iterations: 1000
      }).toString();

      const res = await signupUser(userData);
      if (res.status === 201) {
        dispatch(setMasterKey(derivedKey));
        toast.success("Account created!");
        history.push("/signin");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

return (
  <div className="signup">
    <div className="signup__wrapper">
      
      {/* LEFT SIDE: The Form */}
      <div className="signup__left">
        <div className="inputs">
          <label htmlFor="name">Full Name</label>
          <input id="name" type="text" name="name" onChange={handleChange} value={userData.name} required />
        </div>
        
        <div className="inputs">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" onChange={handleChange} value={userData.email} required />
        </div>

        <div className="inputs">
          <label htmlFor="password">Password (Master Password)</label>
          <div className="password-input-wrapper">
            <input type={showPass ? "text" : "password"} name="password" onChange={handleChange} value={userData.password} required />
            <FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} onClick={() => setShowPass(!showPass)} className="password-toggle-icon" />
          </div>
        </div>

        <div className="inputs">
          <label htmlFor="cpassword">Confirm Password</label>
          <div className="password-input-wrapper">
            <input type={showCPass ? "text" : "password"} name="cpassword" onChange={handleChange} value={userData.cpassword} required />
            <FontAwesomeIcon icon={showCPass ? faEyeSlash : faEye} onClick={() => setShowCPass(!showCPass)} className="password-toggle-icon" />
          </div>
        </div>

        {/* SECURITY WARNING BOX */}
        <div className="security-policy-container">
          <h5>⚠️ Important Security Policy</h5>
          <p>We use E2EE. We do not store your password. If lost, your data is <strong>lost forever</strong>. Please store your password offline safely.</p>
          <div className="checkbox-wrapper">
            <input type="checkbox" id="agree" checked={hasAgreed} onChange={(e) => setHasAgreed(e.target.checked)} />
            <label htmlFor="agree">I understand my data is unrecoverable if I forget my password.</label>
          </div>
        </div>

        <p className="already-account">Already have an account? <Link to="/signin">Login</Link></p>
        
        {/* SIGNUP BUTTON - Centered below the form */}
        <div className="signup-button-wrapper">
             {isLoading ? <ReactLoading type="balls" color="#ff1f5a" height={40} width={40} /> : (
                <button type="button" className="signup-btn" onClick={handleRegister} disabled={!hasAgreed}>
                    SignUp
                </button>
             )}
        </div>
      </div>

      {/* RIGHT SIDE: The Background Image */}
      <div className="signup__right">
        <img src={img} alt="Secure Your Life" />
        <div className="signup__content">
          <h1>Secure Your Life</h1>
          <p>The best way to manage your passwords.</p>
        </div>
      </div>

    </div>
  </div>
);
}

export default Signup;