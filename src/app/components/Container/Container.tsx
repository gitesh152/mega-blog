import type { ReactNode } from "react";

function Container({ children }: { readonly children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}

export default Container;
