'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface LayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout: React.FC<LayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== 'loading' && !session?.user) {
      toast.error("Veuillez créer un compte ou vous connecter d'abord !");
      router.push('/'); // redirige vers la page d'accueil ou signup
    }
  }, [status, session, router]);

  if (!session?.user) {
    return null; // ou un loader
  }

  return <>{children}</>;
};

export default ProtectedLayout;
