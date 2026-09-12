const express = require('express');
const router = express.Router();

const {
  markAttendance,
  getTodayAttendance,
  updateAttendance,
  getEmployeeHistory,
  getMonthlyReport,
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/today', getTodayAttendance);
router.post('/mark', markAttendance);
router.put('/:id', updateAttendance);
router.get('/employee/:id', getEmployeeHistory);
router.get('/reports/monthly', getMonthlyReport);

module.exports = router;