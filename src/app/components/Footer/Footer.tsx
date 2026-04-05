import Logo from "../Logo";
import { Link } from "react-router";

function Footer() {
  return (
    <section className="relative overflow-hidden border-t border-stone-300 bg-stone-200/60 py-10 dark:border-stone-700 dark:bg-stone-900/70">
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="-m-6 flex flex-wrap">
          <div className="w-full p-6 md:w-1/2 lg:w-5/12">
            <div className="flex h-full flex-col justify-between">
              <div className="mb-4 inline-flex items-center">
                <Logo width="100px" />
              </div>
              <div>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  &copy; Copyright 2023. All Rights Reserved by DevUI.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-stone-500 dark:text-stone-400">
                Company
              </h3>
              <ul>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-stone-900 transition hover:text-emerald-600 dark:text-stone-200 dark:hover:text-emerald-400"
                    to="/"
                  >
                    Features
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-stone-900 transition hover:text-emerald-600 dark:text-stone-200 dark:hover:text-emerald-400"
                    to="/"
                  >
                    Pricing
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-stone-900 transition hover:text-emerald-600 dark:text-stone-200 dark:hover:text-emerald-400"
                    to="/"
                  >
                    Affiliate Program
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-base font-medium text-stone-900 transition hover:text-emerald-600 dark:text-stone-200 dark:hover:text-emerald-400"
                    to="/"
                  >
                    Press Kit
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-stone-500 dark:text-stone-400">
                Support
              </h3>
              <ul>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-stone-900 transition hover:text-emerald-600 dark:text-stone-200 dark:hover:text-emerald-400"
                    to="/"
                  >
                    Account
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-stone-900 transition hover:text-emerald-600 dark:text-stone-200 dark:hover:text-emerald-400"
                    to="/"
                  >
                    Help
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-stone-900 transition hover:text-emerald-600 dark:text-stone-200 dark:hover:text-emerald-400"
                    to="/"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-base font-medium text-stone-900 transition hover:text-emerald-600 dark:text-stone-200 dark:hover:text-emerald-400"
                    to="/"
                  >
                    Customer Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full p-6 md:w-1/2 lg:w-3/12">
            <div className="h-full">
              <h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-stone-500 dark:text-stone-400">
                Legals
              </h3>
              <ul>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-stone-900 transition hover:text-emerald-600 dark:text-stone-200 dark:hover:text-emerald-400"
                    to="/"
                  >
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-stone-900 transition hover:text-emerald-600 dark:text-stone-200 dark:hover:text-emerald-400"
                    to="/"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-base font-medium text-stone-900 transition hover:text-emerald-600 dark:text-stone-200 dark:hover:text-emerald-400"
                    to="/"
                  >
                    Licensing
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Footer;
