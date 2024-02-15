"use client";
import Link from "next/link";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData]=useState("nothing");
  const logout = async () => {
    try {
      const response = await axios.get("/api/users/logout");
      console.log(response);
      toast.success("Logout successfull");
      router.push("/");
    } catch (error:any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };
  useEffect(()=>{
const fetchData=async ()=>{
const res=await axios.get("/api/users/me")
console.log(res.data)
setData(res.data.data._id)
}
fetchData()
  },[])
  return (
    <div className="max-w-lg mx-auto my-10 bg-white rounded-lg shadow-md p-5">
      <Toaster />
      <h2>{data==="nothing" ? "Nothing":<Link href={`/profile/${data}`}>{data}</Link>}</h2>
      <button
        onClick={logout}
        className="bg-blue-200 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
      <img
        className="w-32 h-32 rounded-full mx-auto"
        src="https://picsum.photos/200"
        alt="Profile picture"
      />
      <h2 className="text-center text-2xl font-semibold mt-3">John Doe</h2>
      <p className="text-center text-gray-600 mt-1">Software Engineer</p>
      <div className="flex justify-center mt-5">
        <Link href="/" className="text-blue-500 hover:text-blue-700 mx-3">
          Twitter
        </Link>
        <Link href="/" className="text-blue-500 hover:text-blue-700 mx-3">
          Twitter
        </Link>
        <Link href="/" className="text-blue-500 hover:text-blue-700 mx-3">
          Twitter
        </Link>
      </div>
      <div className="mt-5">
        <h3 className="text-xl font-semibold">Bio</h3>
        <p className="text-gray-600 mt-2">
          John is a software engineer with over 10 years of experience in
          developing web and mobile applications. He is skilled in JavaScript,
          React, and Node.js.
        </p>
      </div>
    </div>
  );
}
