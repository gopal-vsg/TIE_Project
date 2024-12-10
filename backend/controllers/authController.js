const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Signup Function (No user existence check)
exports.signupUser = async (req, res) => {
  const { userid, password } = req.body;

  // Check if the user already exists
  const { data: existingUser, error: checkError } = await supabase
    .from('sample')
    .select('*')
    .eq('userid', userid)
    .single();

  if (checkError) {
    return res.status(500).json({ message: 'Error checking user existence' });
  }

  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

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
