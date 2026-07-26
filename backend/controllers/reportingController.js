const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Invoice = require('../models/Invoice');
const Patient = require('../models/Patient');
const User = require('../models/User');
const Consultation = require('../models/Consultation');
const { ROLES } = require('../constants/roles');

// Helper to parse date range from query params
const getDateRange = (startDate, endDate) => {
    let start, end;
    if (startDate && endDate) {
        start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
    } else {
        // Default to last 30 days if no dates provided
        end = new Date();
        end.setHours(23, 59, 59, 999);
        start = new Date();
        start.setDate(start.getDate() - 30);
        start.setHours(0, 0, 0, 0);
    }
    return { start, end };
};

// Helper to convert month number to short month name (e.g., 8 -> 'Aug')
const getMonthName = (monthNumber) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNumber - 1] || 'Jan';
};

// @desc    8.1 Get Clinic Performance Dashboard Summary
// @route   GET /api/reports/performance
// @access  Private (Admin, Receptionist)
exports.getClinicPerformanceDashboard = async (req, res) => {
    try {
        const { start, end } = getDateRange(req.query.startDate, req.query.endDate);

        // 1. Patient Volume Metrics
        const newPatientsCount = await Patient.countDocuments({
            createdAt: { $gte: start, $lte: end }
        });

        const totalAppointmentsCount = await Appointment.countDocuments({
            appointmentDate: { $gte: start, $lte: end }
        });

        const completedAppointmentsCount = await Appointment.countDocuments({
            appointmentDate: { $gte: start, $lte: end },
            status: 'completed'
        });

        const completionRateVal = totalAppointmentsCount > 0 
            ? Number(((completedAppointmentsCount / totalAppointmentsCount) * 100).toFixed(1))
            : 0;

        // 2. Revenue & Billing Metrics
        const revenueStats = await Invoice.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end },
                    status: { $ne: 'Cancelled' }
                }
            },
            {
                $group: {
                    _id: null,
                    totalBilled: { $sum: '$billingDetails.grandTotal' },
                    totalCollected: { $sum: '$billingDetails.amountPaid' },
                    outstandingDues: { $sum: '$billingDetails.amountDue' },
                    discountsGiven: { $sum: '$billingDetails.discount' },
                    taxCollected: { $sum: '$billingDetails.tax' }
                }
            }
        ]);

        const financialOverview = revenueStats[0] ? {
            totalBilled: Math.round(revenueStats[0].totalBilled),
            totalCollected: Math.round(revenueStats[0].totalCollected),
            outstandingDues: Math.round(revenueStats[0].outstandingDues),
            discountsGiven: Math.round(revenueStats[0].discountsGiven),
            taxCollected: Math.round(revenueStats[0].taxCollected)
        } : {
            totalBilled: 0,
            totalCollected: 0,
            outstandingDues: 0,
            discountsGiven: 0,
            taxCollected: 0
        };

        // 3. Payment Methods Breakdown (Formatted as object: { cash, card, upi, online })
        const paymentStats = await Invoice.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end },
                    status: { $ne: 'Cancelled' }
                }
            },
            { $unwind: '$paymentHistory' },
            {
                $match: {
                    'paymentHistory.date': { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: { $toLower: '$paymentHistory.method' },
                    totalAmount: { $sum: '$paymentHistory.amount' }
                }
            }
        ]);

        const paymentBreakdown = {
            cash: 0,
            card: 0,
            upi: 0,
            online: 0
        };

        paymentStats.forEach(item => {
            if (item._id in paymentBreakdown) {
                paymentBreakdown[item._id] = Math.round(item.totalAmount);
            }
        });

        // 4. Doctor Leaderboard
        const doctorLeaderboard = await Appointment.aggregate([
            {
                $match: {
                    appointmentDate: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: '$doctorId',
                    consultations: { $sum: 1 },
                    completed: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    },
                    cancelled: {
                        $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'doctorInfo'
                }
            },
            { $unwind: { path: '$doctorInfo', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    doctorId: '$_id',
                    doctorName: '$doctorInfo.name',
                    consultations: 1,
                    completed: 1,
                    cancelled: 1,
                    _id: 0
                }
            },
            { $sort: { consultations: -1 } }
        ]);

        // 5. Daily Revenue Trend
        const dailyRevenueTrend = await Invoice.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end },
                    status: { $ne: 'Cancelled' }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    billed: { $sum: '$billingDetails.grandTotal' },
                    collected: { $sum: '$billingDetails.amountPaid' }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    date: '$_id',
                    billed: { $round: ['$billed', 0] },
                    collected: { $round: ['$collected', 0] },
                    _id: 0
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                patientVolume: {
                    newPatients: newPatientsCount,
                    appointments: totalAppointmentsCount,
                    completedConsultations: completedAppointmentsCount,
                    completionRate: completionRateVal
                },
                financialOverview,
                paymentBreakdown,
                doctorLeaderboard,
                dailyRevenueTrend
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    8.2 Get Doctor-wise Performance Report
// @route   GET /api/reports/doctor-wise
// @access  Private (Admin, Receptionist, Doctor)
exports.getDoctorWiseReport = async (req, res) => {
    try {
        const { start, end } = getDateRange(req.query.startDate, req.query.endDate);
        const { doctorId } = req.query;

        // Doctors automatically receive only their own data
        const targetDoctorId = req.user.role === ROLES.DOCTOR ? req.user._id.toString() : doctorId;

        const matchStage = {
            appointmentDate: { $gte: start, $lte: end }
        };

        if (targetDoctorId && mongoose.Types.ObjectId.isValid(targetDoctorId)) {
            matchStage.doctorId = new mongoose.Types.ObjectId(targetDoctorId);
        }

        const report = await Appointment.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$doctorId',
                    appointments: { $sum: 1 },
                    completed: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    },
                    checkedIn: {
                        $sum: { $cond: [{ $eq: ['$status', 'checked-in'] }, 1, 0] }
                    },
                    cancelled: {
                        $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
                    },
                    noShow: {
                        $sum: { $cond: [{ $eq: ['$status', 'no-show'] }, 1, 0] }
                    },
                    totalDurationMinutes: { $sum: '$duration' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'doctor'
                }
            },
            { $unwind: { path: '$doctor', preserveNullAndEmptyArrays: true } },
            // Lookup revenue generated by this doctor from invoices
            {
                $lookup: {
                    from: 'invoices',
                    let: { docId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $gte: ['$createdAt', start] },
                                        { $lte: ['$createdAt', end] },
                                        { $ne: ['$status', 'Cancelled'] }
                                    ]
                                }
                            }
                        },
                        { $unwind: '$items' },
                        {
                            $match: {
                                'items.type': 'Consultation'
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                revenueGenerated: { $sum: '$items.total' }
                            }
                        }
                    ],
                    as: 'revenueData'
                }
            },
            { $unwind: { path: '$revenueData', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    doctorId: '$_id',
                    doctorName: '$doctor.name',
                    appointments: 1,
                    checkedIn: 1,
                    completed: 1,
                    cancelled: 1,
                    noShow: 1,
                    totalDurationHours: { $round: [{ $divide: ['$totalDurationMinutes', 60] }, 0] },
                    completionRate: {
                        $cond: [
                            { $gt: ['$appointments', 0] },
                            { $round: [{ $multiply: [{ $divide: ['$completed', '$appointments'] }, 100] }, 1] },
                            0
                        ]
                    },
                    revenueGenerated: { $round: [{ $ifNull: ['$revenueData.revenueGenerated', 0] }, 0] },
                    _id: 0
                }
            },
            { $sort: { appointments: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    8.2 Get Service-wise Revenue Report
// @route   GET /api/reports/service-wise
// @access  Private (Admin, Receptionist)
exports.getServiceWiseReport = async (req, res) => {
    try {
        const { start, end } = getDateRange(req.query.startDate, req.query.endDate);
        const { serviceType } = req.query; // 'Consultation', 'Procedure', 'Pharmacy', 'Other'

        const matchStage = {
            createdAt: { $gte: start, $lte: end },
            status: { $ne: 'Cancelled' }
        };

        const itemMatchStage = {};
        if (serviceType && ['Consultation', 'Procedure', 'Pharmacy', 'Other'].includes(serviceType)) {
            itemMatchStage['items.type'] = serviceType;
        }

        const itemsReport = await Invoice.aggregate([
            { $match: matchStage },
            { $unwind: '$items' },
            { $match: itemMatchStage },
            {
                $group: {
                    _id: {
                        type: '$items.type',
                        description: '$items.description'
                    },
                    quantitySold: { $sum: '$items.quantity' },
                    revenue: { $sum: '$items.total' }
                }
            },
            {
                $project: {
                    itemName: '$_id.description',
                    serviceType: '$_id.type',
                    quantitySold: 1,
                    revenue: { $round: ['$revenue', 0] },
                    _id: 0
                }
            },
            { $sort: { revenue: -1 } }
        ]);

        const totalVolume = itemsReport.reduce((acc, curr) => acc + curr.quantitySold, 0);
        const totalRevenue = itemsReport.reduce((acc, curr) => acc + curr.revenue, 0);

        res.status(200).json({
            success: true,
            summary: {
                totalVolume,
                totalRevenue
            },
            items: itemsReport
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    8.2 Get Financial Summary Report
// @route   GET /api/reports/financials
// @access  Private (Admin, Receptionist)
exports.getFinancialSummaryReport = async (req, res) => {
    try {
        const { start, end } = getDateRange(req.query.startDate, req.query.endDate);

        // Invoice Status Breakdown
        const invoiceStatus = await Invoice.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalBilled: { $sum: '$billingDetails.grandTotal' },
                    paidAmount: { $sum: '$billingDetails.amountPaid' },
                    dueAmount: { $sum: '$billingDetails.amountDue' }
                }
            },
            {
                $project: {
                    status: '$_id',
                    count: 1,
                    totalBilled: { $round: ['$totalBilled', 0] },
                    paidAmount: { $round: ['$paidAmount', 0] },
                    dueAmount: { $round: ['$dueAmount', 0] },
                    _id: 0
                }
            }
        ]);

        // Insurance Claims Breakdown
        const insuranceClaims = await Invoice.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end },
                    'insuranceDetails.provider': { $exists: true, $ne: '' }
                }
            },
            {
                $group: {
                    _id: '$insuranceDetails.claimStatus',
                    count: { $sum: 1 },
                    claimedAmount: { $sum: '$insuranceDetails.claimAmount' }
                }
            },
            {
                $project: {
                    status: '$_id',
                    count: 1,
                    claimedAmount: { $round: ['$claimedAmount', 0] },
                    _id: 0
                }
            }
        ]);

        res.status(200).json({
            success: true,
            invoiceStatus,
            insuranceClaims
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    8.2 Get Patient Demographics Report
// @route   GET /api/reports/demographics
// @access  Private (Admin, Receptionist)
exports.getPatientDemographicsReport = async (req, res) => {
    try {
        // Gender Distribution
        const genderDistribution = await Patient.aggregate([
            {
                $group: {
                    _id: { $ifNull: ['$gender', 'Other'] },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    gender: '$_id',
                    count: 1,
                    _id: 0
                }
            }
        ]);

        // Blood Group Distribution
        const bloodGroupDistribution = await Patient.aggregate([
            {
                $match: { bloodGroup: { $exists: true, $ne: '' } }
            },
            {
                $group: {
                    _id: '$bloodGroup',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    bloodGroup: '$_id',
                    count: 1,
                    _id: 0
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Acquisition Trend (Last 6 months grouped by month name e.g., 'Aug', 'Sep')
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const monthlyGrowth = await Patient.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    patients: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const acquisitionTrend = monthlyGrowth.map(item => ({
            month: getMonthName(item._id.month),
            patients: item.patients
        }));

        res.status(200).json({
            success: true,
            genderDistribution,
            bloodGroupDistribution,
            acquisitionTrend
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
