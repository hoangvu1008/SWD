import { useContext, createContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    // signInWithPopup(auth, provider);
    signInWithRedirect(auth, provider)
  };

  const logOut = () => {
    signOut(auth)
  }

  useEffect(async () => {
    try {
      const unsubscribe = await onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

  const userEmailIsValid = user && user.email && user.email.endsWith('@fpt.edu.vn');

  if (loading) {
    return <p>Đang đăng nhập...</p>;
  }

  if (!userEmailIsValid) {
    alert('Vui lòng đăng nhập bằng email FPT');
    return (
      <AuthContext.Provider value={{ googleSignIn }}>
        {children}
      </AuthContext.Provider>
    );
  }
  return (
    <AuthContext.Provider value={{ user, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};


export const UserAuth = () => {
  return useContext(AuthContext);
};
