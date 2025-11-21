import Sidebar from "@/components/admin/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <div className="flex min-h-screen bg-black text-white">
                <Sidebar />
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto h-screen pt-20 lg:pt-8">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}
