import Candidate from "../models/Candidate.js";
import Documents from "../models/Documents.js";
import Job from "../models/Job.js";

export async function downloadDocument(req, res) {
  try {
    const { id, type } = req.params; // type = "resume" eller "coverLetter"

    const doc = await Documents.findOne({ candidateId: id });
    if (!doc) return res.status(404).json({ message: "Document not found" });

    const candidate = await Candidate.findById(id).populate("jobId");
    if (candidate.jobId.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const fileUrl = type === "resume" ? doc.resume : doc.coverLetter;
    if (!fileUrl) return res.status(404).json({ message: "File not found" });

    // Redirecta till Cloudinary URL med rätt headers
    res.redirect(fileUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createCandidate(req, res) {
  try {
    // 🔍 DEBUG LOGS
    console.log("=== createCandidate HIT ===");
    console.log("Cloudinary config:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "✅ SET" : "❌ MISSING",
      api_key: process.env.CLOUDINARY_API_KEY ? "✅ SET" : "❌ MISSING",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "✅ SET" : "❌ MISSING",
    });
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    const candidateData = { ...req.body };
    if (req.user) {
      candidateData.userRef = req.user._id;
    } else {
      candidateData.userRef = null;
    }

    const newCandidate = await Candidate.create(candidateData);
    const resumeUrl = req.files?.["resume"]
      ? req.files["resume"][0].path
      : null;
    const coverLetterUrl = req.files?.["coverLetter"]
      ? req.files["coverLetter"][0].path
      : null;

    if (resumeUrl || coverLetterUrl) {
      await Documents.create({
        candidateId: newCandidate._id,
        resume: resumeUrl,
        coverLetter: coverLetterUrl,
      });
    }

    res.status(201).json({
      status: "success",
      message: "Candidate created successfully with documents 🎉",
      data: newCandidate,
    });
  } catch (error) {
    // 🔍 DETALJERAT FEL
    console.error("=== createCandidate ERROR ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

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
    // ✅ Filter måste definieras 
    const myJobs = await Job.find({ createdBy: req.user._id }).select("_id");
    const myJobIds = myJobs.map((job) => job._id);

    const filter = { jobId: { $in: myJobIds } };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.jobId) filter.jobId = req.query.jobId;

    // STEG 1: Hämta kandidaterna 
    const candidates = await Candidate.find(filter)
      .populate("jobId", "title company")
      .sort("-createdAt");

    if (candidates.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No candidates found matching those criteria",
        data: [],
      });
    }

    // STEG 2: Hämta bara dokument för DESSA kandidater
    const candidateIds = candidates.map((c) => c._id);
    const allDocuments = await Documents.find({
      candidateId: { $in: candidateIds },
    });

    // STEG 3: Slå ihop kandidatdatan med rätt dokument
    const candidatesWithDocs = candidates.map((cand) => {
      const matchingDoc = allDocuments.find(
        (doc) => doc.candidateId?.toString() === cand._id.toString(),
      );
      return {
        ...cand.toObject(),
        resume: matchingDoc ? matchingDoc.resume : null,
        coverLetter: matchingDoc ? matchingDoc.coverLetter : null,
      };
    });

    res.status(200).json({
      status: "success",
      results: candidatesWithDocs.length,
      data: candidatesWithDocs,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error: Could not fetch candidates",
      error: error.message,
    });
  }
}

export async function getCandidateById(req, res) {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findById(id).populate("jobId");
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    if (candidate.jobId.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message:
          "Access denied: This candidate belongs to another recruiter's job",
      });
    }
    const documents = await Documents.findOne({ candidateId: id });
    res.status(200).json({
      status: "success",
      "candidate data": { candidate, documents },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error: Could not fetch a candidate",
    });
  }
}

export async function updateCandidate(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const candidate = await Candidate.findById(id).populate("jobId");
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    if (candidate.jobId.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message:
          "Access denied: This candidate belongs to another recruiter's job",
      });
    }
    candidate.status = status;
    await candidate.save();

    res.status(200).json({
      status: "success",
      message: `Candidate status updated to ${status}`,
      "candidate data": { candidate, status },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error: Could not fetch a candidate",
      error: error.message,
    });
  }
}

export async function deleteCandidate(req, res) {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findById(id).populate("jobId");
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    if (candidate.jobId.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message:
          "Access denied: You can only delete candidates for your own jobs",
      });
    }
    await Documents.deleteMany({ candidateId: id });
    await Candidate.findByIdAndDelete(id);
    res.status(200).json({
      status: "success",
      message: "Candidate deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error: Could not fetch a candidate",
      error: error.message,
    });
  }
}

export async function getMyApplications(req, res) {
  try {
    const applications = await Candidate.find({
      email: req.user.email,
    }).populate("jobId");

    return res.status(200).json({
      status: "success",
      data: applications,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Server error while fetching applications",
      err: err.message,
    });
  }
}
