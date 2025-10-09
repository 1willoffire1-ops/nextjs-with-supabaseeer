'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  ChartBarIcon, 
  DocumentTextIcon, 
  BanknotesIcon, 
  CogIcon,
  UserGroupIcon,
  BellIcon,
  CubeIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'
import { ThemeToggleCompact } from '@/components/theme/theme-toggle'

const navigation = [
  { 
    name: 'VAT Analysis', 
    href: '/', 
    icon: HomeIcon,
    description: 'Upload and analyze invoices'
  },
  { 
    name: 'Analytics', 
    href: '/analytics', 
    icon: ChartBarIcon,
    description: 'Comprehensive insights and trends'
  },
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: CubeIcon,
    description: 'Overview and quick actions'
  },
  { 
    name: 'Errors', 
    href: '/errors', 
    icon: DocumentTextIcon,
    description: 'Review detected issues'
  },
  { 
    name: 'Notes', 
    href: '/notes', 
    icon: ClipboardDocumentListIcon,
    description: 'Supabase data viewer'
  },
  { 
    name: 'Savings', 
    href: '/savings', 
    icon: BanknotesIcon,
    description: 'Track penalty savings'
  },
  { 
    name: 'Government Filing', 
    href: '/filing', 
    icon: DocumentTextIcon,
    description: 'Submit VAT returns'
  }
]

const adminNavigation = [
  {
    name: 'Team Management',
    href: '/admin/team',
    icon: UserGroupIcon,
    description: 'Manage team members and permissions'
  },
  {
    name: 'Webhooks',
    href: '/admin/webhooks', 
    icon: BellIcon,
    description: 'Configure API webhooks'
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: CogIcon,
    description: 'System configuration'
  }
]

interface NavigationProps {
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export default function Navigation({ collapsed = false, onToggleCollapse }: NavigationProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Navigation */}
      <div className={`hidden lg:block fixed inset-y-0 left-0 z-50 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}>
        
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">⚡</div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">VATANA</span>
            </div>
          )}
          {collapsed && (
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mx-auto">⚡</div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 space-y-1">
            <div className={`text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 ${
              collapsed ? 'text-center' : 'px-3'
            }`}>
              {!collapsed && 'Main'}
            </div>
            
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className={`flex-shrink-0 h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{item.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {item.description}
                      </div>
                    </div>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Admin Section */}
          <div className="px-3 mt-8 space-y-1">
            <div className={`text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 ${
              collapsed ? 'text-center' : 'px-3'
            }`}>
              {!collapsed && 'Admin'}
            </div>
            
            {adminNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className={`flex-shrink-0 h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{item.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {item.description}
                      </div>
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
            {!collapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  U
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    User Account
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    Admin
                  </div>
                </div>
              </div>
            )}
            <ThemeToggleCompact />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">⚡</div>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">VATANA</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <ThemeToggleCompact />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white dark:bg-gray-800 shadow-xl">
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              
              <nav className="flex-1 overflow-y-auto py-4">
                <div className="px-3 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                          isActive
                            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <item.icon className="flex-shrink-0 h-5 w-5 mr-3" />
                        <div>
                          <div>{item.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
                
                <div className="px-3 mt-8 space-y-1">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-3">
                    Admin
                  </div>
                  {adminNavigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                          isActive
                            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <item.icon className="flex-shrink-0 h-5 w-5 mr-3" />
                        <div>
                          <div>{item.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// Layout wrapper component
interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation 
        collapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      {/* Main content */}
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      } lg:pt-0 pt-16`}>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}