import { useState } from "react";
import "./LeadForm.css";

export default function LeadForm() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const projects = [
    "Sai Platinum (Kharghar)",
    "Sai World Dreams (Dombivli)",
    "Sai Sun City (Upper Kharghar)",
    "Paradise Mall (Kharghar)",
    "Sai World Legend (Kalyan NX)",
    "Sai World City (Panvel)",
    "Sai World Retreat (Lonavala)",
    "Sai World Empire (Kharghar)",
    "Sai Aaradhya (Kharghar)",
    "Sai Symphony (Kharghar)",
    "Sai Icon (Kharghar)"
  ];

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("Submitting...");

    const form = e.target;

    const data = {
      fullName: form.full_name.value,
      email: form.email.value,
      phone: form.country_code.value + form.phone.value,
      interest: form.project.value,
      bhkType: form.bhk.value,
      budget: form.budget.value,
    };

    try {
      const res = await fetch("http://localhost:5000/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        setMsg("Form submitted successfully ✅");
        form.reset();
      } else {
        setMsg(result.message || "Submission failed ❌");
      }
    } catch {
      setMsg("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero">
      <div className="form-wrapper">
        <div className="form-card">
          <h2>Register Your Interest</h2>

          <form onSubmit={submitHandler}>
            {/* NAME + EMAIL */}
            <div className="grid">
              <input
                name="full_name"
                placeholder="Full Name *"
                required
              />
              <input
                name="email"
                placeholder="Email"
                type="email"
              />
            </div>

            {/* PHONE */}
            <div className="phone-row">
              <input
                name="country_code"
                value="+91"
                readOnly
                className="country-code"
              />
              <input
                name="phone"
                placeholder="Phone Number *"
                required
                pattern="[0-9]{10}"
                maxLength={10}
                className="phone-input"
              />
            </div>

            {/* PROJECT */}
            <select name="project" required>
              <option value="">Select Project *</option>
              {projects.map((p, i) => (
                <option key={i} value={p}>{p}</option>
              ))}
            </select>

            {/* BHK */}
            <select name="bhk" required>
              <option value="">Interested In *</option>
              <option value="1 BHK">1 BHK</option>
              <option value="2 BHK">2 BHK</option>
              <option value="3 BHK">3 BHK</option>
              <option value="4 BHK">4 BHK</option>
            </select>

            {/* BUDGET */}
            <select name="budget" required>
              <option value="">Budget *</option>
              <option value="₹50L – ₹75L">₹50L – ₹75L</option>
              <option value="₹75L – ₹1Cr">₹75L – ₹1Cr</option>
              <option value="₹1Cr+">₹1Cr+</option>
              <option value="Not Decided">Not Decided</option>
            </select>

            <button className="submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>

            {msg && <p className="msg">{msg}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
