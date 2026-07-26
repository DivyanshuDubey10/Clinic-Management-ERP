const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Load Mongoose Models
const User = require('./models/User');
const Patient = require('./models/Patient');
const Medicine = require('./models/Medicine');
const Appointment = require('./models/Appointment');
const Consultation = require('./models/Consultation');
const Invoice = require('./models/Invoice');
const ClinicSetting = require('./models/ClinicSetting');
const AuditLog = require('./models/AuditLog');
const DoctorAvailability = require('./models/DoctorAvailability');
const { ROLES } = require('./constants/roles');

// Sample Users (Passwords will be auto-hashed to 'password123' by User.js pre-save hook)
const usersData = [
    {
        name: 'Dr. Rajesh Sharma',
        email: 'dr.sharma@clinicerp.com',
        phone: '+919876543210',
        password: 'password123',
        role: ROLES.DOCTOR,
        specialization: 'Cardiology',
        consultationHours: '09:00 - 17:00',
        department: 'Cardiology',
        isActive: true
    },
    {
        name: 'Dr. Ananya Singh',
        email: 'dr.singh@clinicerp.com',
        phone: '+919876543211',
        password: 'password123',
        role: ROLES.DOCTOR,
        specialization: 'Pediatrics',
        consultationHours: '10:00 - 18:00',
        department: 'Pediatrics',
        isActive: true
    },
    {
        name: 'Dr. Vikram Mehta',
        email: 'dr.mehta@clinicerp.com',
        phone: '+919876543212',
        password: 'password123',
        role: ROLES.DOCTOR,
        specialization: 'General Medicine',
        consultationHours: '09:00 - 16:00',
        department: 'General Medicine',
        isActive: true
    },
    {
        name: 'Admin User',
        email: 'admin@clinicerp.com',
        phone: '+919876543213',
        password: 'password123',
        role: ROLES.ADMIN,
        isActive: true
    },
    {
        name: 'Sunita Rao (Reception Desk)',
        email: 'reception@clinicerp.com',
        phone: '+919876543214',
        password: 'password123',
        role: ROLES.RECEPTIONIST,
        isActive: true
    },
    {
        name: 'Amit Kumar (Patient Portal)',
        email: 'patient@clinicerp.com',
        phone: '+919876543215',
        password: 'password123',
        role: ROLES.PATIENT,
        isActive: true
    }
];

// Sample Patients
const patientsData = [
    {
        name: 'Amit Kumar',
        email: 'patient@clinicerp.com',
        phone: '+919876543215',
        dob: '1988-05-14',
        gender: 'Male',
        bloodGroup: 'B+',
        address: '45 MG Road, Bangalore, Karnataka',
        medicalHistory: ['Hypertension', 'Mild Asthma'],
        allergies: ['Penicillin', 'Peanuts']
    },
    {
        name: 'Priya Patel',
        email: 'priya.p@example.com',
        phone: '+919811122233',
        dob: '1992-09-20',
        gender: 'Female',
        bloodGroup: 'O+',
        address: '12 Park Street, Kolkata, West Bengal',
        medicalHistory: ['Hypothyroidism'],
        allergies: ['Dust', 'Pollen']
    },
    {
        name: 'Rohan Gupta',
        email: 'rohan.g@example.com',
        phone: '+919822233344',
        dob: '1975-11-03',
        gender: 'Male',
        bloodGroup: 'A+',
        address: '88 Marine Drive, Mumbai, Maharashtra',
        medicalHistory: ['Type 2 Diabetes', 'High Cholesterol'],
        allergies: ['Sulfa drugs']
    },
    {
        name: 'Sneha Verma',
        email: 'sneha.v@example.com',
        phone: '+919833344455',
        dob: '2001-02-18',
        gender: 'Female',
        bloodGroup: 'AB+',
        address: '34 Civil Lines, Delhi',
        medicalHistory: [],
        allergies: []
    },
    {
        name: 'Suresh Iyer',
        email: 'suresh.i@example.com',
        phone: '+919844455566',
        dob: '1965-07-25',
        gender: 'Male',
        bloodGroup: 'O-',
        address: '56 Anna Salai, Chennai, Tamil Nadu',
        medicalHistory: ['Coronary Artery Disease'],
        allergies: ['Aspirin']
    },
    {
        name: 'Kavita Nair',
        email: 'kavita.n@example.com',
        phone: '+919855566677',
        dob: '1995-12-11',
        gender: 'Female',
        bloodGroup: 'B-',
        address: '19 MG Road, Pune, Maharashtra',
        medicalHistory: ['Migraine'],
        allergies: ['Shellfish']
    },
    {
        name: 'Arjun Das',
        email: 'arjun.d@example.com',
        phone: '+919866677788',
        dob: '2010-04-05',
        gender: 'Male',
        bloodGroup: 'A+',
        address: '77 Sector 18, Noida, UP',
        medicalHistory: ['Childhood Asthma'],
        allergies: []
    },
    {
        name: 'Meera Chopra',
        email: 'meera.c@example.com',
        phone: '+919877788899',
        dob: '1982-08-30',
        gender: 'Female',
        bloodGroup: 'O+',
        address: '102 Jubilee Hills, Hyderabad, Telangana',
        medicalHistory: ['Anemia'],
        allergies: ['Latex']
    },
    {
        name: 'Alok Mishra',
        email: 'alok.m@example.com',
        phone: '+919888899900',
        dob: '1958-01-15',
        gender: 'Male',
        bloodGroup: 'B+',
        address: '14 Hazratganj, Lucknow, UP',
        medicalHistory: ['Osteoarthritis', 'Hypertension'],
        allergies: []
    },
    {
        name: 'Neha Sharma',
        email: 'neha.s@example.com',
        phone: '+919899900011',
        dob: '1998-06-22',
        gender: 'Female',
        bloodGroup: 'AB-',
        address: '65 Malviya Nagar, Jaipur, Rajasthan',
        medicalHistory: [],
        allergies: ['Ibuprofen']
    },
    {
        name: 'Deepak Joshi',
        email: 'deepak.j@example.com',
        phone: '+919900011122',
        dob: '1985-10-09',
        gender: 'Male',
        bloodGroup: 'A-',
        address: '23 Mall Road, Shimla, HP',
        medicalHistory: ['Kidney Stones'],
        allergies: []
    },
    {
        name: 'Anjali Desai',
        email: 'anjali.d@example.com',
        phone: '+919911122233',
        dob: '1990-03-27',
        gender: 'Female',
        bloodGroup: 'O+',
        address: '89 SG Highway, Ahmedabad, Gujarat',
        medicalHistory: ['PCOS'],
        allergies: ['Sulfa drugs']
    },
    {
        name: 'Manoj Tiwari',
        email: 'manoj.t@example.com',
        phone: '+919922233344',
        dob: '1972-12-01',
        gender: 'Male',
        bloodGroup: 'B+',
        address: '31 Station Road, Patna, Bihar',
        medicalHistory: ['Type 2 Diabetes'],
        allergies: []
    },
    {
        name: 'Pooja Bhatt',
        email: 'pooja.b@example.com',
        phone: '+919933344455',
        dob: '2005-09-17',
        gender: 'Female',
        bloodGroup: 'A+',
        address: '50 Ring Road, Surat, Gujarat',
        medicalHistory: [],
        allergies: ['Peanuts']
    },
    {
        name: 'Rajeshwar Singh',
        email: 'rajeshwar.s@example.com',
        phone: '+919944455566',
        dob: '1960-05-05',
        gender: 'Male',
        bloodGroup: 'O+',
        address: '15 Civil Lines, Allahabad, UP',
        medicalHistory: ['Hypertension', 'Glaucoma'],
        allergies: []
    }
];

// Sample Pharmacy Inventory (Medicines)
const medicinesData = [
    { name: 'Paracetamol 500mg', genericName: 'Acetaminophen', category: 'Tablet', manufacturer: 'Cipla Ltd', batchNumber: 'BATCH-P501', expiryDate: '2027-12-31', stockQuantity: 500, reorderThreshold: 50, unitPrice: 2, sellingPrice: 3 },
    { name: 'Amoxicillin 500mg', genericName: 'Amoxicillin Trihydrate', category: 'Capsule', manufacturer: 'Sun Pharma', batchNumber: 'BATCH-A502', expiryDate: '2028-06-30', stockQuantity: 300, reorderThreshold: 40, unitPrice: 8, sellingPrice: 12 },
    { name: 'Metformin 500mg', genericName: 'Metformin Hydrochloride', category: 'Tablet', manufacturer: 'USV Ltd', batchNumber: 'BATCH-M503', expiryDate: '2027-10-31', stockQuantity: 450, reorderThreshold: 60, unitPrice: 3, sellingPrice: 5 },
    { name: 'Atorvastatin 10mg', genericName: 'Atorvastatin Calcium', category: 'Tablet', manufacturer: 'Zydus Cadila', batchNumber: 'BATCH-AT10', expiryDate: '2028-03-31', stockQuantity: 250, reorderThreshold: 30, unitPrice: 10, sellingPrice: 15 },
    { name: 'Azithromycin 500mg', genericName: 'Azithromycin Dihydrate', category: 'Tablet', manufacturer: 'Alkem Labs', batchNumber: 'BATCH-AZ50', expiryDate: '2027-08-31', stockQuantity: 180, reorderThreshold: 25, unitPrice: 18, sellingPrice: 25 },
    { name: 'Ibuprofen 400mg', genericName: 'Ibuprofen', category: 'Tablet', manufacturer: 'Abbott India', batchNumber: 'BATCH-IB40', expiryDate: '2028-11-30', stockQuantity: 350, reorderThreshold: 50, unitPrice: 4, sellingPrice: 6 },
    { name: 'Omeprazole 20mg', genericName: 'Omeprazole', category: 'Capsule', manufacturer: 'Dr. Reddys', batchNumber: 'BATCH-OM20', expiryDate: '2027-09-30', stockQuantity: 400, reorderThreshold: 45, unitPrice: 6, sellingPrice: 9 },
    { name: 'Cetirizine 10mg', genericName: 'Cetirizine Hydrochloride', category: 'Tablet', manufacturer: 'GlaxoSmithKline', batchNumber: 'BATCH-CE10', expiryDate: '2028-05-31', stockQuantity: 600, reorderThreshold: 80, unitPrice: 2, sellingPrice: 4 },
    { name: 'Losartan 50mg', genericName: 'Losartan Potassium', category: 'Tablet', manufacturer: 'Torrent Pharma', batchNumber: 'BATCH-LO50', expiryDate: '2027-07-31', stockQuantity: 220, reorderThreshold: 30, unitPrice: 7, sellingPrice: 11 },
    { name: 'Pantoprazole 40mg', genericName: 'Pantoprazole Sodium', category: 'Tablet', manufacturer: 'Aristo Pharma', batchNumber: 'BATCH-PA40', expiryDate: '2028-01-31', stockQuantity: 320, reorderThreshold: 40, unitPrice: 8, sellingPrice: 12 },
    { name: 'Doxycycline 100mg', genericName: 'Doxycycline Hyclate', category: 'Capsule', manufacturer: 'Lupin Ltd', batchNumber: 'BATCH-DO10', expiryDate: '2027-11-30', stockQuantity: 200, reorderThreshold: 30, unitPrice: 9, sellingPrice: 14 },
    { name: 'Ciprofloxacin 500mg', genericName: 'Ciprofloxacin Hydrochloride', category: 'Tablet', manufacturer: 'Bayer Pharmaceuticals', batchNumber: 'BATCH-CI50', expiryDate: '2028-04-30', stockQuantity: 150, reorderThreshold: 20, unitPrice: 12, sellingPrice: 18 },
    { name: 'Aspirin 75mg', genericName: 'Acetylsalicylic Acid', category: 'Tablet', manufacturer: 'USV Ltd', batchNumber: 'BATCH-AS75', expiryDate: '2029-01-31', stockQuantity: 550, reorderThreshold: 70, unitPrice: 1, sellingPrice: 2 },
    { name: 'Levothyroxine 50mcg', genericName: 'Levothyroxine Sodium', category: 'Tablet', manufacturer: 'Abbott India', batchNumber: 'BATCH-LE50', expiryDate: '2028-08-31', stockQuantity: 280, reorderThreshold: 35, unitPrice: 5, sellingPrice: 8 },
    { name: 'Amlodipine 5mg', genericName: 'Amlodipine Besylate', category: 'Tablet', manufacturer: 'Pfizer', batchNumber: 'BATCH-AM05', expiryDate: '2027-05-31', stockQuantity: 420, reorderThreshold: 50, unitPrice: 3, sellingPrice: 5 },
    { name: 'Gabapentin 300mg', genericName: 'Gabapentin', category: 'Capsule', manufacturer: 'Sun Pharma', batchNumber: 'BATCH-GA30', expiryDate: '2028-09-30', stockQuantity: 160, reorderThreshold: 25, unitPrice: 15, sellingPrice: 22 },
    { name: 'Metoprolol 25mg', genericName: 'Metoprolol Succinate', category: 'Tablet', manufacturer: 'AstraZeneca', batchNumber: 'BATCH-ME25', expiryDate: '2027-10-31', stockQuantity: 310, reorderThreshold: 40, unitPrice: 6, sellingPrice: 10 },
    { name: 'Prednisone 10mg', genericName: 'Prednisone', category: 'Tablet', manufacturer: 'Wyeth', batchNumber: 'BATCH-PR10', expiryDate: '2028-02-28', stockQuantity: 190, reorderThreshold: 30, unitPrice: 4, sellingPrice: 7 },
    { name: 'Sertraline 50mg', genericName: 'Sertraline Hydrochloride', category: 'Tablet', manufacturer: 'Pfizer', batchNumber: 'BATCH-SE50', expiryDate: '2028-07-31', stockQuantity: 140, reorderThreshold: 20, unitPrice: 14, sellingPrice: 20 },
    { name: 'Montelukast 10mg', genericName: 'Montelukast Sodium', category: 'Tablet', manufacturer: 'Cipla Ltd', batchNumber: 'BATCH-MO10', expiryDate: '2027-12-31', stockQuantity: 360, reorderThreshold: 50, unitPrice: 7, sellingPrice: 11 }
];

// Main Seeder Function
const importData = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('❌ ERROR: MONGO_URI is missing in .env file!');
            process.exit(1);
        }

        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // 1. Clear Existing Test Data
        console.log('🗑️  Clearing old database records...');
        await User.deleteMany({});
        await Patient.deleteMany({});
        await Medicine.deleteMany({});
        await Appointment.deleteMany({});
        await Consultation.deleteMany({});
        await Invoice.deleteMany({});
        await ClinicSetting.deleteMany({});
        await AuditLog.deleteMany({});
        await DoctorAvailability.deleteMany({});

        // 2. Seed Users (Looping to ensure pre-save bcrypt hashing works smoothly)
        console.log('🌱 Seeding Users (Admin, Doctors, Receptionist, Patient)...');
        const createdUsers = [];
        for (const u of usersData) {
            const userDoc = await User.create(u);
            createdUsers.push(userDoc);
        }

        const drSharma = createdUsers.find(u => u.email === 'dr.sharma@clinicerp.com');
        const drSingh = createdUsers.find(u => u.email === 'dr.singh@clinicerp.com');
        const drMehta = createdUsers.find(u => u.email === 'dr.mehta@clinicerp.com');
        const adminUser = createdUsers.find(u => u.email === 'admin@clinicerp.com');
        const patientLoginUser = createdUsers.find(u => u.email === 'patient@clinicerp.com');

        // 3. Seed Doctor Availability
        console.log('🌱 Seeding Doctor Schedules & Availability...');
        const doctorsList = [drSharma, drSingh, drMehta];
        for (const doc of doctorsList) {
            if (!doc) continue;
            await DoctorAvailability.create({
                doctorId: doc._id,
                weeklySchedule: [
                    { dayOfWeek: 1, isAvailable: true, slots: [{ startTime: '09:00', endTime: '13:00' }, { startTime: '14:00', endTime: '17:00' }] },
                    { dayOfWeek: 2, isAvailable: true, slots: [{ startTime: '09:00', endTime: '13:00' }, { startTime: '14:00', endTime: '17:00' }] },
                    { dayOfWeek: 3, isAvailable: true, slots: [{ startTime: '09:00', endTime: '13:00' }, { startTime: '14:00', endTime: '17:00' }] },
                    { dayOfWeek: 4, isAvailable: true, slots: [{ startTime: '09:00', endTime: '13:00' }, { startTime: '14:00', endTime: '17:00' }] },
                    { dayOfWeek: 5, isAvailable: true, slots: [{ startTime: '09:00', endTime: '13:00' }, { startTime: '14:00', endTime: '17:00' }] },
                    { dayOfWeek: 6, isAvailable: true, slots: [{ startTime: '09:00', endTime: '13:00' }] },
                    { dayOfWeek: 0, isAvailable: false, slots: [] }
                ],
                slotDuration: 15,
                maxDailyAppointments: 30
            });
        }

        // 4. Seed Patients
        console.log('🌱 Seeding 15 Patient Records...');
        const createdPatients = [];
        for (let i = 0; i < patientsData.length; i++) {
            const pData = patientsData[i];
            const pObj = {
                ...pData,
                patientId: `PAT-2026-${String(i + 101).padStart(4, '0')}`,
                user: pData.email === 'patient@clinicerp.com' && patientLoginUser ? patientLoginUser._id : undefined
            };
            const pDoc = await Patient.create(pObj);
            createdPatients.push(pDoc);
        }

        // 5. Seed Pharmacy Inventory
        console.log('🌱 Seeding 20 Pharmacy Medicines...');
        const createdMedicines = await Medicine.insertMany(medicinesData);

        // 6. Seed Appointments, Consultations & Invoices (Past & Upcoming)
        console.log('🌱 Seeding Appointments, SOAP Consultations & Invoices...');
        const today = new Date();
        const pastDate1 = new Date(today); pastDate1.setDate(today.getDate() - 5);
        const pastDate2 = new Date(today); pastDate2.setDate(today.getDate() - 2);
        const futureDate1 = new Date(today); futureDate1.setDate(today.getDate() + 1);
        const futureDate2 = new Date(today); futureDate2.setDate(today.getDate() + 2);

        // Past Completed Appointment 1 -> Dr. Sharma
        const appt1 = await Appointment.create({
            patientId: createdPatients[0]._id,
            doctorId: drSharma._id,
            appointmentDate: pastDate1,
            timeSlot: '10:00 - 10:15',
            status: 'completed',
            type: 'General Consultation',
            reason: 'High blood pressure checkup',
            queueNumber: 1,
            duration: 15
        });

        const consult1 = await Consultation.create({
            appointmentId: appt1._id,
            patientId: createdPatients[0]._id,
            doctorId: drSharma._id,
            soapNotes: {
                subjective: 'Patient reports mild headache and occasional dizziness over the last 3 days.',
                objective: 'BP 150/95 mmHg, Heart rate 78 bpm. Lungs clear to auscultation.',
                assessment: 'Stage 2 Hypertension with mild tension headaches.',
                plan: 'Prescribed Amlodipine 5mg once daily. Recommended sodium reduction and daily 30-min brisk walk. Follow-up in 2 weeks.'
            },
            diagnosis: [
                { icdCode: 'I10', description: 'Essential (primary) hypertension', severity: 'Moderate' },
                { icdCode: 'R51', description: 'Headache', severity: 'Mild' }
            ],
            prescriptions: [
                {
                    medicineId: createdMedicines.find(m => m.name.includes('Amlodipine'))._id,
                    medicineName: 'Amlodipine 5mg',
                    dosage: '1 Tablet',
                    frequency: 'Once Daily (Morning after breakfast)',
                    duration: '14 Days',
                    quantity: 14,
                    instructions: 'Do not skip dose'
                },
                {
                    medicineId: createdMedicines.find(m => m.name.includes('Paracetamol'))._id,
                    medicineName: 'Paracetamol 500mg',
                    dosage: '1 Tablet',
                    frequency: 'As needed for severe headache (Max 3/day)',
                    duration: '5 Days',
                    quantity: 10,
                    instructions: 'Take after food'
                }
            ]
        });

        await Invoice.create({
            patientId: createdPatients[0]._id,
            appointmentId: appt1._id,
            consultationId: consult1._id,
            items: [
                { type: 'Consultation', description: 'Cardiology Consultation Fee - Dr. Rajesh Sharma', quantity: 1, unitPrice: 800, total: 800 },
                { type: 'Pharmacy', description: 'Amlodipine 5mg (14 Tabs)', quantity: 14, unitPrice: 5, total: 70 },
                { type: 'Pharmacy', description: 'Paracetamol 500mg (10 Tabs)', quantity: 10, unitPrice: 3, total: 30 }
            ],
            billingDetails: { subtotal: 900, discount: 50, tax: 45, grandTotal: 895, amountPaid: 895, amountDue: 0 },
            status: 'Paid',
            paymentHistory: [{ date: pastDate1, amount: 895, method: 'Card', transactionId: 'TXN-CARD-9001' }]
        });

        // Past Completed Appointment 2 -> Dr. Singh (Pediatrics)
        const appt2 = await Appointment.create({
            patientId: createdPatients[6]._id, // Arjun Das (child)
            doctorId: drSingh._id,
            appointmentDate: pastDate2,
            timeSlot: '11:30 - 11:45',
            status: 'completed',
            type: 'General Consultation',
            reason: 'Fever and seasonal cough',
            queueNumber: 3,
            duration: 15
        });

        const consult2 = await Consultation.create({
            appointmentId: appt2._id,
            patientId: createdPatients[6]._id,
            doctorId: drSingh._id,
            soapNotes: {
                subjective: 'Mother reports child has had low-grade fever (100.4 F) and dry cough since yesterday evening.',
                objective: 'Temp 100.2 F, Throat slightly erythemic. Chest auscultation bilateral clear.',
                assessment: 'Acute upper respiratory tract infection (Viral pharyngitis).',
                plan: 'Prescribed Paracetamol syrup/tablet and Cetirizine for allergic cough relief. Plenty of warm fluids.'
            },
            diagnosis: [
                { icdCode: 'J06.9', description: 'Acute upper respiratory infection, unspecified', severity: 'Mild' }
            ],
            prescriptions: [
                {
                    medicineId: createdMedicines.find(m => m.name.includes('Paracetamol'))._id,
                    medicineName: 'Paracetamol 500mg (Half tablet or Syrup equivalent)',
                    dosage: '0.5 Tablet / 5ml',
                    frequency: 'Three times daily after food',
                    duration: '3 Days',
                    quantity: 5,
                    instructions: 'Only if temperature exceeds 100 F'
                },
                {
                    medicineId: createdMedicines.find(m => m.name.includes('Cetirizine'))._id,
                    medicineName: 'Cetirizine 10mg',
                    dosage: '0.5 Tablet',
                    frequency: 'Once at bedtime',
                    duration: '5 Days',
                    quantity: 5,
                    instructions: 'May cause mild drowsiness'
                }
            ]
        });

        await Invoice.create({
            patientId: createdPatients[6]._id,
            appointmentId: appt2._id,
            consultationId: consult2._id,
            items: [
                { type: 'Consultation', description: 'Pediatric Consultation Fee - Dr. Ananya Singh', quantity: 1, unitPrice: 600, total: 600 },
                { type: 'Procedure', description: 'Nebulization Support (Saline)', quantity: 1, unitPrice: 200, total: 200 },
                { type: 'Pharmacy', description: 'Cetirizine & Paracetamol pack', quantity: 1, unitPrice: 50, total: 50 }
            ],
            billingDetails: { subtotal: 850, discount: 0, tax: 42.5, grandTotal: 892.5, amountPaid: 500, amountDue: 392.5 },
            status: 'Partial',
            paymentHistory: [{ date: pastDate2, amount: 500, method: 'UPI', transactionId: 'TXN-UPI-7712' }]
        });

        // Upcoming Live Queue Appointments (Today & Tomorrow)
        await Appointment.create([
            {
                patientId: createdPatients[1]._id,
                doctorId: drSharma._id,
                appointmentDate: today,
                timeSlot: '10:00 - 10:15',
                status: 'checked-in',
                type: 'Follow-up',
                reason: 'Routine ECG and cardiac checkup',
                queueNumber: 1,
                duration: 15
            },
            {
                patientId: createdPatients[2]._id,
                doctorId: drMehta._id,
                appointmentDate: today,
                timeSlot: '10:15 - 10:30',
                status: 'booked',
                type: 'General Consultation',
                reason: 'Uncontrolled diabetes management',
                queueNumber: 1,
                duration: 15
            },
            {
                patientId: createdPatients[4]._id,
                doctorId: drSharma._id,
                appointmentDate: today,
                timeSlot: '11:00 - 11:15',
                status: 'booked',
                type: 'General Consultation',
                reason: 'Chest discomfort evaluation',
                queueNumber: 2,
                duration: 15
            },
            {
                patientId: createdPatients[3]._id,
                doctorId: drSingh._id,
                appointmentDate: futureDate1,
                timeSlot: '10:00 - 10:15',
                status: 'booked',
                type: 'General Consultation',
                reason: 'Annual health checkup',
                queueNumber: 1,
                duration: 15
            },
            {
                patientId: createdPatients[5]._id,
                doctorId: drMehta._id,
                appointmentDate: futureDate2,
                timeSlot: '12:00 - 12:15',
                status: 'booked',
                type: 'General Consultation',
                reason: 'Severe migraine headache consultation',
                queueNumber: 1,
                duration: 15
            }
        ]);

        // 7. Seed Clinic Branch Settings
        console.log('🌱 Seeding Clinic Branch Configuration...');
        await ClinicSetting.create({
            clinicName: 'Healthcare Excellence Clinic ERP',
            branchName: 'Main Medical Center',
            branchCode: 'MAIN-01',
            isPrimary: true,
            contactInfo: {
                address: '123 Health Avenue, Medical District',
                city: 'New Delhi',
                state: 'Delhi',
                pincode: '110001',
                phone: '+91 11 2345 6789',
                email: 'contact@clinicerp.com',
                website: 'https://www.clinicerp.com'
            },
            taxAndGstSettings: {
                gstNumber: '07AAAAA0000A1Z5',
                defaultTaxPercentage: 5,
                currency: 'INR',
                currencySymbol: '₹'
            },
            operationalSettings: {
                defaultSlotDurationMinutes: 15,
                maxAdvanceBookingDays: 30,
                cancellationPolicyHours: 4,
                enableOnlinePayment: true,
                enableSMSNotifications: false,
                enableEmailNotifications: true
            }
        });

        // 8. Seed Sample Audit Logs
        console.log('🌱 Seeding Sample HIPAA Compliance Audit Logs...');
        if (adminUser) {
            await AuditLog.create([
                {
                    userId: adminUser._id,
                    userName: adminUser.name,
                    userRole: adminUser.role,
                    action: 'LOGIN_SUCCESS',
                    resourceType: 'Auth',
                    details: 'Admin user successfully logged into the system',
                    ipAddress: '192.168.1.10',
                    userAgent: 'Mozilla/5.0 Chrome/126.0'
                },
                {
                    userId: drSharma._id,
                    userName: drSharma.name,
                    userRole: drSharma.role,
                    action: 'VIEW_PATIENT_RECORD',
                    resourceType: 'Patient',
                    resourceId: createdPatients[0]._id.toString(),
                    details: `Doctor accessed medical history for patient ${createdPatients[0].name}`,
                    ipAddress: '192.168.1.45',
                    userAgent: 'Mozilla/5.0 Safari/605.1.15'
                },
                {
                    userId: adminUser._id,
                    userName: adminUser.name,
                    userRole: adminUser.role,
                    action: 'UPDATE_SETTINGS',
                    resourceType: 'Setting',
                    details: 'Admin verified and updated primary clinic working hours and GST settings',
                    ipAddress: '192.168.1.10',
                    userAgent: 'Mozilla/5.0 Chrome/126.0'
                }
            ]);
        }

        console.log('\n======================================================');
        console.log('✨ DATABASE SEEDING COMPLETED SUCCESSFULLY! ✨');
        console.log('======================================================');
        console.log('👉 Ready-to-Use Login Accounts for Frontend Testing:');
        console.log('   🧑‍💼 Admin:        admin@clinicerp.com       | Pass: password123');
        console.log('   👨‍⚕️ Doctor:       dr.sharma@clinicerp.com   | Pass: password123');
        console.log('   👨‍⚕️ Doctor:       dr.singh@clinicerp.com    | Pass: password123');
        console.log('   👩‍💻 Receptionist: reception@clinicerp.com   | Pass: password123');
        console.log('   🤒 Patient:      patient@clinicerp.com     | Pass: password123');
        console.log('======================================================\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ SEEDING FAILED WITH ERROR:', error);
        process.exit(1);
    }
};

// Destroy Function (To wipe database clean if needed)
const destroyData = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('❌ ERROR: MONGO_URI is missing in .env file!');
            process.exit(1);
        }

        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        console.log('🗑️  Wiping all clinic database records...');
        await User.deleteMany({});
        await Patient.deleteMany({});
        await Medicine.deleteMany({});
        await Appointment.deleteMany({});
        await Consultation.deleteMany({});
        await Invoice.deleteMany({});
        await ClinicSetting.deleteMany({});
        await AuditLog.deleteMany({});
        await DoctorAvailability.deleteMany({});

        console.log('✨ ALL DATABASE RECORDS DELETED SUCCESSFULLY! ✨');
        process.exit(0);
    } catch (error) {
        console.error('❌ DESTRUCTION FAILED WITH ERROR:', error);
        process.exit(1);
    }
};

// Check CLI arguments to decide import or destroy
if (process.argv[2] === '-d' || process.argv[2] === '--destroy') {
    destroyData();
} else {
    importData();
}
