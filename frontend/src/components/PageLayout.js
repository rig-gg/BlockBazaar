import Navbar from "./Navbar";

export default function PageLayout({ children, className = "bb-container animate-fade-up", style }) {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <main className={className} style={style}>
        {children}
      </main>
    </div>
  );
}
