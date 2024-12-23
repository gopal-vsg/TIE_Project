const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Add a new booking
exports.addBooking = async (req, res) => {
  const { role } = req.user; // Extract role from decoded JWT in middleware
  const { name, pax, hotel, room_no, pay_status } = req.body;

  // Allow only users or admins to insert data
  if (role !== 'user' && role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Only users or admins can add bookings.' });
  }
  //c'mon man you are 
  const { data, error } = await supabase
    .from('sample_data')
    .insert([{ name, pax, hotel, room_no, pay_status }]);

  if (error) {
    return res.status(500).json({ message: 'Error adding booking', error });
  }

  res.status(201).json({ message: 'Booking added successfully', data });
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  const { data, error } = await supabase
    .from('sample_data')
    .select('*');

  if (error) {
    return res.status(500).json({ message: 'Error fetching bookings', error });
  }

  res.status(200).json({ message: 'Bookings retrieved successfully', data });
};

// Get a single booking by ID
exports.getBookingById = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('sample_data')
    .select('*')
    .eq('booking_id', id)
    .single();

  if (error) {
    return res.status(404).json({ message: 'Booking not found', error });
  }

  res.status(200).json({ message: 'Booking retrieved successfully', data });
};

// Update a booking
exports.updateBooking = async (req, res) => {
  const { role } = req.user; // Extract role from decoded JWT in middleware
  const { id } = req.params;
  const { name, pax, hotel, room_no, pay_status } = req.body;

  // Allow only admins to update data
  if (role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Only admins can update bookings.' });
  }

  const { data, error } = await supabase
    .from('sample_data')
    .update({ name, pax, hotel, room_no, pay_status })
    .eq('booking_id', id);

  if (error) {
    return res.status(500).json({ message: 'Error updating booking', error });
  }

  res.status(200).json({ message: 'Booking updated successfully', data });
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  const { role } = req.user; // Extract role from decoded JWT in middleware
  const { id } = req.params;

  // Allow only admins to delete data
  if (role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Only admins can delete bookings.' });
  }

  const { data, error } = await supabase
    .from('sample_data')
    .delete()
    .eq('booking_id', id);

  if (error) {
    return res.status(500).json({ message: 'Error deleting booking', error });
  }

  res.status(200).json({ message: 'Booking deleted successfully', data });
};
