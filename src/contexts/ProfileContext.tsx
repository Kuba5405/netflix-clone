import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface Profile {
  id: number;
  name: string;
  color: string;
}

interface ProfileContextType {
  profiles: Profile[];
  currentProfile: Profile | null;
  setCurrentProfile: (profile: Profile) => void;
  switchProfile: (profile: Profile) => void;
  loading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch profiles when user changes
  useEffect(() => {
    if (user) {
      fetchProfiles();
    } else {
      setProfiles([]);
      setCurrentProfile(null);
      localStorage.removeItem('currentProfile');
      setLoading(false);
    }
  }, [user]);

  const fetchProfiles = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at');

      if (error) throw error;

      if (data && data.length > 0) {
        setProfiles(data);
        
        // Try to restore saved profile
        const savedProfile = localStorage.getItem('currentProfile');
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          // Verify this profile still exists in database
          const profileExists = data.find(p => p.id === parsed.id);
          if (profileExists) {
            setCurrentProfile(profileExists);
          } else {
            // Saved profile doesn't exist anymore, clear it
            localStorage.removeItem('currentProfile');
          }
        }
      } else {
        // Create first default profile for new user
        await createDefaultProfile();
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultProfile = async () => {
    if (!user) return;

    const defaultProfile = {
      user_id: user.id,
      name: user.email?.split('@')[0] || 'User',
      color: 'bg-red-600',
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert([defaultProfile])
      .select();

    if (!error && data) {
      setProfiles(data);
    }
  };

  const switchProfile = (profile: Profile) => {
    setCurrentProfile(profile);
    localStorage.setItem('currentProfile', JSON.stringify(profile));
    navigate(`/browse/${profile.id}`);
  };

  return (
    <ProfileContext.Provider value={{ profiles, currentProfile, setCurrentProfile, switchProfile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
};
