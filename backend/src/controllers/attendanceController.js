const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

const getTodayDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const markAttendance = async (req, res) => {
  try {
    const { employeeId, status, timeIn, timeOut, notes } = req.body;
    const date = getTodayDate();

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const existing = await Attendance.findOne({ employee: employeeId, date });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Attendance already marked for this employee today'
      });
    }

    const attendance = await Attendance.create({
      employee: employeeId,
      date,
      status,
      timeIn: timeIn || '',
      timeOut: timeOut || '',
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      attendance
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getTodayAttendance = async (req, res) => {
  try {
    const date = getTodayDate();
    const attendanceRecords = await Attendance.find({ date })
      .populate('employee', 'fullName fatherName phone department photo')
      .sort({ createdAt: -1 });

    const allEmployees = await Employee.find({ status: 'active' })
      .select('fullName fatherName phone department photo')
      .sort({ fullName: 1 });

    const markedIds = attendanceRecords.map(a => a.employee?._id?.toString()).filter(Boolean);

    const unmarkedEmployees = allEmployees.filter(
      e => !markedIds.includes(e._id.toString())
    );

    res.json({
      success: true,
      date,
      attendanceRecords,
      unmarkedEmployees,
      stats: {
        total: allEmployees.length,
        marked: attendanceRecords.length,
        unmarked: unmarkedEmployees.length,
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { status, timeIn, timeOut, notes } = req.body;
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    if (status) attendance.status = status;
    if (timeIn !== undefined) attendance.timeIn = timeIn;
    if (timeOut !== undefined) attendance.timeOut = timeOut;
    if (notes !== undefined) attendance.notes = notes;

    await attendance.save();

    res.json({
      success: true,
      message: 'Attendance updated successfully',
      attendance
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getEmployeeHistory = async (req, res) => {
  try {
    const { month, year } = req.query;
    const employeeId = req.params.id;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    let query = { employee: employeeId };

    if (month && year) {
      const m = String(month).padStart(2, '0');
      query.date = { $regex: `^${year}-${m}` };
    }

    const records = await Attendance.find(query)
      .sort({ date: -1 })
      .limit(30);

    const totalDays = records.length;
    const presentDays = records.filter(r => r.status === 'present').length;
    const absentDays = records.filter(r => r.status === 'absent').length;
    const lateDays = records.filter(r => r.status === 'late').length;
    const leaveDays = records.filter(r => r.status === 'leave').length;
    const halfDays = records.filter(r => r.status === 'half-day').length;
    const holidayDays = records.filter(r => r.status === 'holiday').length;

    const workingDays = totalDays - holidayDays;
    const attendancePercentage = workingDays > 0
      ? Math.round(((presentDays + lateDays) / workingDays) * 100)
      : 0;

    res.json({
      success: true,
      employee: {
        id: employee._id,
        fullName: employee.fullName,
        fatherName: employee.fatherName,
        phone: employee.phone,
        department: employee.department,
        photo: employee.photo,
      },
      records,
      summary: {
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        leaveDays,
        halfDays,
        holidayDays,
        workingDays,
        attendancePercentage,
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getMonthlyReport = async (req, res) => {
  try {
    const { month, year, department, status: attStatus } = req.query;

    if (!month || !year) {
      return res.status(400).json({ success: false, message: 'Month and year are required' });
    }

    const m = String(month).padStart(2, '0');
    const dateRegex = `^${year}-${m}`;

    let employeeQuery = {};
    if (department) employeeQuery.department = department;

    const employees = await Employee.find(employeeQuery).select('_id fullName fatherName department phone');

    let attendanceQuery = { date: { $regex: dateRegex } };
    if (attStatus) attendanceQuery.status = attStatus;
    if (department) {
      const deptEmployeeIds = employees.map(e => e._id);
      attendanceQuery.employee = { $in: deptEmployeeIds };
    }

    const records = await Attendance.find(attendanceQuery)
      .populate('employee', 'fullName fatherName department phone')
      .sort({ date: -1 });

    const totalEmployees = employees.length;
    const totalWorkingDays = [...new Set(records.map(r => r.date))].length;

    const departmentStats = {};
    let totalPresent = 0, totalAbsent = 0, totalLate = 0, totalLeave = 0, totalHalfDay = 0;

    records.forEach(r => {
      const dept = r.employee?.department || 'General';
      if (!departmentStats[dept]) {
        departmentStats[dept] = { present: 0, absent: 0, late: 0, leave: 0, 'half-day': 0 };
      }
      if (departmentStats[dept][r.status] !== undefined) {
        departmentStats[dept][r.status]++;
      }
      if (r.status === 'present') totalPresent++;
      else if (r.status === 'absent') totalAbsent++;
      else if (r.status === 'late') totalLate++;
      else if (r.status === 'leave') totalLeave++;
      else if (r.status === 'half-day') totalHalfDay++;
    });

    res.json({
      success: true,
      month: Number(month),
      year: Number(year),
      summary: {
        totalEmployees,
        totalWorkingDays,
        totalPresent,
        totalAbsent,
        totalLate,
        totalLeave,
        totalHalfDay,
        totalRecords: records.length,
      },
      departmentStats,
      records,
      employees,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  markAttendance,
  getTodayAttendance,
  updateAttendance,
  getEmployeeHistory,
  getMonthlyReport,
};