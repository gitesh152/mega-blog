import { useAppDispatch } from "../../hooks";
import { authService, storageService } from "../../../appwrite";
import { logout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router";

function Logout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService
      .logout()
      .then(() => {
        // Clear JWT and blob URL caches on logout to free memory and ensure fresh auth
        storageService.clearJWTCache();
        storageService.clearBlobUrlCache();
        dispatch(logout());
        navigate("/");
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <button
      onClick={handleLogout}
      className="inline-block rounded-full border border-stone-300 bg-stone-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-stone-700 transition hover:bg-stone-200 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
    >
      Logout
    </button>
  );
}

export default Logout;
