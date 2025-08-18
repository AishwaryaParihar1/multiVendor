const User = require('../models/User');

// Existing: Get all pending vendors
exports.getPendingVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor', vendorStatus: 'pending' });
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// New API: Get all approved vendors
exports.getApprovedVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor', vendorStatus: 'approved' });
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Existing: Approve vendor
exports.approveVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await User.findByIdAndUpdate(id, { vendorStatus: 'approved' }, { new: true });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json({ message: "Vendor approved", vendor });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Existing: Reject vendor
exports.rejectVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await User.findByIdAndUpdate(id, { vendorStatus: 'rejected' }, { new: true });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json({ message: "Vendor rejected", vendor });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



exports.getDashboardStats = async (req, res) => {
  try {
    // Vendor stats
    const totalVendorRequests = await User.countDocuments({ role: "vendor", vendorStatus: "pending" });
    const approvedVendorCount = await User.countDocuments({ role: "vendor", vendorStatus: "approved" });
    const rejectedVendorCount = await User.countDocuments({ role: "vendor", vendorStatus: "rejected" });


    const totalUserCount = await User.countDocuments({ role: "customer" });

    res.json({
      totalVendorRequests,
      approvedVendorCount,
      rejectedVendorCount,
      totalUserCount,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
