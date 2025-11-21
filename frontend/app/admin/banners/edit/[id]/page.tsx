"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BannerForm from "@/components/admin/BannerForm";
import { bannerService, Banner } from "@/services/bannerService";

export default function EditBannerPage() {
    const params = useParams();
    const [banner, setBanner] = useState<Banner | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const data = await bannerService.getById(Number(params.id));
                setBanner(data);
            } catch (error) {
                console.error("Error fetching banner:", error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchBanner();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (!banner) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-white">Banner not found</div>
            </div>
        );
    }

    return <BannerForm initialData={banner} isEditing />;
}
