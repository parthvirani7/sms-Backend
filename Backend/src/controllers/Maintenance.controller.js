const maintenanceService = require("../services/maintenance.service");

// Create a new maintenance record
const createMaintenance = async (req, res) => {
  try {
    const reqbody = req.body;
    const body = {
      Maintenance_Amount: reqbody.maintenanceAmount,
      Penalty_Amount: reqbody.penaltyAmount,
      Maintenance_Due_Date: reqbody.maintenanceDueDate,
      Penalty_Applied_After_Day_Selection: reqbody.penaltyAppliedAfterDaySelection,
      createdBy: req.user._id,
      Society: req.user.societyid
    }
    const maintenance = await maintenanceService.create(body);
    return res.status(201).json(maintenance);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Get all maintenance records
const getAllMaintenances = async (req, res) => {
  try {
    const societyid = req.user.societyid
    const maintenances = await maintenanceService.getAll(societyid);
    return res.status(200).json(maintenances);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const maintenance = await maintenanceService.getById(id);
    if (!maintenance) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json(maintenance);
  } catch (error) {
    return res.status(500).json({ message: error.message });

  }
}

// Update a maintenance record
const updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const maintenance = await maintenanceService.getById(id);
    if (!maintenance) {
      return res.status(404).json({ message: "Not found" });
    }
    const body = {}
    if (req.body) {
      body.Maintenance_Amount = req.body.Maintenance_Amount;
      body.Penalty_Amount = req.body.Penalty_Amount;
      body.Maintenance_Due_Date = req.body.Maintenance_Due_Date;
      body.Penalty_Applied_After_Day_Selection = req.body.Penalty_Applied_After_Day_Selection;
    }

    const updatedMaintenance = await maintenanceService.update(id, body);
    return res.status(200).json(updatedMaintenance);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Delete a maintenance record
const deleteMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const maintenance = await maintenanceService.getById(id);
    if (!maintenance) {
      return res.status(404).json({ message: "Already deleted" });
    }

    await maintenanceService.remove(id);
    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMaintenance,
  getAllMaintenances,
  updateMaintenance,
  deleteMaintenance,
  getMaintenance
};