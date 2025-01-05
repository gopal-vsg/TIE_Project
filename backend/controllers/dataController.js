const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Add a new booking
exports.addBooking = async (req, res) => {
  const { role } = req.user; // Extract role from decoded JWT in middleware
  const { customer_name, room_number, check_in_date, check_out_date, property_id, total_pax, room_type, no_of_rooms, mobile_no, email_id, tariff, market_segment, business_source, advance_payment, payment_mode, special_instructions} = req.body;

  // Allow only users or admins to insert data
  if (role !== 'user' && role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Only users or admins can add bookings.' });
  }

  const { data, error } = await supabase
    .from('bookings') // Ensure the table name is 'bookings'
    .insert([{ customer_name, room_number, check_in_date, check_out_date,  property_id, total_pax, room_type, no_of_rooms, mobile_no, email_id, tariff, market_segment, business_source, advance_payment, payment_mode, special_instructions}]);

  if (error) {
    return res.status(500).json({ message: 'Error adding booking', error });
  }

  res.status(201).json({ message: 'Booking added successfully', data });
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*');

  if (error) {
    return res.status(500).json({ message: 'Error fetching bookings', error });
  }

  // Format the dates
  const formattedData = data.map((booking) => ({
    ...booking,
    check_in_date: formatDate(booking.check_in_date),
    check_out_date: formatDate(booking.check_out_date),
  }));

  res.status(200).json({ message: 'Bookings retrieved successfully', data: formattedData });
};

// Get a single booking by ID
exports.getBookingById = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('booking_id', id)
    .single();

  if (error) {
    return res.status(404).json({ message: 'Booking not found', error });
  }

  // Format the dates
  const formattedData = {
    ...data,
    check_in_date: formatDate(data.check_in_date),
    check_out_date: formatDate(data.check_out_date),
  };

  res.status(200).json({ message: 'Booking retrieved successfully', data: formattedData });
};

// Update a booking
exports.updateBooking = async (req, res) => {
  const { role } = req.user; // Extract role from decoded JWT in middleware
  const { id } = req.params;
  const { customer_name, room_number, check_in_date, check_out_date, created_at, property_id, total_pax, room_type, no_of_rooms, mobile_no, email_id, tariff, market_segment, business_source, advance_payment, payment_mode, special_instructions, booking_id } = req.body;

  // Allow only admins to update data
  if (role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Only admins can update bookings.' });
  }

  const { data, error } = await supabase
    .from('bookings') // Ensure the table name is 'bookings'
    .update({ customer_name, room_number, check_in_date, check_out_date, created_at, property_id, total_pax, room_type, no_of_rooms, mobile_no, email_id, tariff, market_segment, business_source, advance_payment, payment_mode, special_instructions, booking_id })
    .eq('booking_id', id); // Assuming 'booking_id' is the primary key column

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
    .from('bookings') // Ensure the table name is 'bookings'
    .delete()
    .eq('booking_id', id); // Assuming 'booking_id' is the primary key column

  if (error) {
    return res.status(500).json({ message: 'Error deleting booking', error });
  }

  res.status(200).json({ message: 'Booking deleted successfully', data });
};

// Get user by name
exports.getUserByName = async (req, res) => {
  const { name } = req.params; // Get the name from the request parameter

  // Query the database for the user with the given name
  const { data, error } = await supabase
    .from('bookings') // Replace 'users' with the correct table name if different
    .select('*')
    .ilike('customer_name', `%${name}%`); // Use 'ilike' for case-insensitive partial matching

  if (error) {
    return res.status(500).json({ message: 'Error retrieving user', error });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Format the dates for each booking
  const formattedData = data.map((booking) => ({
    ...booking,
    check_in_date: formatDate(booking.check_in_date),
    check_out_date: formatDate(booking.check_out_date),
  }));

  res.status(200).json({ message: 'User retrieved successfully', data: formattedData });
};

