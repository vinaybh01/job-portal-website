const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const port = 3000;

app.use(express.json());
app.use(cors());

const jobSchema = new mongoose.Schema({
  companyName: String,
  jobTitle: String,
  companyLogo: String,
  minPrice: Number,
  maxPrice: Number,
  salaryType: String,
  jobLocation: String,
  postingDate: Date,
  experienceLevel: String,
  employmentType: String,
  description: String,
  postedBy: String,
  skills: [],
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const Job = mongoose.model("Job", jobSchema);
const User = mongoose.model("User", userSchema);

mongoose.connect(
  "mongodb+srv://user_1:user123@cluster0.cidqadh.mongodb.net/jobportal"
);

//register user
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .sendStatus(400)
      .json({ message: "Username and password are required" });
  }
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    await User.create({ username, password });
    res.status(201).json({ message: "User created successfully" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    res.json({ message: "Logged in successfully", user });
  } else {
    res.status(403).json({ message: "Invalid username or password" });
  }
});

//Create Jobs
app.post("/admin/createjob", async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.json({ message: "Job created successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Error creating job", error });
  }
});

//get all jobs
app.get("/admin/jobs", async (req, res) => {
  const jobs = await Job.find({});
  res.json(jobs);
});

//get email by jobs
app.get("/admin/myjobs/:email", async (req, res) => {
  // console.log(req.params.email);
  try {
    const jobs = await Job.find({ postedBy: req.params.email });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error });
  }
});

// Delete Job
app.delete("/admin/job/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const job = await Job.findByIdAndDelete(id);
    if (job) {
      res.json({ message: "Successfully deleted" });
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting job" });
  }
});

//update job
app.put("/admin/job/:id", async (req, res) => {
  const id = req.params.id;
  const updatedJob = req.body;
  console.log(updatedJob);
  try {
    const job = await Job.findByIdAndUpdate(id, updatedJob);
    if (job) {
      res.json({ message: "Successfully updated", updatedJob });
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting job" });
  }
});

//get job
app.get("/job/:id", async (req, res) => {
  const id = req.params.id;
  const job = await Job.findById(id);
  if (job) {
    res.json(job);
  } else {
    res.status(404).json({ message: "Job not found" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
