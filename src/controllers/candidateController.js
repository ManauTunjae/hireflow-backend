import Candidate from "../models/Candidate.js";
import Documents from "../models/Documents.js";
import Job from "../models/Job.js";
import { v2 as cloudinary } from "cloudinary";

const uploadToCloudinaryRaw = (fileBuffer, originalName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "candidate_files",
        resource_type: "raw", // 🔥 TVINGAR fram rätt mapp i Cloudinary (/raw/upload/)
        public_id: `${Date.now()}-${originalName}`, // Ger filen ett unikt namn
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export async function createCandidate(req, res) {
  try {
    const candidateData = { ...req.body };
    if (req.user) {
      candidateData.userRef = req.user._id;
    } else {
      candidateData.userRef = null;
    }

    // 1. Skapa kandidaten i databasen först
    const newCandidate = await Candidate.create(candidateData);

    let resumeUrl = null;
    let coverLetterUrl = null;

    // 2. 🔥 MANUELL UPPLADDNING TILL CLOUDINARY MED RAW-TVÅNG
    // Vi läser filen via dess buffer (från vanlig multer.memoryStorage() eller lokal fil)
    if (req.files?.["resume"]) {
      const resumeFile = req.files["resume"][0];
      resumeUrl = await uploadToCloudinaryRaw(resumeFile.buffer, resumeFile.originalname);
    }

    if (req.files?.["coverLetter"]) {
      const coverLetterFile = req.files["coverLetter"][0];
      coverLetterUrl = await uploadToCloudinaryRaw(coverLetterFile.buffer, coverLetterFile.originalname);
    }

    // 3. Spara länkarna i din Documents-samling
    if (resumeUrl || coverLetterUrl) {
      await Documents.create({
        candidateId: newCandidate._id,
        resume: resumeUrl,
        coverLetter: coverLetterUrl,
      });
    }

    res.status(201).json({
      status: "success",
      message: "Candidate created successfully with raw documents 🎉",
      data: newCandidate
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
    // 1. Hitta alla jobb som tillhör specifik HRs annonser
    const myJobs = await Job.find({ createdBy: req.user._id }).select("_id");
    const myJobIds = myJobs.map((job) => job._id);
    
    // Filter-objekt baserat på vad HR skriver i URL:en
    const filter = { jobId: { $in: myJobIds } };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.jobId) filter.jobId = req.query.jobId;
    
    // 2. Hämta kandidater och alla dokument parallellt 🚀
    const [candidates, allDocuments] = await Promise.all([
      Candidate.find(filter).populate("jobId", "title company").sort("-createdAt"),
      Documents.find() // Hämtar alla dokumentlänkar
    ]);

    if (candidates.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No candidates found matching those criteria",
        data: [], // 🎯 FIXAT stavfel: Ändrat från 'date: []' till 'data: []' så frontend inte kraschar vid tomt resultat!
      });
    }

    // 3. 🧠 Slå ihop kandidatdatan med rätt dokument live!
    const candidatesWithDocs = candidates.map((cand) => {
      // Hitta om det finns dokument kopplade till just denna kandidats ID
      const matchingDoc = allDocuments.find(
        (doc) => doc.candidateId?.toString() === cand._id.toString()
      );

      return {
        ...cand.toObject(), // Gör om Mongoose-dokument till rent JS-objekt
        resume: matchingDoc ? matchingDoc.resume : null,
        coverLetter: matchingDoc ? matchingDoc.coverLetter : null,
      };
    });

    res.status(200).json({
      status: "success",
      results: candidatesWithDocs.length,
      data: candidatesWithDocs, // 👍 Nu innehåller varje kandidat resume och coverLetter!
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error: Could not fetch candidates",
      error: error.message
    });
  }
}

export async function getCandidateById(req, res) {
  try {
    const { id } = req.params;
    // Hämta kandidat och populera jobbet för att se vem som har skapat ansökningen
    const candidate = await Candidate.findById(id).populate("jobId");
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    // Säkerställa att det denn HR peson som skapade detta job
    // eftersom HR:en kan se kandidater på sina anonner
    if (candidate.jobId.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message:
          "Access denied: This candidate belongs to another recuiter's job",
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
          "Access denied: This candidate belongs to another recuiter's job",
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
    // req.user.id kommer direkt från din authMiddleware! 🧠
    const applications = await Candidate.find({ email: req.user.email }).populate("jobId");
    
    // Vi returnerar exakt samma struktur som din frontend förväntar sig
    return res.status(200).json({
      status: "success",
      data: applications
    });
  } catch (err) {
    return res.status(500).json({ 
      status: "error", 
      message: "Server error while fetching applications", 
      err: err.message 
    });
  }
}
