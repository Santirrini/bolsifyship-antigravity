"use client";

import React from 'react';
import {
    Edit,
    MapPin,
    CreditCard,
    Package,
    Heart,
    Search,
    HelpCircle
} from 'lucide-react';
import ProfileMenuItem from './ProfileMenuItem';

const ProfileMenu = () => {
    return (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl shadow-neutral-100/50 dark:shadow-none border border-neutral-100 dark:border-neutral-800 overflow-hidden mb-8">
            <ProfileMenuItem icon={Edit} label="Editar Perfil" href="/profile/edit" />
            <ProfileMenuItem icon={MapPin} label="Direcciones de Envío" href="/profile/addresses" />
            <ProfileMenuItem icon={CreditCard} label="Métodos de Pago" href="/profile/payments" />
            <ProfileMenuItem icon={Package} label="Historial de Pedidos" href="/profile/orders" />
            <ProfileMenuItem icon={Heart} label="Mis Favoritos" href="/profile/favorites" />
            <ProfileMenuItem icon={Search} label="Comparador Avanzado" href="/search" isPro={true} />
            <ProfileMenuItem icon={HelpCircle} label="Ayuda y Soporte" href="/support" />
        </div>
    );
};

export default ProfileMenu;
