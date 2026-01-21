import Lawyer from "../models/Lawyer.js";

/**
 * Extract first number from any text
 * Examples:
 * "10+" → 10
 * "5-7" → 5
 * "8 yrs" → 8
 * "experience 12 years" → 12
 */
const extractNumber = (text) => {
  if (!text) return 0;
  const match = text.match(/\d+/);
  return match ? Number(match[0]) : 0;
};

/**
 * SAVE or UPDATE Lawyer Profile
 * Protected route (lawyer only)
 */
export const saveLawyerProfile = async (req, res) => {
  try {
    const {
      name,
      specialization,
      city,
      state,
      experience, // raw user input (string)
      phone,
      consultationType,
    } = req.body;

    if (!name || !specialization || !city || !state || !experience) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const lawyer = await Lawyer.findOneAndUpdate(
      { user: req.lawyer.user }, // ✅ FIXED: use lawyer middleware
      {
        user: req.lawyer.user,
        name,
        specialization: Array.isArray(specialization)
          ? specialization
          : [specialization],
        city,
        state,

        // store both display + logic values
        experienceText: experience,
        experienceYears: extractNumber(experience),

        phone,
        consultationType,
      },
      { new: true, upsert: true }
    );

    res.status(200).json(lawyer);
  } catch (error) {
    console.error("Save Lawyer Profile Error:", error);
    res.status(500).json({ message: "Failed to save lawyer profile" });
  }
};

/**
 * GET Lawyer Profile
 * Used to auto‑load dashboard
 */
export const getLawyerProfile = async (req, res) => {
  try {
    const lawyer = await Lawyer.findOne({ user: req.lawyer.user }); // ✅ FIXED

    if (!lawyer) {
      return res.status(200).json(null);
    }

    res.status(200).json(lawyer);
  } catch (error) {
    console.error("Get Lawyer Profile Error:", error);
    res.status(500).json({ message: "Failed to load lawyer profile" });
  }
};
