import { useState } from "react";
import "./index.css";

function App() {
  const [formText, setFormText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  
  const handleAnalyze = () => {
  if (!formText.trim()) {
    setResult("Please enter a form question first.");
    return;
  }

  setLoading(true);


  setTimeout(() => {
    const question = formText.trim();
    const lowerQuestion = question.toLowerCase();

    let explanation = "";

    if (
      lowerQuestion.startsWith("do you") ||
      lowerQuestion.startsWith("are you") ||
      lowerQuestion.startsWith("is your") ||
      lowerQuestion.startsWith("have you") ||
      lowerQuestion.startsWith("has your") ||
      lowerQuestion.startsWith("can you")
    ) {
      explanation =
        `"${question}" is a Yes/No question. Select "Yes" or "No" based on your situation.`;
    } else if (
      lowerQuestion.includes("date of birth") ||
      lowerQuestion.includes("dob")
    ) {
      explanation =
        "Date of birth means the day, month, and year when you were born. Enter it exactly as shown on your official document.";
    } else if (
      lowerQuestion.includes("income") ||
      lowerQuestion.includes("salary")
    ) {
      explanation =
        "This question is asking about the amount of money you or your family earn. Enter the amount requested by the form, usually for the specified period.";
    } else if (
      lowerQuestion.includes("pan card") ||
      lowerQuestion.includes("pan number")
    ) {
      explanation =
        "This question is asking for your PAN number. Enter the 10-character PAN exactly as it appears on your PAN card.";
        } else if (
      lowerQuestion.includes("phone") ||
      lowerQuestion.includes("mobile number") ||
      lowerQuestion.includes("contact number")
    ) {
      explanation =
        "This question is asking for your phone or mobile number. Enter the number you currently use and make sure it is entered correctly.";
        } else if (
      lowerQuestion.includes("email") ||
      lowerQuestion.includes("email address")
    ) {
      explanation =
        "This question is asking for your email address. Enter an email address that you currently use and make sure it is spelled correctly.";
        } else if (
      lowerQuestion.includes("full name") ||
      lowerQuestion.includes("your name") ||
      lowerQuestion.includes("first name") ||
      lowerQuestion.includes("last name")
    ) {
      explanation =
        "This question is asking for your name. Enter your full name exactly as it appears on your official documents, if required.";  
        } else if (
      lowerQuestion.startsWith("how many") ||
      lowerQuestion.includes("number of") ||
      lowerQuestion.includes("quantity")
    ) {
      explanation =
        "This question is asking for a number or quantity. Enter the exact number requested by the form.";  
        } else if (
      lowerQuestion.includes("address") ||
      lowerQuestion.includes("residential address") ||
      lowerQuestion.includes("permanent address")
    ) {
      explanation =
        "This question is asking for your address. Enter your complete current or permanent address as requested by the form.";  
      } else if (
      lowerQuestion.includes("aadhaar") ||
      lowerQuestion.includes("aadhar")
    ) {
      explanation =
        "This question is asking for your Aadhaar number. Enter the 12-digit number exactly as shown on your Aadhaar document.";
    } else if (lowerQuestion.startsWith("what")) {
      explanation =
        `"${question}" is asking you to provide specific information requested by the form.`;
    } else if (lowerQuestion.startsWith("where")) {
      explanation =
        `"${question}" is asking you to provide a location or place related to the information requested.`;
    } else if (lowerQuestion.startsWith("when")) {
      explanation =
        `"${question}" is asking you to provide a date or time related to the information requested.`;
    } else {
      explanation =
        `FormSaathi explanation: "${question}" means the form is asking you to provide information related to this question.`;
    }

    setResult(explanation);
    setLoading(false);
  }, 800);
};

  return (
    <div
      className="formsaathi-page">
      <div
        className="formsaathi-card">
        <h1
          className="formsaathi-title">
          FormSaathi
        </h1>

        <p
          className="formsaathi-tagline">
          Your intelligent assistant for understanding and filling forms.
        </p>
        <div
        className="ai-badge">
  ✨ AI-Powered Form Assistant
</div>

        <label
          className="question-label">
          Enter your form question
        </label>
        
        <textarea
          className="question-input"
          value={formText}
          onChange={(e) => setFormText(e.target.value)}
          placeholder="Example: What does annual family income mean?"
          rows="6"
          
        />
        <p
        className="input-hint"
  
>
  💡 Try questions about documents, income, dates, addresses, or Yes/No fields.
</p>

        <button
          className="analyze-button"
          onClick={handleAnalyze}
          
        >
          {loading ? "Analyzing..." : "Analyze Form"}
        </button>
        
        {result && (
          <div
            className="result-card"
            style={{
             marginTop: "30px",
padding: "22px",
background: "#eff6ff",
border: "1px solid #93c5fd",
borderRadius: "14px",
color: "#1e3a8a",
fontSize: "16px",
lineHeight: "1.6",
boxShadow: "0 4px 12px rgba(30, 58, 138, 0.06)",
            }}
          >
            <h3
            className="result-heading"
  style={{
    margin: "0 0 10px 0",
    fontSize: "18px",
    fontWeight: "700",
    color: "#1e3a8a",
  }}
>
  FormSaathi Explanation
</h3>

            {result}
          </div>
        )}
                 <div
                 className="how-it-works"
          style={{
            marginTop: "40px",
            padding: "24px",
            background: "#f9fafb",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3
            style={{
              margin: "0 0 20px 0",
              fontSize: "20px",
              color: "#111827",
            }}
          >
            How FormSaathi Works
          </h3>

          <div
            className="steps-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "16px",
            }}
          >
            <div>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>📝</div>
              <strong>1. Enter</strong>
              <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "1.5" }}>
                Enter a confusing form question.
              </p>
            </div>

            <div>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>🤖</div>
              <strong>2. Analyze</strong>
              <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "1.5" }}>
                FormSaathi identifies what the question means.
              </p>
            </div>

            <div>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>💡</div>
              <strong>3. Understand</strong>
              <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "1.5" }}>
                Get simple guidance on what to enter.
              </p>
            </div>
          </div>
        </div>
         <div
          className="formsaathi-footer"
          style={{
            marginTop: "35px",
            paddingTop: "20px",
            borderTop: "1px solid #e5e7eb",
            textAlign: "center",
            fontSize: "13px",
            color: "#9ca3af",
          }}
        >
          FormSaathi • Making forms easier for everyone
        </div>
      </div>
    </div>
  );
}

export default App;