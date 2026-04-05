import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAppSelector } from "../../hooks";
import Container from "../Container/Container";
import Logo from "../Logo";
import Logout from "./Logout";
import ThemeToggle from "./ThemeToggle";

function Header() {
  const authStatus = useAppSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = useMemo(
    () => [
      {
        name: "Home",
        slug: "/",
        active: true,
      },
      {
        name: "Login",
        slug: "/login",
        active: !authStatus,
      },
      {
        name: "Signup",
        slug: "/signup",
        active: !authStatus,
      },
      {
        name: "My Posts",
        slug: "/all-posts",
        active: authStatus,
      },
      {
        name: "Add Post",
        slug: "/add-post",
        active: authStatus,
      },
    ],
    [authStatus],
  );

  const navItemClasses =
    "rounded-full px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-200 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-700 dark:hover:text-stone-100";

  const onNavigate = (slug: string) => {
    setIsMenuOpen(false);
    navigate(slug);
  };

  return (
    <header className="border-b border-stone-300/70 bg-stone-200/80 py-3 shadow-sm backdrop-blur dark:border-stone-700 dark:bg-stone-900/80">
      <Container>
        <nav className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <Logo width="110px" />
          </Link>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle compact />
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="rounded-full border border-stone-300 bg-stone-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-stone-700 transition hover:bg-stone-200 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
            >
              Menu
            </button>
          </div>

          <ul className="hidden items-center gap-2 md:flex">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    className={navItemClasses}
                    onClick={() => onNavigate(item.slug)}
                  >
                    {item.name}
                  </button>
                </li>
              ) : null,
            )}

            {authStatus && (
              <li>
                <Logout />
              </li>
            )}

            <li>
              <ThemeToggle />
            </li>
          </ul>

          {isMenuOpen && (
            <ul className="flex w-full flex-col gap-2 border-t border-stone-300 pt-3 md:hidden dark:border-stone-700">
              {navItems.map((item) =>
                item.active ? (
                  <li key={item.name}>
                    <button
                      className={`${navItemClasses} w-full text-left`}
                      onClick={() => onNavigate(item.slug)}
                    >
                      {item.name}
                    </button>
                  </li>
                ) : null,
              )}

              {authStatus && (
                <li>
                  <Logout />
                </li>
              )}
            </ul>
          )}
        </nav>
      </Container>
    </header>
  );
}

export default Header;
