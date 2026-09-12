const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');

const getTodayDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments({ status: 'active' });
    const date = getTodayDate();

    const todayRecords = await Attendance.find({ date });
    const presentCount = todayRecords.filter(r => r.status === 'present').length;
    const absentCount = todayRecords.filter(r => r.status === 'absent').length;
    const lateCount = todayRecords.filter(r => r.status === 'late').length;
    const leaveCount = todayRecords.filter(r => r.status === 'leave').length;
    const halfDayCount = todayRecords.filter(r => r.status === 'half-day').length;
    const holidayCount = todayRecords.filter(r => r.status === 'holiday').length;
    const unmarkedCount = totalEmployees - todayRecords.length;

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayStr = `${firstDay.getFullYear()}-${String(firstDay.getMonth() + 1).padStart(2, '0')}-${String(firstDay.getDate()).padStart(2, '0')}`;

    const monthRecords = await Attendance.find({
      date: { $gte: firstDayStr, $lte: date }
    });

    const monthTotal = monthRecords.length;
    const monthPresent = monthRecords.filter(r => r.status === 'present' || r.status === 'late').length;
    const monthlyAttendancePercent = monthTotal > 0
      ? Math.round((monthPresent / monthTotal) * 100)
      : 0;

    const recentAttendance = await Attendance.find()
      .populate('employee', 'fullName fatherName department photo')
      .sort({ createdAt: -1 })
      .limit(10);

    const departmentDistribution = await Employee.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      stats: {
        totalEmployees,
        todayPresent: presentCount,
        todayAbsent: absentCount,
        todayLate: lateCount,
        todayLeave: leaveCount,
        todayHalfDay: halfDayCount,
        todayHoliday: holidayCount,
        todayUnmarked: unmarkedCount,
        todayTotal: todayRecords.length,
        monthlyAttendancePercent,
        monthTotalRecords: monthTotal,
      },
      recentAttendance,
      departmentDistribution,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getDashboardStats };