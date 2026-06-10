import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getRandomProfileImage } from '../lib/randomImages';

const STORAGE_KEY = 'mini_sns_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser]);

  async function login(username, password) {
    const { data, error } = await supabase
      .from('sns_users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .maybeSingle();

    if (error || !data) {
      return { success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' };
    }
    setCurrentUser(data);
    return { success: true };
  }

  async function signup(username, password, nickname) {
    const { data: existing } = await supabase
      .from('sns_users')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (existing) {
      return { success: false, message: '이미 사용 중인 아이디입니다.' };
    }

    const { data, error } = await supabase
      .from('sns_users')
      .insert({
        username,
        password,
        nickname,
        profile_image_url: getRandomProfileImage(),
      })
      .select()
      .single();

    if (error || !data) {
      return { success: false, message: '회원가입에 실패했습니다. 다시 시도해주세요.' };
    }
    setCurrentUser(data);
    return { success: true };
  }

  function logout() {
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
