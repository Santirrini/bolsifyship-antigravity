"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    Search, User, Shield, Mail, Trash2, CheckCircle, XCircle,
    ShieldCheck, Plus, X, ChevronLeft, ChevronRight,
    ArrowUpDown, ArrowUp, ArrowDown, Filter, AlertTriangle
} from "lucide-react";
import { adminService } from "@/services/admin";

interface UserData {
    id: number;
    email: string;
    full_name: string;
    is_admin: number;
    is_active: number;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

export default function AdminUsers() {
    const router = useRouter();

    // Data State
    const [users, setUsers] = useState<UserData[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);

    // Filter & Sort State
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [roleFilter, setRoleFilter] = useState<number | null>(null);
    const [statusFilter, setStatusFilter] = useState<number | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'id', direction: 'asc' });

    // Pagination State
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    // Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newUser, setNewUser] = useState({
        full_name: "",
        email: "",
        password: "",
        is_admin: 0
    });
    const [confirmationModal, setConfirmationModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        action: () => Promise<void>;
        type: 'danger' | 'warning' | 'info';
    }>({
        isOpen: false,
        title: "",
        message: "",
        action: async () => { },
        type: 'info'
    });

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const skip = (page - 1) * limit;
            const data = await adminService.getUsers(
                skip,
                limit,
                debouncedSearch,
                roleFilter,
                statusFilter,
                sortConfig.key,
                sortConfig.direction
            );
            setUsers(data.users);
            setTotalUsers(data.total);
        } catch (error: any) {
            console.error("Error fetching users:", error);
            if (error.response && error.response.status === 401) {
                alert("Session expired or unauthorized. Please login again.");
                router.push("/login");
            }
        } finally {
            setLoading(false);
        }
    }, [page, limit, debouncedSearch, roleFilter, statusFilter, sortConfig, router]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, roleFilter, statusFilter]);

    const handleSort = (key: string) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const openConfirmation = (title: string, message: string, action: () => Promise<void>, type: 'danger' | 'warning' | 'info' = 'warning') => {
        setConfirmationModal({
            isOpen: true,
            title,
            message,
            action,
            type
        });
    };

    const handleToggleAdmin = (user: UserData) => {
        openConfirmation(
            "Update User Role",
            `Are you sure you want to ${user.is_admin ? 'remove' : 'grant'} admin permissions for ${user.full_name}?`,
            async () => {
                try {
                    await adminService.updateUser(user.id, { is_admin: user.is_admin === 1 ? 0 : 1 });
                    fetchUsers();
                    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
                } catch (error) {
                    console.error("Error updating user role:", error);
                    alert("Failed to update user role");
                }
            },
            'warning'
        );
    };

    const handleToggleActive = (user: UserData) => {
        openConfirmation(
            "Update User Status",
            `Are you sure you want to ${user.is_active ? 'deactivate' : 'activate'} ${user.full_name}?`,
            async () => {
                try {
                    await adminService.updateUser(user.id, { is_active: user.is_active === 1 ? 0 : 1 });
                    fetchUsers();
                    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
                } catch (error) {
                    console.error("Error updating user status:", error);
                    alert("Failed to update user status");
                }
            },
            user.is_active ? 'danger' : 'info'
        );
    };

    const handleDeleteUser = (userId: number) => {
        openConfirmation(
            "Delete User",
            "Are you sure you want to delete this user? This action cannot be undone.",
            async () => {
                try {
                    await adminService.deleteUser(userId);
                    fetchUsers(); // Refresh list to handle pagination correctly
                    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
                } catch (error) {
                    console.error("Error deleting user:", error);
                    alert("Failed to delete user");
                }
            },
            'danger'
        );
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

    const SortIcon = ({ columnKey }: { columnKey: string }) => {
        if (sortConfig.key !== columnKey) return <ArrowUpDown className="w-4 h-4 text-gray-600" />;
        return sortConfig.direction === 'asc'
            ? <ArrowUp className="w-4 h-4 text-purple-400" />
            : <ArrowDown className="w-4 h-4 text-purple-400" />;
    };

    const totalPages = Math.ceil(totalUsers / limit);

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
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-800 flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex gap-3">
                        <div className="relative">
                            <select
                                value={roleFilter ?? ""}
                                onChange={(e) => setRoleFilter(e.target.value === "" ? null : parseInt(e.target.value))}
                                className="appearance-none bg-gray-800 text-white pl-4 pr-10 py-2 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none cursor-pointer"
                            >
                                <option value="">All Roles</option>
                                <option value="1">Admin</option>
                                <option value="0">Customer</option>
                            </select>
                            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        </div>

                        <div className="relative">
                            <select
                                value={statusFilter ?? ""}
                                onChange={(e) => setStatusFilter(e.target.value === "" ? null : parseInt(e.target.value))}
                                className="appearance-none bg-gray-800 text-white pl-4 pr-10 py-2 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none cursor-pointer"
                            >
                                <option value="">All Status</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-400">
                        <thead className="bg-gray-800 text-gray-300 uppercase text-xs font-semibold">
                            <tr>
                                <th
                                    className="px-6 py-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
                                    onClick={() => handleSort('full_name')}
                                >
                                    <div className="flex items-center gap-2">
                                        User
                                        <SortIcon columnKey="full_name" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
                                    onClick={() => handleSort('email')}
                                >
                                    <div className="flex items-center gap-2">
                                        Email
                                        <SortIcon columnKey="email" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
                                    onClick={() => handleSort('is_admin')}
                                >
                                    <div className="flex items-center gap-2">
                                        Role
                                        <SortIcon columnKey="is_admin" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
                                    onClick={() => handleSort('is_active')}
                                >
                                    <div className="flex items-center gap-2">
                                        Status
                                        <SortIcon columnKey="is_active" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex justify-center items-center gap-3">
                                            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span>Loading users...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No users found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
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

                {/* Pagination */}
                <div className="p-4 border-t border-gray-800 flex items-center justify-between text-sm text-gray-400">
                    <div>
                        Showing <span className="text-white font-medium">{Math.min((page - 1) * limit + 1, totalUsers)}</span> to <span className="text-white font-medium">{Math.min(page * limit, totalUsers)}</span> of <span className="text-white font-medium">{totalUsers}</span> users
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-white font-medium">Page {page} of {Math.max(1, totalPages)}</span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || totalPages === 0}
                            className="p-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 relative shadow-xl">
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

            {/* Confirmation Modal */}
            {confirmationModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm p-6 relative shadow-xl">
                        <div className="flex flex-col items-center text-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${confirmationModal.type === 'danger' ? 'bg-red-500/10 text-red-500' :
                                    confirmationModal.type === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
                                        'bg-blue-500/10 text-blue-500'
                                }`}>
                                <AlertTriangle className="w-6 h-6" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{confirmationModal.title}</h3>
                            <p className="text-gray-400 mb-6">{confirmationModal.message}</p>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
                                    className="flex-1 px-4 py-2 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmationModal.action}
                                    className={`flex-1 px-4 py-2 rounded-xl text-white font-medium transition-colors ${confirmationModal.type === 'danger' ? 'bg-red-600 hover:bg-red-700' :
                                            confirmationModal.type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700' :
                                                'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
