import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../contexts/ProfileContext';
import { useAuth } from '../../contexts/AuthContext';

interface AccountMenuProps {
  visible?: boolean;
}

const AccountMenu: React.FC<AccountMenuProps> = ({ visible }) => {
  const { profiles, currentProfile, switchProfile } = useProfile();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  if (!visible) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="bg-black w-56 absolute top-14 right-0 py-5 flex-col border-2 border-gray-800 flex">
      <div className="flex flex-col gap-3">
        {/* Current Profile */}
        <div className="px-3 group/item flex flex-row gap-3 items-center w-full">
          <div className={`w-8 h-8 rounded-md ${currentProfile?.color || 'bg-gray-700'}`} />
          <p className="text-white text-sm font-semibold">{currentProfile?.name || 'Unknown'}</p>
        </div>

        {/* Divider */}
        <hr className="bg-gray-600 border-0 h-px my-2" />

        {/* Other Profiles */}
        {profiles
          .filter((profile) => profile.id !== currentProfile?.id)
          .map((profile) => (
            <div
              key={profile.id}
              onClick={() => switchProfile(profile)}
              className="px-3 group/item flex flex-row gap-3 items-center w-full hover:bg-gray-800 cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-md ${profile.color}`} />
              <p className="text-white text-sm group-hover/item:underline">{profile.name}</p>
            </div>
          ))}
      </div>

      <hr className="bg-gray-600 border-0 h-px my-4" />

      <div
        onClick={handleSignOut}
        className="px-3 text-center text-white text-sm hover:underline cursor-pointer"
      >
        Sign out of Notflix
      </div>
    </div>
  );
};

export default AccountMenu;
