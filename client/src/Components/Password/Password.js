import React, { useState } from 'react';
import "./Password.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import CryptoJS from 'crypto-js';
import { useSelector, useDispatch } from "react-redux";
import instance, { deleteAPassword } from "../../axios/instance";
import { delPass, setPasswords} from "../../redux/actions";

function Password({ id, name, encryptedPassword, email }) {
  const [show, setShow] = useState(false);
  const [decPassword, setDecPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editPlatform, setEditPlatform] = useState(name);
  const [editEmail, setEditEmail] = useState(email);
  const [editPass, setEditPass] = useState("");

  const dispatch = useDispatch();
  // Pull the masterKey derived during login from Redux
  const masterKey = useSelector(state => state.masterKey);
  console.log("Password Component MasterKey:", masterKey);
console.log("Full Redux State:", useSelector(state => state));

  const decryptPassword = () => {
    if (!masterKey) return toast.error("Vault is locked. Please re-login.");

    try {
      if (!show) {
        // CLIENT-SIDE DECRYPTION
        console.log("Encrypted:", encryptedPassword);
        const bytes = CryptoJS.AES.decrypt(encryptedPassword, masterKey);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        console.log("Decrypted:", originalText);

        if (!originalText) throw new Error("Invalid Key");

        setDecPassword(originalText);
        setShow(true);
      } else {
        setShow(false);
      }
    } catch (error) {
      toast.error("Decryption failed. Data might be corrupted.");
    }
  };

 // Inside Password.js
const updatePassword = async () => {
    if (!masterKey) return toast.error("Vault is locked.");

    try {
        const newPasswordToEncrypt = editPass || decPassword;
        const newEncryptedPass = CryptoJS.AES.encrypt(newPasswordToEncrypt, masterKey).toString();

        const res = await instance.put("/updatepassword", {
            id,
            platform: editPlatform,
            email: editEmail,
            encryptedPassword: newEncryptedPass,
        });

        if (res.status === 200) {
            toast.success("Updated successfully!");
            
            // 🔥 CRITICAL: Update Redux with the new list from the server
            // res.data.passwords contains the fresh list from MongoDB
            dispatch(setPasswords(res.data.passwords)); 
            
            setIsEditing(false);
            setShow(false); // Reset the "Eye" icon view
            setDecPassword(""); // Clear the old decrypted cache
        }
    } catch (err) {
        toast.error("Update failed.");
    }
};

  const deletePassword = async () => {
    try {
      const res = await deleteAPassword({ id });
      if (res.status === 200) {
        dispatch(delPass(id));
        toast.success("Deleted.");
      }
    } catch (err) {
      toast.error("Delete failed.");
    }
  };

  return (
    <div className="password">
      <ToastContainer />
      {!isEditing ? (
        <>
          <div className="password__header">
            <div className="password__left">
              <h3 className="password__name">{name}</h3>
            </div>
            <div className="password__actions">
              <FontAwesomeIcon icon={faPen} onClick={() => setIsEditing(true)} className="edit__icon" />
              <FontAwesomeIcon icon={faTrash} onClick={deletePassword} className="delete__btn" />
            </div>
          </div>
          <div className="password__email">{email}</div>
          <div className="password__bottom">
            <input
              className="password__input"
              type={show ? "text" : "password"}
              value={show ? decPassword : "••••••••••••"}
              readOnly
            />
            <FontAwesomeIcon
              icon={show ? faEyeSlash : faEye}
              onClick={decryptPassword}
              style={{cursor: 'pointer'}}
            />
          </div>
        </>
      ) : (
        <div className="edit-section">
          <input type="text" value={editPlatform} onChange={(e) => setEditPlatform(e.target.value)} placeholder="Platform" />
          <input type="text" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={editPass} onChange={(e) => setEditPass(e.target.value)} placeholder="New Password" />
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button onClick={updatePassword}>Save Securely</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Password;