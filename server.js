import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("FormSaathi Backend is running!");
});

app.post("/api/analyze-form", async (req, res) => {
  try {
    const { formText } = req.body;

    if (!formText || !formText.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a form question.",
      });
    }

    const question = formText.trim();

    // Basic FormSaathi explanation logic
    let explanation = "";

    if (question.toLowerCase().includes("annual family income")) {
      explanation =
        "Annual family income means the total amount of money earned by all members of your family during one year. This can include salaries, wages, business income, pensions, or other regular sources of income. Enter the total yearly income of your family as requested by the form.";
    } else if (question.toLowerCase().includes("income")) {
      explanation =
        "Income means the money you or your family receives from sources such as salary, wages, business, pension, or other earnings. Read the form carefully to see whether it asks for monthly or yearly income.";
    } else if (question.toLowerCase().includes("address")) {
      explanation =
        "Enter your current residential address, including your house or flat number, street, area, city, state, and PIN code if the form asks for these details.";
    } else if (
      question.toLowerCase().includes("date of birth") ||
      question.toLowerCase().includes("dob")
    ) {
      explanation =
        "Date of birth means the date on which you were born. Enter it exactly in the format requested by the form, such as DD/MM/YYYY.";
    } else if (
      question.toLowerCase().includes("yes") &&
      question.toLowerCase().includes("no")
    ) {
      explanation =
        "This is a Yes/No question. Choose Yes if the statement applies to you and choose No if it does not apply to you. Do not guess—select the option that accurately describes your situation.";
    } else if (question.toLowerCase().includes("document")) {
      explanation =
        "The form is asking for information about a document. Check the exact document name and provide the document number or details requested. Make sure the information matches your official document.";
    } else {
      explanation =
        "This form question is asking you to provide information relevant to the situation described. Read the question carefully and enter accurate information from your official documents or personal records. If you are unsure, check the instructions provided with the form.";
    }

    return res.json({
      success: true,
      explanation: explanation,
    });
  } catch (error) {
    console.error("Analyze form error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while analyzing the form.",
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
