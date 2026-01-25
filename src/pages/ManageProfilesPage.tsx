import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { AiOutlineEdit, AiOutlineClose } from 'react-icons/ai';

function ManageProfilesPage() {
  const navigate = useNavigate();
  const { profiles, deleteProfile } = useProfile();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<number | null>(null);

  const handleEdit = (profileId: number) => {
    navigate(`/edit-profile/${profileId}`);
  };

  const handleDeleteClick = (profileId: number) => {
    setProfileToDelete(profileId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (profileToDelete === null) return;

    setDeletingId(profileToDelete);
    try {
      await deleteProfile(profileToDelete);
      setShowDeleteConfirm(false);
      setProfileToDelete(null);
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('Failed to delete profile');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setProfileToDelete(null);
  };

  const handleDone = () => {
    navigate('/');
  };

  const profileToDeleteName = profiles.find(p => p.id === profileToDelete)?.name;

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-4xl px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl text-white font-semibold mb-4">
            Manage Profiles
          </h1>
          <p className="text-gray-400 text-lg">
            Edit or delete your profiles
          </p>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {profiles.map((profile) => (
            <div key={profile.id} className="flex flex-col items-center group">
              {/* Profile Avatar with Actions */}
              <div className="relative mb-4">
                {/* Avatar */}
                <div className={`
                  w-32 h-32 rounded-lg ${profile.color} 
                  flex items-center justify-center
                  border-4 border-transparent group-hover:border-gray-400 transition
                `}>
                  <span className="text-white text-4xl font-bold">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => handleEdit(profile.id)}
                  className="absolute -top-2 -right-2 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full border-2 border-gray-600 transition opacity-0 group-hover:opacity-100"
                  title="Edit Profile"
                >
                  <AiOutlineEdit size={20} />
                </button>

                {/* Delete Button - Only show if more than 1 profile */}
                {profiles.length > 1 && (
                  <button
                    onClick={() => handleDeleteClick(profile.id)}
                    className="absolute -top-2 -left-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full border-2 border-red-500 transition opacity-0 group-hover:opacity-100"
                    title="Delete Profile"
                  >
                    <AiOutlineClose size={20} />
                  </button>
                )}
              </div>

              {/* Profile Name */}
              <p className="text-white text-center font-medium">
                {profile.name}
              </p>
            </div>
          ))}
        </div>

        {/* Done Button */}
        <div className="flex justify-center">
          <button
            onClick={handleDone}
            className="px-8 py-3 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition"
          >
            DONE
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-zinc-900 rounded-lg p-8 max-w-md w-full mx-4 border border-gray-800">
              <h2 className="text-white text-2xl font-semibold mb-4">
                Delete Profile?
              </h2>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete <span className="font-semibold text-white">"{profileToDeleteName}"</span>? 
                This will also delete all watchlist items and watch history for this profile.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deletingId !== null}
                  className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition disabled:opacity-50"
                >
                  {deletingId !== null ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={handleDeleteCancel}
                  disabled={deletingId !== null}
                  className="flex-1 py-3 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-600 transition disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageProfilesPage;
