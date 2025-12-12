'use client';

import LoginModal from './LoginModal';
import { useUI } from '@/context/UIContext';

/**
 * Global LoginModal wrapper that connects to UIContext.
 * This allows the LoginModal to be opened from anywhere in the app.
 */
export default function GlobalLoginModal() {
    const { isLoginOpen, closeLoginModal, authView } = useUI();

    return (
        <LoginModal
            isOpen={isLoginOpen}
            onClose={closeLoginModal}
            initialView={authView}
        />
    );
}
