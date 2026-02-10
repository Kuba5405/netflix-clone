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
  addProfile: (name: string, color: string) => Promise<void>;
  updateProfile: (id: number, name: string, color: string) => Promise<void>;
  deleteProfile: (id: number) => Promise<void>;
  refreshProfiles: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    
    if (user) {
      fetchProfiles();
    } else {
      setProfiles([]);
      setCurrentProfile(null);
      localStorage.removeItem('currentProfile');
      setLoading(false);
    }
  }, [user, authLoading]);

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
        
        // Try to restore saved profile from localStorage
        const savedProfileStr = localStorage.getItem('currentProfile');
        let profileToSet = null;
        
        if (savedProfileStr) {
          try {
            const savedProfile = JSON.parse(savedProfileStr);
            // Find the profile by ID (important: match by id, not entire object)
            profileToSet = data.find(p => p.id === savedProfile.id);
          } catch (e) {
            console.error('Error parsing saved profile:', e);
            localStorage.removeItem('currentProfile');
          }
        }
        
        // If no saved profile found or it doesn't exist anymore, use first profile
        if (!profileToSet) {
          profileToSet = data[0];
        }
        
        // Set the profile and save to localStorage
        setCurrentProfile(profileToSet);
        localStorage.setItem('currentProfile', JSON.stringify(profileToSet));
        
      } else {
        // No profiles exist, create default one
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

    if (!error && data && data.length > 0) {
      setProfiles(data);
      setCurrentProfile(data[0]);
      localStorage.setItem('currentProfile', JSON.stringify(data[0]));
    }
  };

  const switchProfile = (profile: Profile) => {
    setCurrentProfile(profile);
    localStorage.setItem('currentProfile', JSON.stringify(profile));
    navigate(`/browse/${profile.id}`);
  };

  // Add profile
  const addProfile = async (name: string, color: string) => {
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('profiles')
      .insert([{
        user_id: user.id,
        name: name.trim(),
        color: color,
      }])
      .select()
      .single();

    if (error) throw error;
    await refreshProfiles();
  };

  // Update profile
  const updateProfile = async (id: number, name: string, color: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({
        name: name.trim(),
        color: color,
      })
      .eq('id', id);

    if (error) throw error;

    // Update currentProfile if it's the one being edited
    if (currentProfile?.id === id) {
      const updatedProfile = { ...currentProfile, name: name.trim(), color };
      setCurrentProfile(updatedProfile);
      localStorage.setItem('currentProfile', JSON.stringify(updatedProfile));
    }

    await refreshProfiles();
  };

  // Delete profile
  const deleteProfile = async (id: number) => {
    // If deleting current profile, switch to first remaining profile
    if (currentProfile?.id === id) {
      const remainingProfiles = profiles.filter(p => p.id !== id);
      if (remainingProfiles.length > 0) {
        setCurrentProfile(remainingProfiles[0]);
        localStorage.setItem('currentProfile', JSON.stringify(remainingProfiles[0]));
      } else {
        setCurrentProfile(null);
        localStorage.removeItem('currentProfile');
      }
    }

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await refreshProfiles();
  };

  // Refresh profiles
  const refreshProfiles = async () => {
    await fetchProfiles();
  };

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        currentProfile,
        setCurrentProfile,
        switchProfile,
        loading,
        addProfile,
        updateProfile,
        deleteProfile,
        refreshProfiles,
      }}
    >
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
