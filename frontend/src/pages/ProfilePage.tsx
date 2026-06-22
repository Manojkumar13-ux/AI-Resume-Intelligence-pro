import React, { useState } from 'react';
import { Navbar } from '../components/common/Navbar';
import { GlassCard } from '../components/common/GlassCard';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.updateProfile({ name, email });
      updateUser(response.user);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">Profile Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Info */}
          <GlassCard>
            <h2 className="text-xl font-semibold dark:text-white mb-6">Profile Information</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </GlassCard>

          {/* Change Password */}
          <GlassCard>
            <h2 className="text-xl font-semibold dark:text-white mb-6">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field"
                  required
                />
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Minimum 6 characters
                </p>
              </div>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </GlassCard>

          {/* Account Info */}
          <GlassCard>
            <h2 className="text-xl font-semibold dark:text-white mb-4">Account Information</h2>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Plan</span>
                <span className="font-medium dark:text-white capitalize">
                  {user?.subscription?.plan || 'Free'}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Credits Remaining</span>
                <span className="font-medium dark:text-white">
                  {user?.isPro ? '∞' : user?.credits || 0}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Member Since</span>
                <span className="font-medium dark:text-white">
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </p>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;