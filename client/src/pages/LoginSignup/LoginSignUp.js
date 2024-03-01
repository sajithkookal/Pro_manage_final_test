import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../config/baseurl";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./LoginSignUp.module.css"
import logo from "../../assets/images/logo.svg"
import emailIcon from "../../assets/images/mail.svg"
import lockIcon from "../../assets/images/lock.svg"
import userIcon from "../../assets/images/profile.svg"
import eyeIcon from "../../assets/images/view.png"
import eyeSlashIcon from "../../assets/images/hide.png"

function LoginSignup() {
    // State variables for managing the form and UI state
    const [showSignupForm, setShowSignupForm] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    // Function to switch between Sign Up and Log In forms
    const showSignup = () => {
        setShowSignupForm(true);
    };

    const showSignin = () => {
        setShowSignupForm(false);
    };

    // Function to validate email format
    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid Email Address", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
            });
        }
    };

    // State variables for form inputs
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSignUpLoading, setIsSignUpLoading] = useState(false);
    const [isLoginLoading, setIsLoginLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsSignUpLoading(true);

        // Check if required fields are filled
        if (!name || !email || !password) {
            toast.error("Please fill in all the fields", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
            });
            setIsSignUpLoading(false);
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
            });
            setIsSignUpLoading(false);
            return;
        }

        // Validate email format
        validateEmail();

        try {
            const response = await axios.post(`${BACKEND_URL}/users/register`, {
                name,
                email,
                password,
                confirmPassword,
            });


            if (response.data.token) {
                localStorage.setItem("userId", response.data.user._id);
                localStorage.setItem("userToken", response.data.token);
                localStorage.setItem("name", response.data.name);
                toast.success("Registration Successful", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                });
                setIsSignUpLoading(false);
                setTimeout(() => {
                    navigate("/dashboard"); // Redirect to login after 2 seconds
                }, 2000);
            } else {
                console.error("Registration failed: Token not received");
            }
        } catch (err) {
            console.error("Registration failed", err);
            if (err.response.status === 400) {
                toast.error("User already exists. Please Login!", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                });
                setIsSignUpLoading(false);
                setTimeout(() => {
                    showSignin();
                }, 2000); // Redirect to login after 2 seconds
                return;
            }
            toast.error(err.response.data.message, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
            });
            setIsSignUpLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSignUpLoading(true);

        if (!email || !password) {
            toast.error("Please fill in all the fields", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
            });
            setIsSignUpLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${BACKEND_URL}/users/login`, {
                email,
                password,
            });

            if (response.data.token) {
                localStorage.setItem("userId", response.data.user._id);
                localStorage.setItem("userToken", response.data.token);
                setIsLoginLoading(false);
                toast.success("Login Successful", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                });
                setIsLoginLoading(false);
                setTimeout(() => {
                    navigate("/dashboard"); // Redirect to login after 2 seconds
                }, 2000);
            } else {
                toast.error("Incorrect Email or Password. Try again.", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                });
                console.error("Login failed: Token not received");
            }
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const toggleLoginPassword = () => {
        setShowLoginPassword(!showLoginPassword);
    };

    return (
        <>
            <div className={styles.mainContainer}>
                <div className={styles.leftdiv}>
                    <div className={styles.leftdivContent}>
                        <img src={logo} alt="Logo" className={styles.leftdivlogo} />
                        <p className={styles.leftdivp1}>Welcome aboard my friend</p>
                        <p className={styles.leftdivp2}>just a couple of clicks and we start</p>
                    </div>
                </div>
                {showSignupForm ? (
                    <div className={styles.logInFormContainer}>
                        <h1>Login</h1>
                        <form
                            onSubmit={handleLogin}
                            className={styles.formContainer}
                        >
                            <div className={styles.formAttribute}>
                                <span className={styles.logo}><img className={styles.Icon} src={emailIcon} alt="email icon" /></span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    placeholder="Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    // required
                                    className={styles.formInput}
                                />
                            </div>

                            <div className={styles.formAttribute}>
                                <span className={styles.logo}><img className={styles.Icon} src={lockIcon} alt="email icon" /></span>
                                <input
                                    type={showLoginPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={password}
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={styles.formInput}
                                />
                                <img src={showLoginPassword ? eyeIcon : eyeSlashIcon} alt="eye icon" className={styles.loginPasswordToggle} onClick={toggleLoginPassword} />
                            </div>
                            <button type="submit" className={styles.signUpBtn}>
                                {isLoginLoading ? "Loading..." : "Log in"}
                            </button>
                            <p className={styles.formName}>Have no account yet?</p>
                            <button type="button" onClick={showSignin} className={styles.redirectBtn}>Register</button>
                        </form>
                    </div>
                ) : (
                    <div className={styles.logInFormContainer}>
                        <h1>Register</h1>
                        <form
                            className={styles.formContainer}
                            onSubmit={handleRegister}
                        >
                            <div className={styles.formAttribute}>
                                <span className={styles.logo}><img className={styles.Icon} src={userIcon} alt="email icon" /></span>
                                <input
                                    type="Name"
                                    id="Name"
                                    name="Name"
                                    value={name}
                                    placeholder="Name"
                                    onChange={(e) => setName(e.target.value)}
                                    // required
                                    className={styles.formInput}
                                />
                            </div>
                            <div className={styles.formAttribute}>
                                <span className={styles.logo}><img className={styles.Icon} src={emailIcon} alt="email icon" /></span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    placeholder="Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    // required
                                    className={styles.formInput}
                                />
                            </div>

                            <div className={styles.formAttribute}>
                                <span className={styles.logo}><img className={styles.Icon} src={lockIcon} alt="email icon" /></span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password1"
                                    name="password"
                                    value={password}
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    // required
                                    className={styles.formInput}
                                />
                                <img src={showPassword ? eyeIcon : eyeSlashIcon} alt="eye icon" className={styles.passwordToggle} onClick={togglePassword} />

                            </div>
                            <div className={styles.formAttribute}>
                                <span className={styles.logo}><img className={styles.Icon} src={lockIcon} alt="email icon" /></span>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="password2"
                                    name="password"
                                    value={confirmPassword}
                                    placeholder="Confirm Password"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    // required
                                    className={styles.formInput}
                                />
                                <img src={showConfirmPassword ? eyeIcon : eyeSlashIcon} alt="eye icon" className={styles.confirmPasswordToggle} onClick={toggleConfirmPassword} />

                            </div>
                            <button type="submit" className={styles.signUpBtn} >
                                {isSignUpLoading ? "Loading..." : "Register"}
                            </button>
                            <p className={styles.formName}>Have an account?</p>
                            <button type="button" onClick={showSignup} className={styles.redirectBtn}>Log in</button>
                        </form>
                    </div>)}
            </div>
            <ToastContainer />
        </>

    );
}

export default LoginSignup;
