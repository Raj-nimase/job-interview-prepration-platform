import ResumeAnalysis from "../models/ResumeAnalysis.js";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PDFParse } from "pdf-parse";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const gemini = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ─── ANALYZE RESUME ──────────────────────────────────────────────────────────
export const analyzeResume = async (req, res) => {
  try {
    const { targetRole } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    // Parse PDF to text using pdf-parse
    const parser = new PDFParse({ data: file.buffer });
    await parser.load();
    const textResult = await parser.getText();
    await parser.destroy();
    const resumeText = textResult.text;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        error:
          "Could not extract sufficient text from the PDF. Please upload a text-based PDF (not a scanned image).",
      });
    }

    const prompt = `You are an expert resume reviewer and career coach.

Analyze the following resume text and provide a detailed evaluation.

${targetRole ? `TARGET ROLE: "${targetRole}"` : "No specific target role provided — give general feedback."}

RESUME TEXT:
"""
${resumeText}
"""

Evaluate the resume on these criteria:
1. **Overall Quality** — How effective is this resume overall?
2. **ATS Compatibility** — How well would this pass Applicant Tracking Systems?
3. **Contact Information** — Is contact info complete and professional?
4. **Experience** — How well are work experiences described? Action verbs, quantified achievements?
5. **Education** — Is education section properly formatted and relevant?
6. **Skills** — Are relevant skills listed? Any critical missing skills for the target role?
7. **Formatting** — Is the resume well-structured, concise, and easy to read?
8. **Keywords** — What relevant keywords are present and which important ones are missing?

Return ONLY valid JSON — no markdown fences, no extra text:
{
  "overallScore": 75,
  "atsScore": 70,
  "summary": "Brief 2-3 sentence overall assessment of the resume...",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "suggestions": ["Actionable suggestion 1", "Actionable suggestion 2", "Actionable suggestion 3"],
  "sections": {
    "contactInfo": { "score": 8, "feedback": "Feedback about contact information..." },
    "experience": { "score": 7, "feedback": "Feedback about experience section..." },
    "education": { "score": 6, "feedback": "Feedback about education section..." },
    "skills": { "score": 7, "feedback": "Feedback about skills section..." },
    "formatting": { "score": 8, "feedback": "Feedback about formatting and structure..." }
  },
  "keywords": {
    "found": ["keyword1", "keyword2"],
    "missing": ["missing_keyword1", "missing_keyword2"]
  }
}`;

    const result = await gemini.generateContent(prompt);
    const raw = result.response.text().trim();

    let data;
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      data = JSON.parse(cleaned);
    } catch (e) {
      return res
        .status(500)
        .json({ error: "Failed to parse AI response", raw });
    }

    if (!data) {
      return res.status(500).json({ error: "AI analysis failed." });
    }

    // Save to DB if user is authenticated
    const userId = req.body.userId || null;
    if (userId) {
      const analysis = new ResumeAnalysis({
        userId,
        fileName: file.originalname,
        targetRole: targetRole || "",
        ...data,
      });
      await analysis.save();
      return res.json({ ...data, analysisId: analysis._id });
    }

    res.json(data);
  } catch (err) {
    console.error("Resume analysis error:", err?.message ?? err);
    res.status(500).json({
      error: "Resume analysis failed",
      details: err?.message ?? String(err),
    });
  }
};

// ─── GET USER'S ANALYSIS HISTORY ─────────────────────────────────────────────
export const getAnalysisHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const analyses = await ResumeAnalysis.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ analyses });
  } catch (err) {
    console.error("History fetch error:", err?.message ?? err);
    res.status(500).json({ error: "Failed to fetch analysis history" });
  }
};
