import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { BACKEND_URL } from "../../config/baseurl";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Setting.module.css";
import userIcon from "../../assets/images/profile.svg"
import lockIcon from "../../assets/images/lock.svg"
import eyeIcon from "../../assets/images/view.png"
import eyeSlashIcon from "../../assets/images/hide.png"

function SettingContent() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [userName, setUserName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const handleUpdatePassword = async () => {
        setIsLoading(true);
        if (newPassword === oldPassword) {
            toast.error("New & Old password not be same!", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
            });
            setIsLoading(false);
            return;
        }
        if (!newPassword || !oldPassword) {
            toast.error("Please fill in all the fields", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
            });
            setIsLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('userToken'); // Get the JWT token from localStorage
            const response = await axios.put(
                `${BACKEND_URL}/users/profile`,
                { oldPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Set the Authorization header with the token
                    }
                }
            );
            toast.success("Password Updated Successfully", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
            });
            setNewPassword("");
            setOldPassword("");
        } catch (error) {
            // toast.error(error.response.data.error || 'Failed to update password')
            if (error.response.status === 401) {
                toast.error("Old password is incorrect", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                });
                setIsLoading(false);
                return;
            }
            toast.error(error.response.data.message, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem("userId");
            try {
                const token = localStorage.getItem('userToken'); // Get the JWT token from localStorage
                const response = await axios.get(`${BACKEND_URL}/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Set the Authorization header with the token
                    }
                });
                setUserName(response.data.user.name)
            } catch (error) {
                console.error("Error fetching user name:", error);
            }
        };
        fetchUserData();
    }, []);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };


    return (
        <div className={styles.settingScreen}>
            <h1 className={styles.settingTitle}>Settings</h1>
            <form
                className={styles.formContainer}
            >
                <div className={styles.formAttribute}>
                    <span className={styles.logo}><img className={styles.Icon} src={userIcon} alt="email icon" /></span>
                    <input
                        type="Name"
                        id="Name"
                        name="Name"
                        value={userName}
                        placeholder="Name"
                        className={styles.formInput}
                        readOnly
                    />
                </div>

                <div className={styles.formAttribute}>
                    <span className={styles.logo}><img className={styles.Icon} src={lockIcon} alt="email icon" /></span>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Old Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className={styles.formInput}
                    />
                    <img src={showPassword ? eyeIcon : eyeSlashIcon} alt="eye icon" className={styles.passwordToggle} onClick={togglePassword} />

                </div>
                <div className={styles.formAttribute}>
                    <span className={styles.logo}><img className={styles.Icon} src={lockIcon} alt="lock icon" /></span>
                    <input
                        type={showNewPassword ? "text" : "password"}
                        name="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={styles.formInput}
                    />
                    <img src={showNewPassword ? eyeIcon : eyeSlashIcon} alt="eye icon" className={styles.newPasswordToggle} onClick={toggleNewPassword} />
                </div>
                <div className={styles.btnDiv}>
                    <button onClick={handleUpdatePassword} disabled={isLoading} className={styles.updateBtn}>
                        {isLoading ? "Updating..." : "Update"}
                    </button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}

export default SettingContent;
