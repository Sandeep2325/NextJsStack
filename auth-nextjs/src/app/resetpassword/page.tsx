"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { sendEmail } from "@/helpers/mailer";
import { TIMEOUT } from "dns";
export default function ResetPasswordPage() {
    const router = useRouter();
    const [token, setToken] = useState("");
    const [tokenVerifies, setTokenVerify] = useState(false);
    const [mailSent, setMailSent]=useState(false)
    const [reqSent, setReqSent]=useState(false)
    const [password, setPassword] = useState({
        email: "",
        password: "",
        cpassword: "",
    });
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = window.location.search.split("=")[1];
        setToken(token || "");
    }, []);
    const verifyToken = async () => {
        try {
            setLoading(true);
            const res = await axios.post("/api/users/resetpassword", { token });
            console.log("forogt password", res);
            if (res.status === 200) {
                setTokenVerify(true);
                toast("Please confirm new password");
            } else {
                toast.error("Verification failed")
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token.length > 0) {
            verifyToken();
        }
    }, [token]);

    const sendLink = async () => {
        try {
            setReqSent(true)
            setLoading(true)
            if (!password.email) {
                toast.error("Cannot be empty")
            } else {
                console.log(password.email)
                const res = await axios.post('/api/users/resetpassword', { token, email: password.email, password: password.cpassword })
                console.log(res)
                toast.success("Please check your inbox for reset link")
                setMailSent(true)

            }
        } catch (error: any) {
            console.log(error)
            toast.error(error.response.data.error)
        } finally {
            setLoading(false)
            setReqSent(false)

        }

    }
    const confimNewPassword = (e: any) => {
        toast.remove()
        setPassword({ ...password, cpassword: e.target.value })
        console.log(password.password, password.cpassword, e.target.value)
        if (password.password !== e.target.value) {
            toast.error("Passwords not matching")
            
        } else {
            toast.success("Password matched")
        }
    }
    const resetPassword = async () => {
        toast.remove()
        try {
            setReqSent(true)


            setLoading(true)
            if(password.cpassword===password.password){
                const res = await axios.post("/api/users/resetpassword", { token, password: password.cpassword, email: password.email })
                if (res.status === 200) {
                    
                    setTimeout(() => {
                        toast.success("Password changes successfully")
                    }, 1000); // 1000 milliseconds = 1 second
                    router.push("/login")
                }else{
                    toast.error("Failed to update password")
                }
            }else{
                toast.error("Passwords not matching")
            }
            
        } catch (error: any) {
            toast.error(error.message)
        }finally{
            setReqSent(false)
            setLoading(false)
        }
    }
    return (
        <div className="m-4">
            <Toaster />
            <h1 className="text-center">
                {loading ? "Loading..." : "Reset password"}
            </h1>
            {tokenVerifies ? ( 
                <div className="max-w-md mx-auto">
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password.password}
                            onChange={(e) =>
                                setPassword({ ...password, password: e.target.value })
                            }
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label
                            htmlFor="email"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            New Password
                        </label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="password"
                            name="cpassword"
                            id="cpassword"
                            value={password.cpassword}
                            onChange={confimNewPassword
                            }
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label
                            htmlFor="email"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Confirm Password
                        </label>
                    </div>
                    <button
                        onClick={resetPassword}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        {buttonDisabled ? "Fill fields" : reqSent?"Proccesing...":"Reset"}
                    </button>

                </div>
            ) : mailSent?(<h1>Reset link sent to your email</h1>):(
                
                <div className="max-w-md mx-auto">
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={password.email}
                            onChange={(e) =>
                                setPassword({ ...password, email: e.target.value })
                            }
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label
                            htmlFor="email"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Email
                        </label>
                    </div>
                    <button
                        onClick={sendLink}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" disabled={reqSent?true:false} >
                        {reqSent?"Processing...":"Send Link"}
                    </button>
                </div>
            )}
        </div>
    );
}
