import React, { useContext, useCallback } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { AuthContext } from '../store/context/AuthContext';
import { useGetLoggedInUser, useGetUnreadMessageCount } from '../store/tanstackStore/services/queries';
import { useQueryClient } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { data: userData } = useGetLoggedInUser();
  const { data: unreadData } = useGetUnreadMessageCount();
  const queryClient = useQueryClient();

  console.log(userData)
  
  const unreadCount = unreadData?.unreadCount || 0;

  const mainNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'mdi:view-dashboard', color: 'text-[#23398B]' },
    { name: 'My Profile', path: '/profile', icon: 'mdi:account', color: 'text-gray-400' },
    { name: 'Research Requests', path: '/requests', icon: 'mdi:calendar-check', color: 'text-gray-400' },
    { name: 'Direct Messages', path: '/direct-messages', icon: 'mdi:message-text', color: 'text-gray-400', badge: unreadCount },
  ];
  const otherNavItems = [
    // { name: 'Notifications', path: '/notifications', icon: 'mdi:cube', color: 'text-gray-400' },
    { name: 'Settings', path: '/settings', icon: 'mdi:cog', color: 'text-gray-400' },
  ];

  const handleLogout = useCallback(() => {
    logout();
    // Reset all queries in the query client
    queryClient.clear(); // This clears all queries from the cache
    navigate('/login', { replace: true });
  }, [logout, navigate, queryClient]);

  return (
    <aside className="w-56 bg-white shadow-md flex flex-col min-h-screen h-screen overflow-y-auto">
      {/* Logo */}
      <div className="px-4 py-4">
        <div className="flex items-start">
          <img src="/Logo2.png" alt="UMI Logo" className="h-12 w-auto" />
        </div>
      </div>
      {/* User Info */}
      <div className="flex items-center gap-3 px-4 py-3 border-y border-[#E5E7EB]">
        <Avatar>
          <AvatarImage
            src={userData?.user?.profile_image}
            alt="profile"
          />
          <AvatarFallback>
            {userData?.user?.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <span className="font-semibold text-gray-800 text-xs leading-tight">
            {userData?.user?.name || 'Student'}
          </span>
          <span className="text-xs text-gray-500">
            {userData?.user?.studentId || 'Student ID'}
          </span>
        </div>
      </div>
      {/* Main Activities */}
      <div className="px-4 pt-3">
        <div className="text-xs text-gray-400 font-semibold mb-1">Main Activities</div>
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive: navActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-xs transition-colors ${
                    navActive || isActive
                      ? 'bg-blue-50 text-[#23398B] font-semibold'
                      : 'text-gray-900 hover:bg-blue-50'
                  }`
                }
              >
                <Icon
                  icon={item.icon}
                  className={`text-xl ${isActive ? 'text-[#23398B]' : 'text-gray-400'}`}
                />
                <span>{item.name}</span>
                {item.badge > 0 && (
                  <span className="ml-auto border border-[#7DD3FC] text-[#0369A1] text-xs px-2 py-0.5 rounded-full font-semibold bg-white">{item.badge}</span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
      {/* Other options */}
      <div className="px-4 pt-6">
        <div className="text-xs text-gray-400 font-semibold mb-2">Other options</div>
        <nav className="space-y-1">
          {otherNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive: navActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-xs transition-colors ${
                    navActive || isActive
                      ? 'bg-blue-50 text-[#23398B] font-semibold'
                      : 'text-gray-900 hover:bg-blue-50'
                  }`
                }
              >
                <Icon
                  icon={item.icon}
                  className={`text-2xl ${isActive ? 'text-[#23398B]' : 'text-gray-400'}`}
                />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
      {/* Logout */}
      <div className="mt-auto px-4 py-4  border-t border-[#E5E7EB]">
        <button
          className="w-full flex items-center justify-between px-4 py-2 text-red-600 cursor-pointer hover:bg-red-50 font-medium text-sm transition-colors"
          onClick={handleLogout}
        >
          <span>Logout</span>
          <Icon icon="mdi:logout" className="text-base" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;