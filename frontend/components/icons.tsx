import {
  LayoutDashboard,
  Users,
  Palette,
  Gamepad2,
  ListChecks,
  PiggyBank,
  Gift,
  Mail,
  Image as ImageIcon,
  Wand2,
  HeartHandshake,
  Baby,
  Menu,
  Bot,
  type LucideIcon,
} from 'lucide-react';

export type Icon = LucideIcon;

const GoogleIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.9 2.09-5.12 2.09-6.17 0-10.33-4.42-10.33-10.33s4.16-10.33 10.33-10.33c3.45 0 5.42 1.48 6.68 2.65l2.84-2.84C20.46 1.48 17.22 0 12.48 0 5.88 0 0 5.88 0 12.48s5.88 12.48 12.48 12.48c7.34 0 12.04-5.22 12.04-12.04 0-.85-.09-1.54-.18-2.2z"
      fill="currentColor"
    />
  </svg>
);

export const Icons = {
  Logo: Baby,
  Menu: Menu,
  Dashboard: LayoutDashboard,
  Guests: Users,
  Themes: Palette,
  ThemeAssistant: Bot,
  Games: Gamepad2,
  Checklist: ListChecks,
  Budget: PiggyBank,
  Registry: Gift,
  Invitations: Mail,
  Gallery: ImageIcon,
  DecorAssistant: Wand2,
  ThankYouHelper: HeartHandshake,
  Google: GoogleIcon,
};

