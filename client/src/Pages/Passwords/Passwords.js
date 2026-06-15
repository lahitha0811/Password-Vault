import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router";
import Password from "../../Components/Password/Password";
import "./Passwords.css";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveNewPassword, deleteAPassword, checkAuthenticated } from "../../axios/instance";
import { useSelector, useDispatch } from "react-redux";
import { setPasswords } from "../../redux/actions";
 import CryptoJS from 'crypto-js';

function Passwords() {
  const [platform, setPlatform] = useState("");
  const [platEmail, setPlatEmail] = useState("");
  const [platPass, setPlatPass] = useState("");
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const history = useHistory();
  const dispatch = useDispatch();

  // 1. Get masterKey from Redux state
  const { isAuthenticated, name, passwords, masterKey } = useSelector((state) => state);
  console.log("Passwords Page State:", {
  isAuthenticated,
  name,
  passwords,
  masterKey
});

  // ... verifyUser and useEffect logic

  // 2. Updated Add Password Flow
  const addNewPassword = async () => {
    // Basic Validation
    if (!platform || !platEmail || !platPass) {
      return toast.warn("Please fill in all fields");
    }

    // Check if vault is unlocked (Master Key exists)
    if (!masterKey) {
      return toast.error("Vault is locked. Please re-login to derive your key.");
    }

    try {
      // A. CLIENT-SIDE ENCRYPTION
      // We turn the plain text 'platPass' into an encrypted string using the masterKey
      const encrypted = CryptoJS.AES.encrypt(platPass, masterKey).toString();

      // B. API CALL
      // We use 'userPass' to match your backend's req.body expectation
      const res = await saveNewPassword({
        platform: platform,
        platEmail: platEmail,
        userPass: encrypted 
      });

      if (res.status === 200) {
        toast.success("Password added securely!");
        
        // C. UPDATE UI
        // Update the list with the new data from the server
        dispatch(setPasswords(res.data.passwords));
        
        // D. RESET FORM & CLOSE MODAL
        setPlatform("");
        setPlatEmail("");
        setPlatPass("");
        setOpen(false);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to add password.");
    }
  };
  const handleDelete = async (id) => {
    try {
      const res = await deleteAPassword({ id });
      if (res.status === 200) {
        toast.success(res.data.message);
        dispatch(setPasswords(res.data.passwords || []));
      } else {
        toast.error(res.data.error || "Could not delete password");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete password");
    }
  };

  // ✅ Filter passwords
  const filteredPasswords = passwords?.filter((p) =>
    p.platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="passwords">
      <ToastContainer />

      <h1>
        Welcome <span className="name">{name}</span>
      </h1>

      {/* ✅ SEARCH BAR */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by platform..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ✅ ADD NEW PASSWORD BUTTON */}
      <button className="modalButton" onClick={() => setOpen(true)}>
        Add New Password
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <h2>Add a new password</h2>
        <form className="form">
          <div className="form__inputs">
            <label htmlFor="platform">Platform</label>
            <input
              id="platform"
              type="text"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              placeholder="E.g. Facebook"
              required
            />
          </div>
          <div className="form__inputs">
            <label htmlFor="platEmail">Email</label>
            <input
              id="platEmail"
              type="email"
              value={platEmail}
              onChange={(e) => setPlatEmail(e.target.value)}
              placeholder="E.g. user@gmail.com"
              required
            />
          </div>
          <div className="form__inputs">
            <label htmlFor="platPass">Password</label>
            <input
              id="platPass"
              type="password"
              value={platPass}
              onChange={(e) => setPlatPass(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <button type="button" onClick={addNewPassword}>
            Add
          </button>
        </form>
      </Modal>

      <hr />

      {/* ✅ PASSWORD LIST */}
      <div className="passwords__list">
        {filteredPasswords?.length > 0 ? (
          filteredPasswords.map((data) => (
            <Password
              key={data._id}
              id={data._id}
              name={data.platform}
              encryptedPassword={data.encryptedPassword || data.password}
              email={data.platEmail}
              iv={data.iv}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="nopass">
            <p>{searchTerm ? "No passwords found for this platform." : "You have not added any passwords yet."}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Passwords;
