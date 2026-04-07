import ResumeAnalysis from "../models/ResumeAnalysis.js";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PDFParse } from "pdf-parse";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY in .env");
}
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const gemini = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const SECTION_KEYS = [
  "contactInfo",
  "experience",
  "education",
  "skills",
  "formatting",
];

const FALLBACK_FEEDBACK = {
  contactInfo:
    "Contact section needs clearer and complete recruiter-ready details.",
  experience:
    "Experience bullets should show stronger impact with measurable outcomes.",
  education:
    "Education section can be better aligned with role relevance and clarity.",
  skills: "Skills should be curated to match target role requirements.",
  formatting:
    "Formatting can be improved for readability and ATS-safe parsing.",
};

const clampScore = (score) => {
  const numeric = Number(score);
  if (Number.isNaN(numeric)) return 0;
  if (numeric <= 10) return Math.max(0, Math.min(100, numeric * 10));
  return Math.max(0, Math.min(100, numeric));
};

const safeJsonParse = (rawText) => {
  const raw = String(rawText || "").trim();
  if (!raw) return { ok: false, data: null, error: "Empty response" };

  const cleaned = raw.replace(/```json|```/g, "").trim();
  try {
    return { ok: true, data: JSON.parse(cleaned), error: null };
  } catch {
    // Fallback: try to extract the first top-level JSON object.
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      const slice = cleaned.slice(start, end + 1);
      try {
        return { ok: true, data: JSON.parse(slice), error: null };
      } catch (err2) {
        return {
          ok: false,
          data: null,
          error: err2?.message || "Failed to parse JSON slice",
        };
      }
    }
    return { ok: false, data: null, error: "Failed to parse JSON" };
  }
};

const cleanTextForLLM = (text, maxChars = 14000) => {
  const normalized = String(text || "")
    .replace(/\u0000/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (normalized.length <= maxChars) return normalized;
  return normalized.slice(0, maxChars).trim() + "\n\n[TRUNCATED]";
};

const normalizeSectionKey = (value) => {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) return "";
  if (raw === "contact" || raw === "contact_info" || raw === "contactinfo") {
    return "contactInfo";
  }
  if (raw === "work" || raw === "workexperience" || raw === "work_experience") {
    return "experience";
  }
  if (raw === "edu" || raw === "academics") return "education";
  if (raw === "skill" || raw === "techskills" || raw === "technicalskills") {
    return "skills";
  }
  if (raw === "ats" || raw === "layout" || raw === "structure") {
    return "formatting";
  }
  const matched = SECTION_KEYS.find((k) => k.toLowerCase() === raw);
  return matched || "";
};

const normalizeList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/\n|\.|;/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizePriority = (value) => {
  const priority = String(value || "").toLowerCase();
  if (priority === "high") return "high";
  if (priority === "low") return "low";
  return "medium";
};

const extractResumeSignals = (resumeTextRaw = "") => {
  const text = String(resumeTextRaw || "");
  const lower = text.toLowerCase();
  const hasEmail =
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text) || false;
  const hasPhone =
    /(\+?\d{1,3}[\s.-]?)?(\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}/.test(
      text,
    ) || false;
  const hasLinkedIn = /linkedin\.com\/in\//i.test(text) || false;
  const hasGitHub = /github\.com\//i.test(text) || false;
  const hasExperienceHeading =
    /(experience|work experience|employment|professional experience)\b/i.test(
      text,
    ) || false;
  const hasSkillsHeading =
    /(skills|technical skills|core competencies)\b/i.test(text) || false;
  const hasEducationHeading =
    /(education|academics|certifications?)\b/i.test(text) || false;

  const metricHits =
    text.match(/\b\d+(\.\d+)?\s?(%|k|m|b|yrs?|years?)\b/gi)?.length || 0;
  const actionVerbHits =
    text.match(
      /\b(led|owned|built|shipped|improved|optimized|reduced|increased|designed|implemented|developed|launched|delivered|automated|migrated|refactored)\b/gi,
    )?.length || 0;

  return {
    hasEmail,
    hasPhone,
    hasLinkedIn,
    hasGitHub,
    hasExperienceHeading,
    hasSkillsHeading,
    hasEducationHeading,
    metricHits,
    actionVerbHits,
    lower,
  };
};

const extractKeywordsFromResumeText = (resumeTextRaw = "", max = 20) => {
  const text = String(resumeTextRaw || "");
  const lower = text.toLowerCase();

  const KNOWN = [
    // Engineering (common)
    "javascript",
    "typescript",
    "react",
    "node",
    "node.js",
    "express",
    "next.js",
    "html",
    "css",
    "tailwind",
    "redux",
    "vue",
    "angular",
    "python",
    "java",
    "c#",
    "c++",
    "go",
    "sql",
    "mongodb",
    "postgresql",
    "mysql",
    "redis",
    "docker",
    "kubernetes",
    "aws",
    "gcp",
    "azure",
    "git",
    "github",
    "rest",
    "graphql",
    "ci/cd",
    "jest",
    "cypress",
    // Product / analytics (common)
    "agile",
    "scrum",
    "jira",
    "figma",
    "a/b testing",
    "ab testing",
    "google analytics",
    "seo",
    "stakeholder management",
  ];

  const found = [];
  const push = (k) => {
    const kw = String(k || "").trim();
    if (!kw) return;
    if (!found.includes(kw)) found.push(kw);
  };

  // 1) Pick up known keywords deterministically.
  for (const kw of KNOWN) {
    const needle = kw.toLowerCase();
    if (needle.includes(" ")) {
      if (lower.includes(needle)) push(kw);
      continue;
    }
    if (
      new RegExp(
        `\\b${needle.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\b`,
        "i",
      ).test(lower)
    ) {
      push(kw);
    }
    if (found.length >= max) return found.slice(0, max);
  }

  // 2) Fallback: collect "skill-like" tokens (e.g., node.js, ci/cd, c++).
  const tokens =
    text.match(/[A-Za-z][A-Za-z0-9+.#/-]{1,25}/g)?.map((t) => t.trim()) || [];
  const STOP = new Set([
    "and",
    "the",
    "with",
    "for",
    "to",
    "from",
    "in",
    "on",
    "a",
    "an",
    "of",
    "at",
    "by",
    "as",
    "is",
    "are",
    "this",
    "that",
    "experience",
    "skills",
    "education",
    "projects",
    "resume",
    "summary",
  ]);

  const counts = new Map();
  for (const t of tokens) {
    const k = t.toLowerCase();
    if (k.length < 2) continue;
    if (STOP.has(k)) continue;
    if (/^\d/.test(k)) continue;
    // Avoid obviously non-skill tokens.
    if (/^(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)$/i.test(k))
      continue;
    counts.set(k, (counts.get(k) || 0) + 1);
  }

  const sorted = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k);

  for (const k of sorted) {
    if (found.length >= max) break;
    if (found.includes(k)) continue;
    // Prefer techy-looking tokens.
    if (/[+.#/]|js$|ts$|sql$|api$/.test(k) || k.length <= 12) push(k);
  }

  return found.slice(0, max);
};

const buildResumeAnalysisPrompt = ({
  targetRole = "",
  resumeText = "",
  signals = {},
}) => {
  const roleText = targetRole?.trim()
    ? `TARGET ROLE: "${targetRole.trim()}"`
    : "TARGET ROLE: Not provided (evaluate for general employability and ATS-readiness).";

  return `SYSTEM:
You are a strict resume evaluator used in a production hiring-prep app.
Your response must be grounded in the provided resume text only.

TASK:
Analyze the resume and produce a realistic, evidence-based evaluation.

${roleText}

EXTRACTED RESUME TEXT:
"""
${resumeText}
"""

OBSERVED SIGNALS (detected by backend regex checks, use them as hints):
- hasEmail: ${Boolean(signals.hasEmail)}
- hasPhone: ${Boolean(signals.hasPhone)}
- hasLinkedIn: ${Boolean(signals.hasLinkedIn)}
- hasGitHub: ${Boolean(signals.hasGitHub)}
- hasExperienceHeading: ${Boolean(signals.hasExperienceHeading)}
- hasSkillsHeading: ${Boolean(signals.hasSkillsHeading)}
- hasEducationHeading: ${Boolean(signals.hasEducationHeading)}
- metricHits: ${Number(signals.metricHits || 0)}
- actionVerbHits: ${Number(signals.actionVerbHits || 0)}

SCORING RUBRIC (0-100):
- 85-100: strong and role-aligned, clear impact, ATS-safe formatting, minimal gaps
- 70-84: solid but has noticeable gaps in impact, keywords, or structure
- 50-69: partial alignment, multiple important gaps, weak specificity
- 0-49: major issues, missing critical resume content, low ATS readiness

SECTION RUBRIC:
1) contactInfo
   - Check name, professional email, phone, location (optional), links (LinkedIn/GitHub/portfolio when relevant)
2) experience
   - Check role relevance, impact metrics, action verbs, outcome-focused bullets
3) education
   - Check degree/certification clarity and relevance for target role
4) skills
   - Check role-relevant tools/tech coverage and grouping clarity
5) formatting
   - Check ATS readability: clear headings, consistent dates, low visual complexity, parseable structure

STRICT RULES:
- Do NOT invent facts (companies, years, projects, metrics, certifications, achievements).
- Every weakness/improvement must map to text evidence or clearly missing expected content.
- Prefer concrete rewrites over generic advice.
- Keep each list item concise and actionable.
- Keywords.found: include ONLY terms present in the resume text (case-insensitive).
- Keywords.missing: include relevant role terms that are not present.
- If target role is not provided, infer missing keywords from common industry baseline only.
- Use targetSection values only from: contactInfo, experience, education, skills, formatting.
- Use priority values only from: high, medium, low.
- Return ONLY valid JSON (no markdown, no explanation, no code fences).

OUTPUT CONTRACT (exact keys required):
{
  "overallScore": 75,
  "atsScore": 70,
  "summary": "2-3 sentences with realistic overall assessment and biggest gap.",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "suggestions": ["..."],
  "sections": {
    "contactInfo": { "score": 68, "feedback": "...", "issues": ["..."], "whatToAdd": ["..."], "improvements": ["..."], "examples": ["..."] },
    "experience": { "score": 72, "feedback": "...", "issues": ["..."], "whatToAdd": ["..."], "improvements": ["..."], "examples": ["..."] },
    "education": { "score": 74, "feedback": "...", "issues": ["..."], "whatToAdd": ["..."], "improvements": ["..."], "examples": ["..."] },
    "skills": { "score": 65, "feedback": "...", "issues": ["..."], "whatToAdd": ["..."], "improvements": ["..."], "examples": ["..."] },
    "formatting": { "score": 70, "feedback": "...", "issues": ["..."], "whatToAdd": ["..."], "improvements": ["..."], "examples": ["..."] }
  },
  "keywords": { "found": ["..."], "missing": ["..."] },
  "actionPlan": [
    {
      "title": "...",
      "targetSection": "experience",
      "priority": "high",
      "rationale": "...",
      "estimatedImpact": "Potential +X overall score",
      "tasks": ["...", "..."]
    }
  ]
}`;
};

const applyRealityCaps = (normalized, signals) => {
  const next = JSON.parse(JSON.stringify(normalized || {}));
  const contact = next.sections?.contactInfo;
  if (contact) {
    if (!signals.hasEmail) contact.score = Math.min(contact.score ?? 0, 40);
    if (!signals.hasPhone) contact.score = Math.min(contact.score ?? 0, 55);
    if (!signals.hasLinkedIn && !signals.hasGitHub) {
      contact.score = Math.min(contact.score ?? 0, 70);
    }
  }

  const exp = next.sections?.experience;
  if (exp) {
    if (!signals.hasExperienceHeading) {
      exp.score = Math.min(exp.score ?? 0, 55);
    }
    if (signals.metricHits === 0) exp.score = Math.min(exp.score ?? 0, 60);
    if (signals.metricHits < 3) exp.score = Math.min(exp.score ?? 0, 75);
  }

  const skills = next.sections?.skills;
  if (skills) {
    if (!signals.hasSkillsHeading) skills.score = Math.min(skills.score ?? 0, 60);
  }

  const edu = next.sections?.education;
  if (edu) {
    if (!signals.hasEducationHeading) edu.score = Math.min(edu.score ?? 0, 65);
  }

  // Conservative overall/ATS caps based on weak signals.
  if (!signals.hasEmail) next.overallScore = Math.min(next.overallScore ?? 0, 60);
  if (!signals.hasExperienceHeading) {
    next.atsScore = Math.min(next.atsScore ?? 0, 70);
    next.overallScore = Math.min(next.overallScore ?? 0, 70);
  }

  next.overallScore = clampScore(next.overallScore);
  next.atsScore = clampScore(next.atsScore);
  SECTION_KEYS.forEach((k) => {
    if (next.sections?.[k]) next.sections[k].score = clampScore(next.sections[k].score);
  });

  return next;
};

const groundKeywordsToText = (keywords, resumeLowerText) => {
  const found = normalizeList(keywords?.found)
    .map((k) => k.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 40);
  const missing = normalizeList(keywords?.missing)
    .map((k) => k.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 40);

  const isPresent = (kw) => {
    const k = kw.toLowerCase();
    if (!k) return false;
    // Basic word-boundary match with fallback substring for phrases.
    if (k.includes(" ")) return resumeLowerText.includes(k);
    return new RegExp(`\\b${k.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\b`, "i").test(
      resumeLowerText,
    );
  };

  const groundedFound = Array.from(new Set(found.filter(isPresent))).slice(0, 20);
  const groundedMissing = Array.from(
    new Set(missing.filter((kw) => kw && !isPresent(kw))),
  ).slice(0, 20);

  return { found: groundedFound, missing: groundedMissing };
};

const normalizeAnalysisData = (rawData = {}, targetRole = "") => {
  const normalizedSections = SECTION_KEYS.reduce((acc, sectionKey) => {
    const rawSection = rawData.sections?.[sectionKey] || {};
    const score = clampScore(rawSection.score);

    const improvements = normalizeList(rawSection.improvements);
    const whatToAdd = normalizeList(rawSection.whatToAdd);
    const issues = normalizeList(rawSection.issues);
    const examples = normalizeList(rawSection.examples);

    acc[sectionKey] = {
      score,
      feedback:
        typeof rawSection.feedback === "string" && rawSection.feedback.trim()
          ? rawSection.feedback.trim()
          : FALLBACK_FEEDBACK[sectionKey],
      issues,
      whatToAdd,
      improvements,
      examples,
    };

    return acc;
  }, {});

  const sortedByWeakest = Object.entries(normalizedSections).sort(
    (a, b) => a[1].score - b[1].score,
  );

  const fallbackActionPlan = sortedByWeakest
    .slice(0, 3)
    .map(([section, data]) => {
      const tasks = [...data.whatToAdd, ...data.improvements].slice(0, 4);
      const priority =
        data.score < 65 ? "high" : data.score < 80 ? "medium" : "low";
      return {
        title: `Improve ${section}`,
        targetSection: section,
        priority,
        rationale: data.feedback,
        estimatedImpact: `Potential +${Math.max(4, Math.round((80 - data.score) / 4))} score gain`,
        tasks: tasks.length
          ? tasks
          : [
              "Rewrite this section with stronger, role-aligned and measurable content.",
            ],
      };
    });

  const normalizedActionPlan = (
    Array.isArray(rawData.actionPlan) ? rawData.actionPlan : []
  )
    .map((item) => ({
      title: typeof item?.title === "string" ? item.title.trim() : "",
      targetSection:
        typeof item?.targetSection === "string"
          ? normalizeSectionKey(item.targetSection)
          : "",
      priority: normalizePriority(item?.priority),
      rationale:
        typeof item?.rationale === "string" ? item.rationale.trim() : "",
      estimatedImpact:
        typeof item?.estimatedImpact === "string"
          ? item.estimatedImpact.trim()
          : "",
      tasks: normalizeList(item?.tasks).slice(0, 6),
    }))
    .filter((item) => item.title && item.tasks.length);

  return {
    overallScore: clampScore(rawData.overallScore),
    atsScore: clampScore(rawData.atsScore),
    summary:
      typeof rawData.summary === "string" && rawData.summary.trim()
        ? rawData.summary.trim()
        : targetRole
          ? `Resume reviewed for ${targetRole}. Focus on section-level upgrades to improve selection probability.`
          : "Resume reviewed with section-level recommendations to improve ATS fit and recruiter readability.",
    strengths: normalizeList(rawData.strengths).slice(0, 6),
    weaknesses: normalizeList(rawData.weaknesses).slice(0, 6),
    suggestions: normalizeList(rawData.suggestions).slice(0, 8),
    sections: normalizedSections,
    keywords: {
      found: normalizeList(rawData.keywords?.found).slice(0, 20),
      missing: normalizeList(rawData.keywords?.missing).slice(0, 20),
    },
    actionPlan:
      normalizedActionPlan.length > 0
        ? normalizedActionPlan.slice(0, 8)
        : fallbackActionPlan,
  };
};

// ─── ANALYZE RESUME ──────────────────────────────────────────────────────────
export const analyzeResume = async (req, res) => {
  try {
    const { targetRole } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: "Server is missing GEMINI_API_KEY" });
    }

    // Parse PDF to text using pdf-parse
    let resumeText = "";
    try {
      const parser = new PDFParse({ data: file.buffer });
      try {
        const parsed = await parser.getText();
        resumeText = parsed.text || "";
      } finally {
        await parser.destroy();
      }
    } catch (parseErr) {
      return res.status(400).json({
        error:
          "Could not read the PDF file. Please ensure it is a valid, text-based PDF.",
      });
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        error:
          "Could not extract sufficient text from the PDF. Please upload a text-based PDF (not a scanned image).",
      });
    }

    const cleanedResumeText = cleanTextForLLM(resumeText);
    const signals = extractResumeSignals(resumeText);

    const prompt = buildResumeAnalysisPrompt({
      targetRole,
      resumeText: cleanedResumeText,
      signals,
    });

    const result = await gemini.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    });
    const raw = result.response.text().trim();

    const parsed = safeJsonParse(raw);
    if (!parsed.ok) {
      return res.status(500).json({
        error: "Failed to parse AI response",
        details: parsed.error,
        raw,
      });
    }
    const data = parsed.data;

    if (!data) {
      return res.status(500).json({ error: "AI analysis failed." });
    }

    let normalizedData = normalizeAnalysisData(data, targetRole || "");
    normalizedData.keywords = groundKeywordsToText(normalizedData.keywords, signals.lower);

    // If the model under-reports "found" keywords, fill with deterministic extraction.
    if (!normalizedData.keywords.found?.length) {
      normalizedData.keywords.found = extractKeywordsFromResumeText(resumeText, 20);
    }
    // Ensure missing never includes present tokens.
    normalizedData.keywords = groundKeywordsToText(normalizedData.keywords, signals.lower);

    normalizedData = applyRealityCaps(normalizedData, signals);
    normalizedData.targetRole = targetRole || "";

    // Save to DB if user is authenticated
    const userId = req.body.userId || null;
    if (userId) {
      const analysis = new ResumeAnalysis({
        userId,
        fileName: file.originalname,
        targetRole: targetRole || "",
        resumeText: resumeText,
        ...normalizedData,
      });
      await analysis.save();
      return res.json({
        ...normalizedData,
        analysisId: analysis._id,
        resumeText: resumeText,
      });
    }

    res.json({ ...normalizedData, resumeText: resumeText });
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
