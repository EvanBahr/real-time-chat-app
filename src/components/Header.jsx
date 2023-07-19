import { LogIn, LogOut } from "react-feather";
import { useAuth } from "../utils/AuthContext";
function Header() {
  const { user, handleUserLogOut } = useAuth();
  return (
    <div id="header--wrapper">
      {user ? (
        <>
          welcome {user.name} ^_^
          <LogOut className="header--link" onClick={handleUserLogOut} />
        </>
      ) : (
        <LogIn className="header--link" />
      )}
    </div>
  );
}

export default Header;
