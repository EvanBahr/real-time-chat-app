import { useContext, useState, useEffect, createContext } from "react";
const AuthContext = createContext();

//
export const AuthProvider = ({ children }) => {
  const [Loading, setLoading] = useState(false);
  const [user, setUser] = useState(true);
  const ContextData = {
    user,
  };
  useEffect(() => {
    setLoading(false);
  });

  return (
    <AuthContext.Provider value={ContextData}>
      {Loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  return useContext(AuthContext);
};
export default AuthContext;
