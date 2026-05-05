import Candidate from "../models/Candidate.js";
import Documents from "../models/Documents.js";

export async function createCandidate(req, res) {
  try {
    const candidateData = { ...req.body };
    // Om användaren är inloggad, lägg till referens till användarens ID
    if (req.user) {
      candidateData.userRef = req.user._id;
    }
    // Skapa kandidaten men namn, mejl osv.
    const newCandidate = await Candidate.create(candidateData);
    // Kollar om bifogade cv och personliga brev finns
    if (req.body.resume || req.body.coverLetter) {
      await Documents.create({
        candidateId: newCandidate._id,
        resume: req.body.resume,
        coverLetter: req.body.coverLetter,
      });
    }
    res.status(201).json({
      status: "success",
      message: "Candidate created successfully",
      data: newCandidate,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: "error",
        message: "You have already applied for this position with this email",
      });
    }
    res.status(500).json({ status: "error", message: error.message });
  }
}
