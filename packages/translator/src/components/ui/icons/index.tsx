import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Command,
  CreditCard,
  File,
  FileText,
  HelpCircle,
  Image,
  Laptop,
  Loader2,
  type Icon as LucideIcon,
  Moon,
  MoreVertical,
  Pizza,
  Plus,
  Settings,
  SunMedium,
  Trash,
  Twitter,
  User,
  X,
} from 'lucide-react';

import { LangBridgeLogo } from './LangBridgeLogo';
import { NextJSLogo } from './NextJSLogo';
import { GithubLogo } from './GithubLogo';
import { GoogleLogo } from './GoogleLogo';

export type Icon = LucideIcon;

export const Icons = {
  myLogo: LangBridgeLogo,
  nextJs: NextJSLogo,
  twitter: Twitter,
  check: Check,
  logo: Command,
  close: X,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  post: FileText,
  page: File,
  media: Image,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: User,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  gitHub: GithubLogo,
  google: GoogleLogo,
};
