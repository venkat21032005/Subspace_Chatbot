import React from 'react';
import { useSignOut } from '@nhost/react';
import { useAuth } from '../contexts/AuthContext';
import { FiLogOut } from 'react-icons/fi';

const UserFooter = () => {
  const { user } = useAuth();
  const { signOut } = useSignOut();

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <div className="p-4 border-t border-gray-700 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
          {getInitials(user?.displayName)}
        </div>
        <div>
          <p className="font-semibold">{user?.displayName || 'User'}</p>
          <p className="text-sm text-gray-400">{user?.email}</p>
        </div>
      </div>
      <button
        onClick={signOut}
        className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
        aria-label="Sign out"
      >
        <FiLogOut size={20} />
      </button>
    </div>
  );
};

export default UserFooter;
