import MockInterview from "../models/MockInterview.js";

export const start_session = async (req, res) => {
  const { userId, role } = req.body;
  if (!userId || !role)
    return res.status(400).json({ error: "Missing fields" });

  const session = new MockInterview({ userId, role, questionsAsked: [] });
  await session.save();

  res.json({ sessionId: session._id });
};
