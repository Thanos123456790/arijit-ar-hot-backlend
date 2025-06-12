import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const evaluateAnswersWithAI = async (req, res) => {
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions)) {
        return res.status(400).json({ error: "Invalid input" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    try {
        const results = await Promise.all(
            questions.map(async (q) => {
                const prompt = `
Evaluate the student's answer and return a JSON like:
{
  "verdict": "Exact" | "Partial" | "Wrong" | "No Answer",
  "score": number,
  "comment": "Brief explanation. If Partial, add a line like: 'A good score for this answer out of ${q.score} would be X.'"
}

Question: ${q.question}
Correct Answer: ${q.correctAnswer}
Student Answer: ${q.studentAnswer || "No Answer"}
Total Marks: ${q.score}
`;

                const result = await model.generateContent(prompt);
                let text = result.response.text().trim();

                // Remove Markdown code block formatting if present
                if (text.startsWith("```json")) {
                    text = text.replace(/```json\s*|\s*```$/g, "").trim();
                }

                console.log("AI Response:", text);

                try {
                    const json = JSON.parse(text);

                    const verdict = json.verdict || "Wrong";
                    let score = 0;

                    if (verdict === "Exact") {
                        score = q.score;
                    } else if (verdict === "Partial") {
                        score = Math.min(Number(json.score), q.score); // AI-suggested score but capped
                    } else {
                        score = 0;
                    }

                    return {
                        verdict,
                        score,
                        comment: json.comment || "No comment",
                    };
                } catch (err) {
                    console.error("Parsing error:", err.message);
                    return {
                        verdict: "Wrong",
                        score: 0,
                        comment: "Could not parse AI response.",
                    };
                }
            })
        );

        res.json(results);
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: "AI evaluation failed" });
    }
};
