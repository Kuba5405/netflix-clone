import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { PROFILE_COLORS, MIN_NAME_LENGTH, MAX_NAME_LENGTH } from '../constants/profileColors';

function AddProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams(); // If editing, id will be present
  const { profiles, addProfile, updateProfile } = useProfile();
  
  const isEditing = !!id;
  const existingProfile = profiles.find(p => p.id === parseInt(id || ''));

  const [name, setName] = useState(existingProfile?.name || '');
  const [selectedColor, setSelectedColor] = useState(existingProfile?.color || 'bg-red-600');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && !existingProfile) {
      // Profile not found, redirect back
      navigate('/');
    }
  }, [isEditing, existingProfile, navigate]);

  const validateName = (name: string): string | null => {
    const trimmedName = name.trim();
    
    if (trimmedName.length < MIN_NAME_LENGTH) {
      return `Name must be at least ${MIN_NAME_LENGTH} characters`;
    }
    
    if (trimmedName.length > MAX_NAME_LENGTH) {
      return `Name must be less than ${MAX_NAME_LENGTH} characters`;
    }
    
    return null;
  };

  const handleSave = async () => {
    setError('');
    
    const validationError = validateName(name);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      if (isEditing && existingProfile) {
        await updateProfile(existingProfile.id, name, selectedColor);
      } else {
        await addProfile(name, selectedColor);
      }
      navigate('/');
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-2xl px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl text-white font-semibold mb-4">
            {isEditing ? 'Edit Profile' : 'Add Profile'}
          </h1>
          <p className="text-gray-400 text-lg">
            {isEditing ? 'Change your profile settings' : 'Create a new profile'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-zinc-900 rounded-lg p-8 border border-gray-800">
          {/* Name Input */}
          <div className="mb-8">
            <label className="block text-white text-sm font-medium mb-3">
              Profile Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter profile name"
              maxLength={MAX_NAME_LENGTH}
              className="w-full px-4 py-3 bg-zinc-800 text-white border border-gray-700 rounded-md focus:outline-none focus:border-white transition"
              autoFocus
            />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">
                {MIN_NAME_LENGTH}-{MAX_NAME_LENGTH} characters
              </span>
              <span className="text-xs text-gray-500">
                {name.length}/{MAX_NAME_LENGTH}
              </span>
            </div>
          </div>

          {/* Color Picker */}
          <div className="mb-8">
            <label className="block text-white text-sm font-medium mb-4">
              Choose Color
            </label>
            <div className="grid grid-cols-5 gap-4">
              {PROFILE_COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.class)}
                  className={`
                    w-full aspect-square rounded-lg transition-all
                    ${color.class}
                    ${selectedColor === color.class 
                      ? 'ring-4 ring-white scale-110' 
                      : 'hover:scale-105 opacity-70 hover:opacity-100'
                    }
                  `}
                  title={color.name}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Selected: {PROFILE_COLORS.find(c => c.class === selectedColor)?.name}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-600 bg-opacity-20 border border-red-600 rounded-md">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 py-3 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Profile'}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 py-3 bg-transparent text-white border border-gray-600 font-semibold rounded-md hover:bg-gray-800 transition disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProfilePage;
