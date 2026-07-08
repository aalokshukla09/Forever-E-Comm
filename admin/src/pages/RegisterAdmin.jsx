import React, { useState } from "react";
import axios from "axios";
import { BackendUrl } from "../App";
import { toast } from "react-toastify";

const RegisterAdmin = ({ token }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post(
                BackendUrl + "/api/user/admin/register",
                { name, email, password },
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success(response.data.message || "Admin registered successfully");
                setName("");
                setEmail("");
                setPassword("");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md">
            <h2 className="text-xl font-semibold mb-4">Register a New Admin</h2>
            <form onSubmit={onSubmitHandler} className="bg-white shadow-sm border rounded-lg px-6 py-6">
                <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Name</p>
                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                        type="text"
                        placeholder="Admin's full name"
                        required
                    />
                </div>
                <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Email Address</p>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                        type="email"
                        placeholder="new-admin@email.com"
                        required
                    />
                </div>
                <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Password</p>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                        type="password"
                        placeholder="At least 8 characters"
                        required
                        minLength={8}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black disabled:opacity-50"
                >
                    {loading ? "Registering..." : "Register Admin"}
                </button>
            </form>
            <p className="text-xs text-gray-500 mt-3">
                The new admin can log in with this email and password, and will be able to add,
                list, and manage products just like you.
            </p>
        </div>
    );
};

export default RegisterAdmin;