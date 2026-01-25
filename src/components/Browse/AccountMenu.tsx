import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../contexts/ProfileContext';
import { useAuth } from '../../contexts/AuthContext';
import { CiSettings } from 'react-icons/ci';
import { MdManageAccounts } from 'react-icons/md';

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

  const handleManageProfiles = () => {
    navigate('/manage-profiles');
  };

  const handleSettings = () => {
    navigate('/browse/'+ currentProfile?.id  +'/settings');
  };

  return (
    <div className="bg-black w-56 absolute top-14 right-0 py-5 flex-col border-2 border-gray-800 flex">
      <div className="flex flex-col gap-3">
        {/* Current Profile */}
        <div className="px-3 group/item flex flex-row gap-3 items-center w-full">
          <div className={`w-8 h-8 rounded-md ${currentProfile?.color || 'bg-gray-600'} flex items-center justify-center`}>
            <span className="text-white text-sm font-semibold">
              {currentProfile?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <p className="text-white text-sm">
            {currentProfile?.name || 'Unknown'}
          </p>
        </div>

        {/* Divider */}
        <hr className="bg-gray-600 border-0 h-px my-1" />

        {/* Other Profiles */}
        {profiles
          .filter((profile) => profile.id !== currentProfile?.id)
          .map((profile) => (
            <div
              key={profile.id}
              onClick={() => switchProfile(profile)}
              className="px-3 group/item flex flex-row gap-3 items-center w-full hover:bg-gray-800 cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-md ${profile.color} flex items-center justify-center`}>
                <span className="text-white text-sm font-semibold">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-white text-sm group-hover/item:underline">
                {profile.name}
              </p>
            </div>
          ))}

        {/* Manage Profiles Link */}
        <div
          onClick={handleManageProfiles}
          className="px-3 group/item flex flex-row gap-3 items-center w-full hover:bg-gray-800 cursor-pointer"
        >
          <MdManageAccounts  className='text-white h-8 w-8'/>
          <p className="text-gray-300 hover:text-white text-sm w-full">
            Manage Profiles
          </p>
        </div>

        {/* Divider */}
        <hr className="bg-gray-600 border-0 h-px my-1" />

        {/* Settings */}
        <div 
          onClick={handleSettings}
          className="px-3 group/item flex flex-row gap-3 items-center w-full hover:bg-gray-800"
        >
          <CiSettings className='text-white h-8 w-8'/>
          <p className="text-white text-sm">
            Settings
          </p>
        </div>

        {/* Divider */}
        <hr className="bg-gray-600 border-0 h-px my-1" />

        {/* Sign Out */}
        <div
          onClick={handleSignOut}
          className="px-3 text-center text-white text-sm hover:underline cursor-pointer"
        >
          Sign out of Notflix
        </div>
      </div>
    </div>
  );
};

export default AccountMenu;
