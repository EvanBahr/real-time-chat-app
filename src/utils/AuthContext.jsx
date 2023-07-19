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
      const accountDetail = await account.get();
      setUser(accountDetail);
      navigate("/");
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const handleUserLogOut = async () => {
    await account.deleteSession("current");
    setUser(null);
  };

  const getUserOnLoad = async () => {
    try {
      const accountDetail = await account.get();
      console.log("accoun detail", accountDetail);

      setUser(accountDetail);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  const ContextData = {
    user,
    handleUserLogin,
    handleUserLogOut,
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
