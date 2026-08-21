require("dotenv").config();

const ai = require("./services/gemini");
const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// =====================================================
// FILE UPLOAD CONFIGURATION
// =====================================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, JPG, PNG, and WEBP files are supported."));
    }
  },
});

// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.send("FormSaathi Backend is running!");
});

// =====================================================
// COMMON FIELD CLEANING FUNCTION
// =====================================================

function cleanFields(fields) {
  const allowedTypes = [
    "text",
    "date",
    "number",
    "email",
    "phone",
    "textarea",
    "select",
  ];

  return fields
    .filter((field) => field && typeof field === "object")
    .map((field, index) => {
      const cleanedField = {
        id:
          typeof field.id === "string" && field.id.trim()
            ? field.id.trim()
            : `field${index + 1}`,

        originalQuestion:
          typeof field.originalQuestion === "string"
            ? field.originalQuestion.trim()
            : "",

        simpleQuestion:
          typeof field.simpleQuestion === "string"
            ? field.simpleQuestion.trim()
            : "",

        explanation:
          typeof field.explanation === "string" ? field.explanation.trim() : "",

        type: allowedTypes.includes(field.type) ? field.type : "text",

        required: field.required === true,
      };

      // Only select fields should have options
      if (cleanedField.type === "select" && Array.isArray(field.options)) {
        cleanedField.options = field.options.filter(
          (option) => typeof option === "string",
        );
      }

      return cleanedField;
    });
}

// =====================================================
// COMMON AI PROMPT
// =====================================================

function getFormAnalysisPrompt() {
  return `
You are FormSaathi, an AI-powered accessible form-filling assistant.

Analyze the form carefully and identify EVERY field that the user needs to fill.

For every field, return:

- id: a short unique camelCase identifier
- originalQuestion: the exact question or field label from the form
- simpleQuestion: the question rewritten in simple, easy-to-understand English
- explanation: a short explanation of what the user should enter
- type: exactly one of:
  "text", "date", "number", "email", "phone", "textarea", "select"
- required: true if the form clearly indicates the field is required or mandatory, otherwise false
- options: only for select fields

IMPORTANT RULES:

1. Do not skip any field.
2. Preserve the original field order.
3. Keep originalQuestion faithful to the form.
4. Do not invent information.
5. Keep simpleQuestion easy to understand.
6. Keep explanations short and clear.
7. Detect required fields when indicated.
8. If required status is not indicated, use false.
9. Detect dropdowns, radio buttons, checkboxes representing one choice, and fixed-choice fields as "select" when appropriate.
10. Include all explicitly provided select options.
11. Never invent select options.
12. For select fields, include:
    "options": ["Option 1", "Option 2"]
13. For non-select fields, DO NOT include an options property.
14. Use "textarea" for long answers, addresses, descriptions, comments, and similar long text.
15. Use "date" for dates.
16. Use "number" for numeric values.
17. Use "email" for email addresses.
18. Use "phone" for phone numbers.
19. Use "text" for normal short text.
20. Each field id must be unique.
21. Return ONLY valid JSON.
22. Do not use markdown.
23. Do not add explanations outside the JSON.

Return exactly this structure:

{
  "fields": [
    {
      "id": "fullName",
      "originalQuestion": "Name of Applicant",
      "simpleQuestion": "What is your full name?",
      "explanation": "Enter your complete name as shown on your official document.",
      "type": "text",
      "required": true
    },
    {
      "id": "gender",
      "originalQuestion": "Gender: Male / Female / Other",
      "simpleQuestion": "What is your gender?",
      "explanation": "Select your gender.",
      "type": "select",
      "required": false,
      "options": ["Male", "Female", "Other"]
    }
  ]
}
`;
}

// =====================================================
// STEP 13 - FORM ANALYSIS API
// =====================================================

app.post("/api/analyze-form", async (req, res) => {
  let { formText } = req.body;

  // ---------------------------------------------------
  // Validate input
  // ---------------------------------------------------

  if (!formText || typeof formText !== "string") {
    return res.status(400).json({
      success: false,
      message: "Please provide form text",
    });
  }

  formText = formText.trim();

  if (formText.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Form text cannot be empty",
    });
  }

  const MAX_FORM_LENGTH = 50000;

  if (formText.length > MAX_FORM_LENGTH) {
    return res.status(400).json({
      success: false,
      message:
        "Form is too large. Please provide a shorter form or process it in smaller sections.",
    });
  }

  // ---------------------------------------------------
  // Send form to Gemini
  // ---------------------------------------------------

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",

      config: {
        responseMimeType: "application/json",
      },

      contents: `
${getFormAnalysisPrompt()}

FORM TEXT:

${formText}
`,
    });

    const responseText = response.text;

    // ---------------------------------------------------
    // Check Gemini response
    // ---------------------------------------------------

    if (!responseText) {
      console.error("Gemini returned an empty response.");

      return res.status(500).json({
        success: false,
        message: "Gemini returned an empty response",
      });
    }

    // ---------------------------------------------------
    // Parse JSON
    // ---------------------------------------------------

    let result;

    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Gemini response:", responseText);

      return res.status(500).json({
        success: false,
        message: "Gemini returned invalid JSON",
      });
    }

    // ---------------------------------------------------
    // Validate overall structure
    // ---------------------------------------------------

    if (!result || !Array.isArray(result.fields)) {
      console.error("Invalid Gemini form structure:", result);

      return res.status(500).json({
        success: false,
        message: "Gemini returned an invalid form structure",
      });
    }

    // ---------------------------------------------------
    // Clean fields
    // ---------------------------------------------------

    const cleanedFields = cleanFields(result.fields);

    if (cleanedFields.length === 0) {
      return res.status(500).json({
        success: false,
        message: "No form fields were detected",
      });
    }

    // ---------------------------------------------------
    // Send successful response
    // ---------------------------------------------------

    return res.json({
      success: true,
      fields: cleanedFields,
    });
  } catch (error) {
    console.error("Gemini error:", error);

    if (error.status === 503) {
      return res.status(503).json({
        success: false,
        message: "Gemini is temporarily busy. Please try again in a moment.",
      });
    }

    if (error.status === 401 || error.status === 403) {
      return res.status(500).json({
        success: false,
        message: "Gemini authentication failed. Please check your API key.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to analyze form",
    });
  }
});

// =====================================================
// STEP 15 - PDF / IMAGE UPLOAD + AI FORM ANALYSIS
// =====================================================

app.post("/api/analyze-upload", upload.single("form"), async (req, res) => {
  // ---------------------------------------------------
  // Check file
  // ---------------------------------------------------

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please upload a PDF, JPG, PNG, or WEBP form.",
    });
  }

  try {
    console.log(`Analyzing uploaded file: ${req.file.originalname}`);

    const base64Data = req.file.buffer.toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",

      config: {
        responseMimeType: "application/json",
      },

      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
${getFormAnalysisPrompt()}

The uploaded file is the form that you must analyze.

Read the document/image carefully.

Identify all fields visible in the uploaded form.
Preserve their order.
Do not invent fields that are not visible.
`,
            },

            {
              inlineData: {
                mimeType: req.file.mimetype,
                data: base64Data,
              },
            },
          ],
        },
      ],
    });

    const responseText = response.text;

    // ---------------------------------------------------
    // Check Gemini response
    // ---------------------------------------------------

    if (!responseText) {
      console.error("Gemini returned an empty upload response.");

      return res.status(500).json({
        success: false,
        message: "Gemini returned an empty response",
      });
    }

    // ---------------------------------------------------
    // Parse JSON
    // ---------------------------------------------------

    let result;

    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Upload JSON parsing error:", parseError);

      console.error("Gemini response:", responseText);

      return res.status(500).json({
        success: false,
        message: "Gemini returned invalid JSON",
      });
    }

    // ---------------------------------------------------
    // Validate structure
    // ---------------------------------------------------

    if (!result || !Array.isArray(result.fields)) {
      return res.status(500).json({
        success: false,
        message: "Gemini returned an invalid form structure",
      });
    }

    const cleanedFields = cleanFields(result.fields);

    if (cleanedFields.length === 0) {
      return res.status(500).json({
        success: false,
        message: "No form fields were detected",
      });
    }

    // ---------------------------------------------------
    // Successful response
    // ---------------------------------------------------

    return res.json({
      success: true,
      filename: req.file.originalname,
      fileType: req.file.mimetype,
      fields: cleanedFields,
    });
  } catch (error) {
    console.error("Uploaded form analysis error:", error);

    if (error.status === 503) {
      return res.status(503).json({
        success: false,
        message: "Gemini is temporarily busy. Please try again in a moment.",
      });
    }

    if (error.status === 401 || error.status === 403) {
      return res.status(500).json({
        success: false,
        message: "Gemini authentication failed. Please check your API key.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to analyze uploaded form",
    });
  }
});

// =====================================================
// STEP 14 - ANSWER PROCESSING API
// =====================================================

app.post("/api/process-answers", async (req, res) => {
  const { fields, answers } = req.body;

  // ---------------------------------------------------
  // Validate fields
  // ---------------------------------------------------

  if (!Array.isArray(fields)) {
    return res.status(400).json({
      success: false,
      message: "Please provide form fields",
    });
  }

  if (fields.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Form fields cannot be empty",
    });
  }

  // ---------------------------------------------------
  // Validate answers
  // ---------------------------------------------------

  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return res.status(400).json({
      success: false,
      message: "Please provide user answers",
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",

      config: {
        responseMimeType: "application/json",
      },

      contents: `
You are FormSaathi, an accessible form-filling assistant.

You are given:

1. The fields detected from a form.
2. The answers provided by the user.

Your job is to validate and organize the answers.

RULES:

1. Match each answer with the correct field using the field id.
2. Do not invent missing answers.
3. Do not change the user's answer unnecessarily.
4. Identify required fields that have no answer.
5. Identify fields where the answer may be invalid for its type.
6. For select fields, check that the answer matches one of the provided options.
7. For email fields, check whether the answer looks like a valid email address.
8. For phone fields, check whether the answer looks like a valid phone number.
9. For number fields, check whether the answer is numeric.
10. For date fields, check whether the answer looks like a valid date.
11. Keep validation messages short and easy to understand.
12. If an answer is valid, mark it as valid.
13. Do not invent values for missing fields.
14. Return ONLY valid JSON.
15. Do not use markdown.

Return exactly this structure:

{
  "valid": true,
  "answers": [
    {
      "fieldId": "fullName",
      "answer": "Aishwarya R",
      "valid": true,
      "message": ""
    }
  ],
  "missingFields": [],
  "errors": []
}

FIELDS:

${JSON.stringify(fields)}

USER ANSWERS:

${JSON.stringify(answers)}
`,
    });

    const responseText = response.text;

    // ---------------------------------------------------
    // Check Gemini response
    // ---------------------------------------------------

    if (!responseText) {
      console.error("Gemini returned an empty answer response.");

      return res.status(500).json({
        success: false,
        message: "Gemini returned an empty response",
      });
    }

    // ---------------------------------------------------
    // Parse JSON
    // ---------------------------------------------------

    let result;

    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Answer JSON parsing error:", parseError);

      console.error("Gemini response:", responseText);

      return res.status(500).json({
        success: false,
        message: "Gemini returned invalid answer data",
      });
    }

    // ---------------------------------------------------
    // Validate answer result
    // ---------------------------------------------------

    if (!result || typeof result !== "object") {
      return res.status(500).json({
        success: false,
        message: "Gemini returned an invalid answer structure",
      });
    }

    if (!Array.isArray(result.answers)) {
      result.answers = [];
    }

    if (!Array.isArray(result.missingFields)) {
      result.missingFields = [];
    }

    if (!Array.isArray(result.errors)) {
      result.errors = [];
    }

    // ---------------------------------------------------
    // Send response
    // ---------------------------------------------------

    return res.json({
      success: true,
      valid: result.valid === true,
      answers: result.answers,
      missingFields: result.missingFields,
      errors: result.errors,
    });
  } catch (error) {
    console.error("Answer processing error:", error);

    if (error.status === 503) {
      return res.status(503).json({
        success: false,
        message: "Gemini is temporarily busy. Please try again in a moment.",
      });
    }

    if (error.status === 401 || error.status === 403) {
      return res.status(500).json({
        success: false,
        message: "Gemini authentication failed. Please check your API key.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to process answers",
    });
  }
});

// =====================================================
// FILE UPLOAD ERROR HANDLER
// =====================================================

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File is too large. Maximum size is 10 MB.",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next();
});

// =====================================================
// START SERVER
// =====================================================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
