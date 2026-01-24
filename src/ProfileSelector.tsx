import ProfileAvatar from './components/ProfileSelector/ProfileAvatar';
import AddProfile from './components/ProfileSelector/AddProfile';
import ManageButton from './components/ProfileSelector/ManageButton';
import { useProfile } from './contexts/ProfileContext';

const ProfileSelector = () => {
  const { profiles, switchProfile, loading } = useProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <p className="text-white text-xl">Loading profiles...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="flex flex-col">
        <h1 className="text-3xl md:text-6xl text-white text-center mb-8">
          Who's watching?
        </h1>

        <div className="flex items-center justify-center gap-8">
          {profiles.map((profile) => (
            <ProfileAvatar
              key={profile.id}
              color={profile.color}
              name={profile.name}
              onClick={() => switchProfile(profile)}
            />
          ))}
          
          {profiles.length < 4 && (
            <AddProfile onClick={() => {/* TODO: Add profile functionality */}} />
          )}
        </div>

        <ManageButton onClick={() => {/* TODO: Manage profiles */}} />
      </div>
    </div>
  );
};

export default ProfileSelector;
