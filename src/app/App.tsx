import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { authService } from "../appwrite";
import { login, logout } from "./features/auth/authSlice";
import { THEME_STORAGE_KEY } from "./features/theme/themeSlice";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { Outlet } from "react-router";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", themeMode === "dark");
    globalThis.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [themeMode]);

  return loading ? (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <p className="text-base font-medium">Loading app...</p>
    </div>
  ) : (
    <div className="min-h-screen bg-stone-100 text-stone-900 transition-colors duration-300 dark:bg-stone-950 dark:text-stone-100">
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex-1 py-6 sm:py-10">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
