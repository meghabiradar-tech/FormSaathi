import { useState } from "react";

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
      style={{
        minHeight: "100vh",
background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)",
fontFamily: "Arial, sans-serif",
padding: "50px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "850px",
margin: "0 auto",
background: "white",
padding: "45px",
borderRadius: "24px",
boxShadow: "0 20px 50px rgba(15, 23, 42, 0.10)",
border: "1px solid #e5e7eb",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
fontWeight: "800",
marginBottom: "8px",
color: "#111827",
letterSpacing: "-1px",
          }}
        >
          FormSaathi
        </h1>

        <p
          style={{
            fontSize: "17px",
lineHeight: "1.6",
color: "#6b7280",
marginBottom: "32px",
          }}
        >
          Your intelligent assistant for understanding and filling forms.
        </p>
        <div
  style={{
    display: "inline-block",
    padding: "6px 12px",
    marginBottom: "24px",
    background: "#eff6ff",
    color: "#2563eb",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "600",
  }}
>
  ✨ AI-Powered Form Assistant
</div>

        <label
          style={{
            display: "block",
            fontSize: "16px",
            fontWeight: "bold",
            marginBottom: "10px",
            color: "#374151",
          }}
        >
          Enter your form question
        </label>
        
        <textarea
          value={formText}
          onChange={(e) => setFormText(e.target.value)}
          placeholder="Example: What does annual family income mean?"
          rows="6"
          style={{
  width: "100%",
  boxSizing: "border-box",
  padding: "18px",
  fontSize: "16px",
  lineHeight: "1.6",
  border: "2px solid #e5e7eb",
  borderRadius: "14px",
  resize: "vertical",
  outline: "none",
  background: "#f9fafb",
  color: "#111827",
  transition: "border-color 0.2s, box-shadow 0.2s",
}}
        />
        <p
  style={{
    marginTop: "8px",
    marginBottom: "0",
    fontSize: "13px",
    color: "#9ca3af",
  }}
>
  💡 Try questions about documents, income, dates, addresses, or Yes/No fields.
</p>

        <button
          onClick={handleAnalyze}
          style={{
            marginTop: "20px",
width: "100%",
padding: "15px",
fontSize: "16px",
fontWeight: "700",
color: "white",
background: "#2563eb",
border: "none",
borderRadius: "12px",
cursor: loading ? "not-allowed" : "pointer",
opacity: loading ? 0.75 : 1,
boxShadow: "0 8px 20px rgba(37, 99, 235, 0.20)",
transition: "all 0.2s ease",
          }}
        >
          {loading ? "Analyzing..." : "Analyze Form"}
        </button>
        
        {result && (
          <div
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