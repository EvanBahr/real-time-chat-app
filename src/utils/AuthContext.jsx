import { useContext, useState, useEffect, createContext } from "react";
import { account } from "../appwriteConfig";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

//
export const AuthProvider = ({ children }) => {
  const [Loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    getUserOnLoad();
  }, []);
  const handleUserLogin = async (e, Credentials) => {
    e.preventDefault();
    try {
      const response = await account.createEmailSession(
        Credentials.email,
        Credentials.password
      );
      console.log("logged", response);
      const accountDetail = account.get();
      setUser(accountDetail);
      navigate("/");
    } catch (error) {
      console.log("ERROR", error);
    }
  };
  const ContextData = {
    user,
    handleUserLogin,
  };

  const getUserOnLoad = async () => {
    try {
      const accountDetail = account.get();
      setUser(accountDetail);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
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
