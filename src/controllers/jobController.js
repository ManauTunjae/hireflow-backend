import Job from "../models/Job.js";
import Candidate from "../models/Candidate.js"

export async function createJob(req, res) {
  try {
    // 1. Hämta jobbdatan från request body och lägg till createdBy fältet
    // 2. Lägg till createdBy från den inloggade användaren (req.user.id kommer från auth-middleware)
    const jobData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const newJob = await Job.create(jobData);
    res.status(201).json({ status: "success", data: newJob });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Server error: Could not create job" });
  }
}

export async function getJobs(req, res) {
  try {
    // Hämta alla jobb och populerar skaparen med username och email
    const jobs = await Job.find().populate("createdBy", "username email");
    res
      .status(200)
      .json({ status: "success", results: jobs.length, data: jobs });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Server error: Could not fetch jobs" });
  }
}

export async function getMyJobs(req, res) {
  try {
    const jobs = await Job.find({ createdBy: req.user._id }).populate(
      "createdBy",
      "username email",
    );
    res
      .status(200)
      .json({ status: "success", results: jobs.length, data: jobs });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Server error: Could not fetch my jobs",
      });
  }
}

export async function updateJob(req, res) {
  try {
    const { id } = req.params;
    // Hitta jobbet för att kontrollera vidare ägaren
    const job = await Job.findById(id);
    if (!job) {
      return res
        .status(404)
        .json({ status: "error", message: "Job not found" });
    }
    // Om det rätt HR som skapade jobbet
    // Vi kollar om job.createdBy (från DB) matchar req.user.id (från authMiddleware)
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ status: "error", message: "Unauthorized to update this job" });
    }
    // Genomför uppdateringen. {newL true} gör att updateJob innehåller de nya ändringar
    // { runValidators: true } ser till att schema-validering körs även vid uppdatering
    const updateJob = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: "success", data: updateJob });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Server error: Could not fetch jobs" });
  }
}

export async function deleteJob(req, res) {
  try {
    const { id } = req.params;
    // hitta jobbet för att kontrollera vidare ägaren
    const job = await Job.findById(id);
    if (!job) {
      return res
        .status(404)
        .json({ status: "error", message: "Job not found" });
    }
    // Om det rätt HR som skapade jobbet
    // Vi kollar om job.createdBy (från DB) matchar req.user.id (från authMiddleware)
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ status: "error", message: "Unauthorized to delete this job" });
    }
    // Genomför borttagningen
    // Vi använder findOneAndDelete för att säkerställa att vi bara tar bort jobbet om det matchar både id och createdBy
    await Job.findOneAndDelete({ _id: id, createdBy: req.user._id });
    await Candidate.deleteMany({ jobId: id });
    res
      .status(200)
      .json({ status: "success", message: "Job deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Server error: Could not delete job" });
  }
}
