import { useContext, useState, useEffect, createContext } from "react";
import { account } from "../appwriteConfig";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";
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
  const handleUserRegister = async (e, Credentials) => {
    e.preventDefault();
    if (Credentials.password1 !== Credentials.password2) {
      alert("password do not match!");
    }
    try {
      let response = await account.create(
        ID.unique(),
        Credentials.email,
        Credentials.password1,
        Credentials.name
      );
      console.log("REGISTERED", response);
      await account.createEmailSession(
        Credentials.email,
        Credentials.password1
      );
      const accountDetail = await account.get();
      console.log("accoun detail", accountDetail);
      setUser(accountDetail);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  const ContextData = {
    user,
    handleUserLogin,
    handleUserLogOut,
    handleUserRegister,
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
