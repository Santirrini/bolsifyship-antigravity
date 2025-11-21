"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, User, Shield, Mail, Trash2, CheckCircle, XCircle, ShieldAlert, ShieldCheck, Plus, X } from "lucide-react";

interface UserData {
    id: number;
    email: string;
    full_name: string;
    is_admin: number;
    is_active: number;
}

import { adminService } from "@/services/admin";

export default function AdminUsers() {
    const router = useRouter();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newUser, setNewUser] = useState({
        full_name: "",
        email: "",
        password: "",
        is_admin: 0
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await adminService.getUsers();
            setUsers(data);
        } catch (error: any) {
            console.error("Error fetching users:", error);
            if (error.response && error.response.status === 401) {
                alert("Session expired or unauthorized. Please login again.");
                router.push("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAdmin = async (user: UserData) => {
        if (!confirm(`Are you sure you want to ${user.is_admin ? 'remove' : 'grant'} admin permissions for ${user.full_name}?`)) return;

        try {
            await adminService.updateUser(user.id, { is_admin: user.is_admin === 1 ? 0 : 1 });
            fetchUsers();
        } catch (error) {
            console.error("Error updating user role:", error);
            alert("Failed to update user role");
        }
    };

    const handleToggleActive = async (user: UserData) => {
        if (!confirm(`Are you sure you want to ${user.is_active ? 'deactivate' : 'activate'} ${user.full_name}?`)) return;

        try {
            await adminService.updateUser(user.id, { is_active: user.is_active === 1 ? 0 : 1 });
            fetchUsers();
        } catch (error) {
            console.error("Error updating user status:", error);
            alert("Failed to update user status");
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

        try {
            await adminService.deleteUser(userId);
            setUsers(users.filter(u => u.id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user");
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminService.createUser(newUser);
            setShowCreateModal(false);
            setNewUser({ full_name: "", email: "", password: "", is_admin: 0 });
            fetchUsers();
            alert("User created successfully!");
        } catch (error: any) {
            console.error("Error creating user:", error);
            alert(error.response?.data?.detail || "Failed to create user");
        }
    };

    const filteredUsers = users.filter((user) =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Users</h2>
                    <p className="text-gray-400 mt-1">Manage registered users</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Create User
                </button>
            </div>

            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-800">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-400">
                        <thead className="bg-gray-800 text-gray-300 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center">
                                        Loading users...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-500">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <span className="font-medium text-white">{user.full_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-gray-500" />
                                                <span>{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.is_admin === 1 ? (
                                                <span className="flex items-center gap-1 text-purple-400 bg-purple-400/10 px-2 py-1 rounded-lg text-xs font-medium w-fit">
                                                    <Shield className="w-3 h-3" />
                                                    Admin
                                                </span>
                                            ) : (
                                                <span className="text-gray-500 bg-gray-800 px-2 py-1 rounded-lg text-xs font-medium w-fit">
                                                    Customer
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.is_active === 1 ? (
                                                <span className="text-green-400 bg-green-400/10 px-2 py-1 rounded-lg text-xs font-medium">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="text-red-400 bg-red-400/10 px-2 py-1 rounded-lg text-xs font-medium">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleToggleAdmin(user)}
                                                    className={`p-2 rounded-lg transition-colors ${user.is_admin === 1
                                                        ? "text-purple-400 hover:bg-purple-400/10"
                                                        : "text-gray-400 hover:text-purple-400 hover:bg-purple-400/10"
                                                        }`}
                                                    title={user.is_admin === 1 ? "Remove Admin" : "Make Admin"}
                                                >
                                                    {user.is_admin === 1 ? <ShieldCheck className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                                                </button>

                                                <button
                                                    onClick={() => handleToggleActive(user)}
                                                    className={`p-2 rounded-lg transition-colors ${user.is_active === 1
                                                        ? "text-green-400 hover:bg-green-400/10"
                                                        : "text-red-400 hover:bg-red-400/10"
                                                        }`}
                                                    title={user.is_active === 1 ? "Deactivate User" : "Activate User"}
                                                >
                                                    {user.is_active === 1 ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h3 className="text-xl font-bold text-white mb-6">Create New User</h3>

                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newUser.full_name}
                                    onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                                <select
                                    value={newUser.is_admin}
                                    onChange={(e) => setNewUser({ ...newUser, is_admin: parseInt(e.target.value) })}
                                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none"
                                >
                                    <option value={0}>Customer</option>
                                    <option value={1}>Admin</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-colors mt-4"
                            >
                                Create User
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
