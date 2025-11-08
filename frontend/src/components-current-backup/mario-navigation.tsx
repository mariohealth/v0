'use client'
import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MarioLogo } from './mario-logo';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import {
  Search,
  Home,
  Heart,
  Gift,
  User,
  Bell,
  Menu,
  Filter,
  MapPin,
  ChevronDown,
  Settings,
  LogOut,
  CreditCard,
  Shield
} from 'lucide-react';

interface BottomNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const pathname = usePathname()
  const tabs = [
    { id: 'search', href: '/search', icon: Search, label: 'Search' },
    { id: 'health', href: '/health-hub', icon: Home, label: 'Health Hub' },
    { id: 'rewards', href: '/rewards', icon: Gift, label: 'Rewards' },
    { id: 'profile', href: '/profile', icon: User, label: 'Profile' }
  ];

  const getActiveTab = () => {
    if (activeTab) return activeTab
    if (pathname?.startsWith('/search') || pathname === '/') return 'search'
    if (pathname?.startsWith('/health')) return 'health'
    if (pathname?.startsWith('/rewards')) return 'rewards'
    if (pathname?.startsWith('/profile')) return 'profile'
    return 'search'
  }

  const currentTab = getActiveTab()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card h-14 flex items-center px-4 z-50 md:hidden mario-shadow-elevated">
      <div className="flex justify-around w-full">
        {tabs.map(({ id, href, icon: Icon, label }) => {
          const isActive = currentTab === id || (id === 'search' && currentTab === 'home')
          return (
            <Link
              key={id}
              href={href}
              onClick={() => onTabChange?.(id)}
              className={`flex flex-col items-center gap-1 py-1 px-2 cursor-pointer ${isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              style={{ transition: 'all 300ms ease-out' }}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  );
}

interface TopNavProps {
  title?: string;
  showBack?: boolean;
  showNotifications?: boolean;
  onBack?: () => void;
  onNotifications?: () => void;
  actions?: ReactNode;
  notificationCount?: number;
}

export function TopNav({
  title,
  showBack,
  showNotifications = true,
  onBack,
  onNotifications,
  actions,
  notificationCount = 0
}: TopNavProps) {
  return (
    <div className="bg-card h-14 flex items-center px-4 sticky top-0 z-40 mario-shadow-card">
      <div className="flex items-center gap-3 flex-1">
        {showBack ? (
          <Button variant="ghost" size="icon" onClick={onBack} className="mario-button-scale">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
        ) : (
          <MarioLogo variant="full" size="sm" />
        )}

        {title && (
          <h1 className="font-semibold text-card-foreground truncate">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        {actions}
        {showNotifications && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative mario-button-scale"
              >
                <User className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={onNotifications}>
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
                {notificationCount > 0 && (
                  <Badge className="ml-auto">{notificationCount}</Badge>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Shield className="mr-2 h-4 w-4" />
                <span>Privacy</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

interface DesktopNavProps {
  activeItem?: string;
  onItemChange?: (item: string) => void;
  notificationCount?: number;
}

export function DesktopNav({ activeItem, onItemChange, notificationCount = 0 }: DesktopNavProps) {
  const pathname = usePathname()
  const [searchValue, setSearchValue] = useState('');

  const menuItems = [
    { id: 'home', href: '/search', label: 'Home' },
    { id: 'providers', href: '/providers', label: 'Providers' },
    { id: 'medications', href: '/medications', label: 'Medications' },
    { id: 'health-hub', href: '/health-hub', label: 'Health Hub' },
    { id: 'rewards', href: '/rewards', label: 'Rewards' }
  ];

  const getActiveItem = () => {
    if (activeItem) return activeItem
    if (pathname === '/search' || pathname === '/') return 'home'
    if (pathname?.startsWith('/providers')) return 'providers'
    if (pathname?.startsWith('/medications')) return 'medications'
    if (pathname?.startsWith('/health')) return 'health-hub'
    if (pathname?.startsWith('/rewards')) return 'rewards'
    return 'home'
  }

  const currentActiveItem = getActiveItem()

  return (
    <div className="hidden md:block bg-card h-16 sticky top-0 z-40 mario-shadow-card">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/search" className="-ml-3">
            <MarioLogo variant="full" size="md" />
          </Link>

          <nav className="flex items-center gap-6">
            {menuItems.map(({ id, href, label }) => (
              <Link
                key={id}
                href={href}
                onClick={() => onItemChange?.(id)}
                className={`text-sm font-medium mario-transition ${currentActiveItem === id
                    ? 'text-primary border-b-2 border-primary pb-4'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search providers, procedures..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 w-80"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative mario-button-scale">
                <User className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
                {notificationCount > 0 && (
                  <Badge className="ml-auto">{notificationCount}</Badge>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Shield className="mr-2 h-4 w-4" />
                <span>Privacy</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

interface SearchHeaderProps {
  query: string;
  resultCount: number;
  showFilters?: boolean;
  showMap?: boolean;
  onFilterClick?: () => void;
  onMapToggle?: () => void;
}

export function SearchHeader({
  query,
  resultCount,
  showFilters = true,
  showMap = false,
  onFilterClick,
  onMapToggle
}: SearchHeaderProps) {
  return (
    <div className="bg-card border-b border-border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">{query}</h2>
          <p className="text-sm text-muted-foreground">
            {resultCount} options nearby
          </p>
        </div>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {showFilters && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onFilterClick}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filter & Sort
          </Button>

          <Button
            variant={showMap ? "default" : "outline"}
            size="sm"
            onClick={onMapToggle}
            className="flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            Map View
          </Button>
        </div>
      )}
    </div>
  );
}

interface BreadcrumbsProps {
  items: Array<{ label: string; href?: string }>;
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground py-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <svg className="h-4 w-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
          {item.href ? (
            <button className="hover:text-foreground mario-transition">
              {item.label}
            </button>
          ) : (
            <span className={index === items.length - 1 ? 'text-foreground font-medium' : ''}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}