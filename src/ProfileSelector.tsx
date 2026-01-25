import { useNavigate } from 'react-router-dom';
import ProfileAvatar from './components/ProfileSelector/ProfileAvatar';
import AddProfile from './components/ProfileSelector/AddProfile';
import ManageButton from './components/ProfileSelector/ManageButton';
import { useProfile } from './contexts/ProfileContext';
import { MAX_PROFILES } from './constants/profileColors';

const ProfileSelector = () => {
  const { profiles, switchProfile, loading } = useProfile();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <p className="text-white text-xl">Loading profiles...</p>
      </div>
    );
  }

  const handleProfileClick = (profile: any) => {
    switchProfile(profile);
  };

  const handleAddProfile = () => {
    navigate('/add-profile');
  };

  const handleManageProfiles = () => {
    navigate('/manage-profiles');
  };

  const canAddMoreProfiles = profiles.length < MAX_PROFILES;

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="flex flex-col items-center">
        <h1 className="text-5xl text-white font-semibold mb-8">
          Who's watching?
        </h1>

        <div className="flex gap-6 items-center">
          {/* Existing Profiles */}
          {profiles.map((profile) => (
            <ProfileAvatar
              key={profile.id}
              color={profile.color}
              name={profile.name}
              onClick={() => handleProfileClick(profile)}
            />
          ))}

          {/* Add Profile Button - Only show if under max limit */}
          {canAddMoreProfiles && (
            <AddProfile onClick={handleAddProfile} />
          )}
        </div>

        {/* Manage Profiles Button */}
        <ManageButton onClick={handleManageProfiles} />

        {/* Max profiles message */}
        {!canAddMoreProfiles && (
          <p className="text-gray-400 text-sm mt-4">
            Maximum of {MAX_PROFILES} profiles reached
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileSelector;
