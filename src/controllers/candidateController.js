import Candidate from "../models/Candidate.js";
import Documents from "../models/Documents.js";
import Job from "../models/Job.js";

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

export async function getAllCandidates(req, res) {
  try {
    // Hitta alla job som tillhör specifik HRs annonser
    const myJobs = await Job.find({ createdBy: req.user._id }).select("_id");
    const myJobIds = myJobs.map((job) => job._id);
    // Filter-objekt baserar på vad HR skriver i URL:en 'candidates?status=interviwing'
    const filter = { jobId: { $in: myJobIds } };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.jobId) filter.jobId = req.query.jobId;
    // Hämta kandidat baserat på filter
    const candidates = await Candidate.find(filter)
      .populate("jobId", "title company")
      .sort("-createdAt"); // Visa de senaste ansökningarna först
    if (candidates.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No candidates found matching those criteria",
        date: [],
      });
    }
    res.status(200).json({
      status: "success",
      results: candidates.length,
      data: candidates,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error: Could not fetch candidates",
    });
  }
}

export async function getCandidateById(req, res) {
  try {
    const { id } = req.params;
    // Hämta kandidat och populera jobbet för att se vem som har skapat ansökningen
    const candidate = await Candidate.findById(id).populate("jobId");
    if (!candidate) {
      res.status(404).json({ message: "Candidate not found" });
    }
    // Säkerställa att det denn HR peson som skapade detta job
    // eftersom HR:en kan se kandidater på sina anonner
    if (candidate.jobId.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message:
          "Access denied: This candidate belongs to another recuiter's job",
      });
    }
    const documents = await Documents.findOne({ candidate: id });
    res.status(200).json({
      status: "success",
      "candidate data" : { candidate, documents },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error: Could not fetch a candidate",
    });
  }
}
