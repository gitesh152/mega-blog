function Logo({ width = "100px" }) {
  return (
    <div
      style={{ width }}
      className="text-xl font-black uppercase tracking-[0.12em] text-stone-900 dark:text-stone-100"
    >
      MegaBlog
    </div>
  );
}

export default Logo;
