const express = require("express");
const router = express.Router();
const complaintController = require("../controllers/Complaint.controller");
const { authUser } = require("../middleware/auth");

router.post("/createComplaint", authUser, complaintController.createComplaint);
router.get("/getAllComplaints", authUser, complaintController.getAllComplaints);
router.get("/getComplaint/:id", authUser, complaintController.getComplaint);
router.put("/updateComplaint/:id", authUser, complaintController.updateComplaint);
router.delete("/deleteComplaint/:id", authUser, complaintController.deleteComplaint);

module.exports = router;
