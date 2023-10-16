'use client';
import { usePathname, useRouter } from 'next/navigation';
import {
  Cloud,
  // CreditCard,
  // Github,
  // Keyboard,
  // LifeBuoy,
  // User,
  LogOut,
  Settings,
} from 'lucide-react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Props {
  session: Session;
}
export function SettingsMenu({ session }: Props) {
  const user = session?.user;
  const avatar = user?.image;
  const name = user?.name;
  // const email = user?.email;
  const pathname = usePathname();
  const router = useRouter();
  const handleSignOut = () => {
    signOut();
  };
  const goBillingPage = () => {
    router.push('/billing');
  };
  // const handleOpenGithubReop = () => {
  //   window.open('https:github.com/shixin-guo/my-bot', '_blank');
  // };
  const handleOpenChange = (open: boolean) => {
    // eslint-disable-next-line no-console
    console.log('open', open);
  };
  return (
    <span>
      <DropdownMenu onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Avatar>
            {avatar && name && <AvatarImage src={avatar} alt={name} />}
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {/* <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem> */}
            {/* <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem> */}
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            {/* <DropdownMenuItem>
              <Keyboard className="mr-2 h-4 w-4" />
              <span>Keyboard shortcuts</span>
              <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
            </DropdownMenuItem> */}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem onSelect={handleOpenGithubReop}>
            <Github className="mr-2 h-4 w-4" />
            <span>GitHub</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Support</span>
          </DropdownMenuItem> */}
          <DropdownMenuItem
            disabled={pathname === '/billing'}
            onSelect={goBillingPage}
          >
            {/* { name: 'Billing', href: '/billing' }, */}
            <Cloud className="mr-2 h-4 w-4" />
            Billing / Usage
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </span>
  );
}
