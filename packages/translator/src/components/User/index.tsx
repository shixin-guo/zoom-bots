'use server';
import { FC } from 'react';
import { getServerSession } from 'next-auth/next';

import { AuthModal } from '@/components/User/AuthModal';
import { SettingsMenu } from '@/components/User/SettingsDropdown';
import { authOptions } from '@/lib/auth';

interface Props {
  show?: boolean;
  onClose?: () => void;
}

export const User: FC<Props> = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  return user ? <SettingsMenu session={session} /> : <AuthModal />;
};
