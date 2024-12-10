const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Signup Function (No user existence check)
exports.signupUser = async (req, res) => {
  const { userid, password } = req.body;

  // Insert the new user with default role 'pending'
  const { data: newUser, error: insertError } = await supabase
    .from('sample')
    .insert([
      {
        userid,
        password,
        role: 'pending',  // Set default role
      }
    ])
    .select();  // Ensure we get the inserted user data back

  if (insertError) {
    return res.status(500).json({ message: 'Error creating user' });
  }

  // Check if the insertion returned data
  if (!newUser || newUser.length === 0) {
    return res.status(500).json({ message: 'User not created' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userid: newUser[0].userid, role: newUser[0].role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
  );

  res.status(201).json({ token });
};

// Login Function (unchanged)
exports.loginUser = async (req, res) => {
  const { userid, password } = req.body;

  const { data: user, error } = await supabase
    .from('sample')
    .select('*')
    .eq('userid', userid)
    .single();

  if (error || !user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userid: user.userid, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
  );

  res.json({ token });
};

// Protected Data Function (unchanged)
exports.getProtectedData = (req, res) => {
  const { role } = req.user;
  if (role === 'admin') {
    return res.json({ message: 'Welcome Admin' });
  } else if (role === 'user') {
    return res.json({ message: 'Welcome User' });
  }
  res.status(403).json({ message: 'Access Denied' });
};

exports.getAllUsers = async (req, res) => {
  const { role } = req.user;

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can view all users' });
  }

  const { data: users, error } = await supabase.from('sample').select('*');

  if (error) {
    return res.status(500).json({ message: 'Error fetching users' });
  }

  res.json(users);
};

// Promote a user to a new role (admin or user)
exports.promoteUser = async (req, res) => {
  const { role } = req.user;

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can promote users' });
  }

  const { userid, newRole } = req.body;  // Expect userid and the new role (e.g., 'user' or 'admin')

  if (!userid || !newRole) {
    return res.status(400).json({ message: 'User ID and new role are required' });
  }

  if (newRole !== 'user' && newRole !== 'admin') {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const { data, error } = await supabase
    .from('sample')
    .update({ role: newRole })
    .eq('userid', userid)
    .select(); // Return updated user data

  if (error) {
    return res.status(500).json({ message: 'Error promoting user' });
  }

  res.json({ message: 'User promoted successfully', user: data[0] });
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { role } = req.user;

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can delete users' });
  }

  const { userid } = req.body;  // Expect userid of the user to delete

  if (!userid) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const { error } = await supabase
    .from('sample')
    .delete()
    .eq('userid', userid);

  if (error) {
    return res.status(500).json({ message: 'Error deleting user' });
  }

  res.json({ message: 'User deleted successfully' });
};