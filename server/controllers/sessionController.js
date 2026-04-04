import MockInterview from "../models/MockInterview.js";

export const start_session = async (req, res) => {
  const { userId, role } = req.body;
  if (!userId || !role)
    return res.status(400).json({ error: "Missing fields" });

  const session = new MockInterview({ userId, role, questionsAsked: [] });
  await session.save();

  res.json({ sessionId: session._id });
};

export const get_session = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await MockInterview.findById(id);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.json(session);
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({ error: "Server error" });
  }
};
