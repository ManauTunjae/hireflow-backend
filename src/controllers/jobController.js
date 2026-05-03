import Job from "../models/Job.js";

export async function createJob(req, res) {
  try {
    // 1. Hämta jobbdatan från request body och lägg till createdBy fältet
    // 2. Lägg till createdBy från den inloggade användaren (req.user.id kommer från auth-middleware)
    const jobData = {
      ...req.body,
      createdBy: req.user.id,
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
    const query = {};
    // Hämta alla jobb och populerar skaparen med username och email
    const jobs = await Job.find(query).populate("createdBy", "username email");
    res
      .status(200)
      .json({ status: "success", results: jobs.length, data: jobs });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Server error: Could not fetch jobs" });
  }
}

export async function updateJob(req, res) {
  try {
    const { id } = req.params;
    // Hitta jobbet för att kontrollera vidare ägaren
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ status: "error", message: "Job not found" });
    }
    // Om det rätt HR som skapade jobbet
    // Vi kollar om job.createdBy (från DB) matchar req.user.id (från authMiddleware)
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ status: "error", message: "Unauthorized to update this job" }); 
    }
    // Genomför uppdateringen. {newL true} gör att updateJob innehåller de nya ändringar
    // { runValidators: true } ser till att schema-validering körs även vid uppdatering
    const updateJob = await Job.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    res.status(200).json({ status: "success", data: updateJob });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Server error: Could not fetch jobs" });
  }
}
