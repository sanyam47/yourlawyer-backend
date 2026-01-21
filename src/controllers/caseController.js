import Case from "../models/Case.js";

// ✅ Create Case
export const createCase = async (req, res) => {
  try {
    const { title, description } = req.body;

    const newCase = await Case.create({
      userId: req.user._id,
      title,
      description,
    });

    res.status(201).json(newCase);
  } catch (error) {
    console.error("Create case error:", error);
    res.status(500).json({ message: "Failed to create case" });
  }
};

// ✅ Get My Cases
export const getMyCases = async (req, res) => {
  try {
    const cases = await Case.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(cases);
  } catch (error) {
    console.error("Get cases error:", error);
    res.status(500).json({ message: "Failed to fetch cases" });
  }
};

// ✅ ADD TIMELINE EVENT
export const addTimelineEvent = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { title, date, status, notes } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: "Title and date are required" });
    }

    const caseItem = await Case.findById(caseId);

    if (!caseItem) {
      return res.status(404).json({ message: "Case not found" });
    }

    caseItem.timeline.push({
      title,
      date,
      status,
      notes,
    });

    await caseItem.save();

    res.status(201).json({
      success: true,
      timeline: caseItem.timeline,
    });
  } catch (error) {
    console.error("Add timeline error:", error);
    res.status(500).json({ message: "Failed to add timeline event" });
  }
};

// ✅ GET CASE TIMELINE (ONLY ONE COPY)
export const getCaseTimeline = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id);

    if (!caseData) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.json(caseData.timeline || []);
  } catch (error) {
    console.error("Timeline fetch error:", error);
    res.status(500).json({ error: "Failed to fetch timeline" });
  }
};
