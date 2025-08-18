const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



// REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, businessName, businessAddress, phone } = req.body;

    // Check if email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare new user object
    const newUserData = {
      name,
      email,
      password: hashedPassword,
      role: role || 'customer'
    };

    // Extra fields only if registering as vendor
    if (role === 'vendor') {
      newUserData.businessName = businessName;
      newUserData.businessAddress = businessAddress || '';
      newUserData.phone = phone || '';
      newUserData.vendorStatus = 'pending'; // default
    }

    const newUser = new User(newUserData);
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (err) {
    console.error("❌ Register error =>", err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    // Vendor check - allow only approved vendors to login to vendor dashboard
    if (user.role === 'vendor' && user.vendorStatus !== 'approved') {
      return res.status(403).json({ message: 'Vendor account not approved yet' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send response without password
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        vendorStatus: user.vendorStatus || null
      }
    });
  } catch (err) {
    console.error("❌ Login error =>", err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
