import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { logoutUser } from '../../axios/instance';
import { useDispatch } from "react-redux";
import { setAuth, setMasterKey } from '../../redux/actions';


function Logout()
{

    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() =>
    {
        const logout = async () =>
        {
            try
            {
                const res = await logoutUser();
                if (res.status === 200)
                {
                    sessionStorage.removeItem("masterKey");
                    dispatch(setMasterKey(null));
                    dispatch(setAuth(false));
                    history.replace("/signin");
                }
                else
                {
                    throw new Error("Could not logout the user.");
                }
            }
            catch (err)
            {
                console.log(err);
                sessionStorage.removeItem("masterKey");
                history.replace("/signin");
            }
        }
        logout();

    },  [history, dispatch])
    return (
        <div className="logout">
            Logging you out...
        </div>
    )
}

export default Logout;
