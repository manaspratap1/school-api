const db = require('../db');

function calculateDistance(lat1, lon1, lat2, lon2) {
  try {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) *
              Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  } catch (error) {
    throw new Error('Error calculating distance: ' + error.message);
  }
}

const addSchool = (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ message: 'Invalid input: name, address, latitude, and longitude are required.' });
    }

    const sql = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, address, latitude, longitude], (err, result) => {
      if (err) {
        console.error('Database insert error:', err);
        return res.status(500).json({ message: 'Database error while adding school', error: err.message });
      }
      res.status(201).json({ message: 'School added successfully', id: result.insertId });
    });
  } catch (error) {
    console.error('Unexpected error in addSchool:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const listSchools = (req, res) => {
  try {
    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);

    if (isNaN(userLat) || isNaN(userLon)) {
      return res.status(400).json({ message: 'Invalid coordinates: latitude and longitude must be numbers.' });
    }

    db.query('SELECT * FROM schools', (err, results) => {
      if (err) {
        console.error('Database fetch error:', err);
        return res.status(500).json({ message: 'Database error while fetching schools', error: err.message });
      }

      try {
        const sorted = results.map(school => {
          const distance = calculateDistance(userLat, userLon, school.latitude, school.longitude);
          return { ...school, distance };
        }).sort((a, b) => a.distance - b.distance);

        res.json(sorted);
      } catch (error) {
        console.error('Distance calculation error:', error);
        res.status(500).json({ message: 'Error calculating distances', error: error.message });
      }
    });
  } catch (error) {
    console.error('Unexpected error in listSchools:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { listSchools, addSchool };
