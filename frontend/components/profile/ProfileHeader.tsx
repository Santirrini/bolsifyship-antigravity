import React from 'react';

interface ProfileHeaderProps {
    name: string;
    email: string;
    avatarUrl?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, email, avatarUrl }) => {
    return (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 shadow-lg mb-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>

            <div className="relative z-10 flex items-center gap-6">
                <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={name} className="h-full w-full rounded-full object-cover" />
                    ) : (
                        <span>{name.charAt(0).toUpperCase()}</span>
                    )}
                </div>
                <div>
                    <h2 className="text-2xl font-bold">{name}</h2>
                    <p className="text-blue-100 text-sm mt-1">{email}</p>
                    <div className="mt-3 flex gap-2">
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/10">
                            Miembro desde 2024
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
