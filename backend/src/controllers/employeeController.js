const Employee = require('../models/Employee');

const addEmployee = async (req, res) => {
  try {
    const { fullName, fatherName, phone, cnic, department, address, joiningDate, status } = req.body;

    const existingEmployee = await Employee.findOne({
      $or: [{ phone }, { cnic }]
    });

    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: 'Employee with this phone or CNIC already exists'
      });
    }

    const newEmployee = new Employee({
      fullName,
      fatherName,
      phone,
      cnic,
      department: department || 'General',
      address: address || '',
      joiningDate: joiningDate || Date.now(),
      status: status || 'active',
    });

    await newEmployee.save();

    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      employee: newEmployee
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: error.errors
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const { search, department, status: empStatus, page = 1, limit = 50 } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { cnic: { $regex: search, $options: 'i' } },
        { fatherName: { $regex: search, $options: 'i' } },
      ];
    }

    if (department) query.department = department;
    if (empStatus) query.status = empStatus;

    const total = await Employee.countDocuments(query);
    const employees = await Employee.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      employees,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    res.json({
      success: true,
      employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { fullName, fatherName, phone, cnic, department, address, joiningDate, status } = req.body;

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    if (phone && phone !== employee.phone) {
      const phoneExists = await Employee.findOne({ phone, _id: { $ne: req.params.id } });
      if (phoneExists) {
        return res.status(409).json({
          success: false,
          message: 'Phone number already in use'
        });
      }
    }

    if (cnic && cnic !== employee.cnic) {
      const cnicExists = await Employee.findOne({ cnic, _id: { $ne: req.params.id } });
      if (cnicExists) {
        return res.status(409).json({
          success: false,
          message: 'CNIC already in use'
        });
      }
    }

    if (fullName) employee.fullName = fullName;
    if (fatherName) employee.fatherName = fatherName;
    if (phone) employee.phone = phone;
    if (cnic) employee.cnic = cnic;
    if (department) employee.department = department;
    if (address !== undefined) employee.address = address;
    if (joiningDate) employee.joiningDate = joiningDate;
    if (status) employee.status = status;

    await employee.save();

    res.json({
      success: true,
      message: 'Employee updated successfully',
      employee
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: error.errors
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

module.exports = {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};