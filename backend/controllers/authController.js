const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Login Function
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

// Protected Data Function
exports.getProtectedData = (req, res) => {
  const { role } = req.user;
  if (role === 'admin') {
    return res.json({ message: 'Welcome Admin' });
  } else if (role === 'user') {
    return res.json({ message: 'Welcome User' });
  }
  res.status(403).json({ message: 'Access Denied' });
};
