import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Browse/Navbar';

function SettingsPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { currentProfile } = useProfile();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleManageProfiles = () => {
    navigate('/manage-profiles');
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      // Call the database function to delete user
      const { error } = await supabase.rpc('delete_user');

      if (error) throw error;

      // Sign out and redirect
      await signOut();
      alert('Your account has been permanently deleted.');
      navigate('/login');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      alert(`Failed to delete account: ${error.message}`);
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };



  if (!currentProfile) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="pt-24 px-4 md:px-12 max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl text-white font-semibold mb-8">Settings</h1>

        {/* Account Information Section */}
        <div className="bg-zinc-900 rounded-lg p-6 mb-6 border border-gray-800">
          <h2 className="text-2xl text-white font-semibold mb-6">Account Information</h2>
          
          <div className="space-y-4">
            {/* Email */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-800">
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white">{user?.email}</p>
              </div>
            </div>

            {/* Change Password */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-800">
              <div>
                <p className="text-gray-400 text-sm">Password</p>
                <p className="text-white">••••••••</p>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition text-sm"
              >
                Change Password
              </button>
            </div>

            {/* Current Profile */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Current Profile</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className={`w-8 h-8 rounded-md ${currentProfile.color} flex items-center justify-center`}>
                    <span className="text-white text-sm font-semibold">
                      {currentProfile.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-white">{currentProfile.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Management Section */}
        <div className="bg-zinc-900 rounded-lg p-6 mb-6 border border-gray-800">
          <h2 className="text-2xl text-white font-semibold mb-6">Profile Management</h2>
          
          <button
            onClick={handleManageProfiles}
            className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition text-left"
          >
            Manage Profiles
          </button>
        </div>

        {/* Account Actions Section */}
        <div className="bg-zinc-900 rounded-lg p-6 mb-6 border border-gray-800">
          <h2 className="text-2xl text-white font-semibold mb-6">Account Actions</h2>
          
          <div className="space-y-4">
            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition"
            >
              Sign Out
            </button>

            {/* Delete Account */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="text-center text-gray-500 text-sm pb-8">
          <p>Notflix Clone v1.0</p>
          <p className="mt-1">Built with React, TypeScript & Supabase</p>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-lg p-8 max-w-md w-full mx-4 border border-gray-800">
            <h2 className="text-white text-2xl font-semibold mb-4">
              Delete Account?
            </h2>
            <p className="text-gray-300 mb-2">
              Are you sure you want to delete your account?
            </p>
            <p className="text-red-400 text-sm mb-6">
              This action is permanent and will delete:
            </p>
            <ul className="text-gray-400 text-sm mb-6 list-disc list-inside space-y-1">
              <li>All your profiles</li>
              <li>Your watchlist</li>
              <li>Your watch history</li>
              <li>All account data</li>
            </ul>
            <div className="flex gap-4">
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete My Account'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 py-3 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-600 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Change Password Modal Component
function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChangePassword = async () => {
    setError('');
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Error changing password:', err);
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg p-8 max-w-md w-full mx-4 border border-gray-800">
        <h2 className="text-white text-2xl font-semibold mb-6">
          Change Password
        </h2>

        {success ? (
          <div className="text-center py-8">
            <p className="text-green-400 text-lg mb-2">✓ Password Changed!</p>
            <p className="text-gray-400 text-sm">Closing...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-white text-sm mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800 text-white border border-gray-700 rounded-md focus:outline-none focus:border-white"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-white text-sm mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800 text-white border border-gray-700 rounded-md focus:outline-none focus:border-white"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-600 bg-opacity-20 border border-red-600 rounded-md">
                <p className="text-black text-sm font-bold">{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="flex-1 py-3 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition disabled:opacity-50"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-3 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-600 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SettingsPage;
