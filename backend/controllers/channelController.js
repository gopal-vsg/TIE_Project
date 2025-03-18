const fs = require('fs');
const XLSX = require('xlsx');
const { supabase } = require('../supabaseClient'); // Adjust the path as needed

exports.uploadChannelBookings = async (req, res) => {
  try {
    // Multer stores the uploaded file's path in req.file.path
    const filePath = req.file.path;

    // Read the file using SheetJS
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Map each row to your channel booking schema
    const bookingsData = jsonData.map(row => ({
      booking_reference: row['Booking Id'],
      report_date: row['Report Date'] ? new Date(row['Report Date']) : null,
      booking_date: row['Booking Date'] ? new Date(row['Booking Date']) : null,
      booking_source: row['Booking Source'] || null,
      guest_name: row['Guest Name'] || null,
      guest_phone: row['Guest Phone'] || null,
      check_in: row['Check In'] ? new Date(row['Check In']) : null,
      check_out: row['Check Out'] ? new Date(row['Check Out']) : null,
      total_amount: row['Total Amount'] ? parseFloat(row['Total Amount']) : null,
      advance: row['Advance'] ? parseFloat(row['Advance']) : null,
      adults_children_infant: row['Adults / Children / Infant'] || null,
      room_no: row['Room No'] || null,
      amt_without_tax: row['AMT Without Tax'] ? parseFloat(row['AMT Without Tax']) : null,
      tax: row['Tax'] ? parseFloat(row['Tax']) : null,
      room_type: row['Room Type'] || null,
      breakfast: row['Breakfast'] || null,
      // Additional fields provided from the form
      property_id: req.body.property_id,
      channel_id: req.body.channel_id
    }));

    // Loop through each booking and upsert into the channel_bookings table
    for (const booking of bookingsData) {
      const { error } = await supabase
        .from('channel_bookings')
        .upsert(booking, { onConflict: ['booking_reference', 'channel_id'] });
      if (error) {
        console.error('Error upserting booking:', error);
        // Optionally, accumulate errors to report back later
      }
    }

    // Remove the temporary file after processing
    fs.unlinkSync(filePath);

    res.status(200).json({ success: true, message: 'Channel bookings uploaded successfully.' });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, message: 'Error processing file upload', error: error.message });
  }
};
