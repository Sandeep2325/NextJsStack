"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function VerifyEmailPage() {

    const [token, setToken] = useState("")
    const [verified, setVerified] = useState(false)
    const [error, setError] = useState(false)
    const verifyUserEmail = async () => {
        try {
            const res = await axios.post("/api/users/verifyemail", { token })
            console.log(res)
            setVerified(true);
        } catch (error: any) {
            setError(true);
            console.log(error.response.data)
        }
    }
    useEffect(() => {
        const urlToken = window.location.search.split("=")[1]
        setToken(urlToken||"")
    }, [])
    useEffect(() => {
        if (token.length > 0) {
            verifyUserEmail()
        }
    }, [token])

    return (<div>
        <h1 className="text-4xl">Verify Email</h1>
        <h2>{token?`${token}`:"no token"}</h2>

        {verified && (
            <div><h2>Email Verified</h2>
            <Link href="/login">Login</Link>
                </div>
        )}

{error && (
            <div><h2>Verification failed</h2>
                </div>
        )}
    </div>)
}