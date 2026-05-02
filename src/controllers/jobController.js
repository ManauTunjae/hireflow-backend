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
};
