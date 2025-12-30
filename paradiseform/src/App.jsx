import LeadForm from "./components/LeadForm";
import "./index.css";

export default function App() {
  return (
    <>
      <header className="top-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* <img
            src="https://mantradevelopers.in/projects/mantra-balewadi/images/mantralogo.webp"
            alt="Paradise Group"
            style={{ height: "70px", width: "auto" }}
          /> */}
          <span style={{ fontSize: "16px", fontWeight: "600" }}>
            Paradise Group
          </span>
        </div>

      </header>

      <LeadForm />
    </>
  );
}
