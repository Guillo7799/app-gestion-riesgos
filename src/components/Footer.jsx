export default function Footer() {
  return (
    <footer style={{
      position: "fixed",
      left: 0,
      bottom: 0,
      width: "100vw",
      background: "#111",
      color: "#FFD600",
      textAlign: "center",
      padding: "1rem 0",
      fontSize: "1.2rem",
      fontWeight: "bold",
      letterSpacing: "1px",
      zIndex: 1000,
      fontFamily: "Roboto, Arial, sans-serif"
    }}>
      Developed By: <a href="https://github.com/Guillo7799" target="_blank" rel="noopener noreferrer" style={{ color: "#FFD600", textDecoration: "none", fontWeight: "bold" }}>GalesDv</a>
    </footer>
  );
}
