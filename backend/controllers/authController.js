const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Signup Function
exports.signupUser = async (req, res) => {
  const { userid, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    // Check if the user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('sample')
      .select('*')
      .eq('userid', userid)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // Handle any unexpected errors (except "no rows found")
      console.error('Error fetching user:', fetchError);
      return res.status(500).json({ message: 'Error checking for existing user' });
    }

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }


    // Insert the new user with hashed password
    const { data: newUser, error: insertError } = await supabase
      .from('sample')
      .insert([
        {
          userid,
          password: hashedPassword, // Store hashed password
          role: 'pending', // Set default role
        }
      ])
      .select(); // Ensure we get the inserted user data back

    if (insertError) {
      return res.status(500).json({ message: 'Error creating user' });
    }

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
  } catch (err) {
    res.status(500).json({ message: 'Error during signup', error: err.message });
  }
};

// Login Function
exports.loginUser = async (req, res) => {
  const { userid, password } = req.body;

  try {
    const { data: user, error } = await supabase
      .from('sample')
      .select('*')
      .eq('userid', userid)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the hashed password with the plain text password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userid: user.userid, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error during login', error: err.message });
  }
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