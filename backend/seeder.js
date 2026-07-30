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
const Prescription = require('./models/Prescription');
const LabOrder = require('./models/LabOrder');
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

// Sample Patients (Matching Patient Schema: firstName, lastName, dateOfBirth, structured allergies & medicalHistory)
const patientsData = [
    {
        firstName: 'Amit',
        lastName: 'Kumar',
        email: 'patient@clinicerp.com',
        phone: '+919876543215',
        dateOfBirth: '1988-05-14',
        gender: 'Male',
        bloodGroup: 'B+',
        address: '45 MG Road, Bangalore, Karnataka',
        medicalHistory: [
            { condition: 'Hypertension', diagnosedDate: '2020-01-15', status: 'Managed' },
            { condition: 'Mild Asthma', diagnosedDate: '2016-08-10', status: 'Active' }
        ],
        allergies: [
            { allergen: 'Penicillin', severity: 'High', reaction: 'Skin Rash & Hives' },
            { allergen: 'Peanuts', severity: 'Severe', reaction: 'Anaphylaxis' }
        ]
    },
    {
        firstName: 'Priya',
        lastName: 'Patel',
        email: 'priya.p@example.com',
        phone: '+919811122233',
        dateOfBirth: '1992-09-20',
        gender: 'Female',
        bloodGroup: 'O+',
        address: '12 Park Street, Kolkata, West Bengal',
        medicalHistory: [
            { condition: 'Hypothyroidism', diagnosedDate: '2019-03-12', status: 'Managed' }
        ],
        allergies: [
            { allergen: 'Dust Mites', severity: 'Medium', reaction: 'Allergic Rhinitis' }
        ]
    },
    {
        firstName: 'Rohan',
        lastName: 'Gupta',
        email: 'rohan.g@example.com',
        phone: '+919822233344',
        dateOfBirth: '1975-11-03',
        gender: 'Male',
        bloodGroup: 'A+',
        address: '88 Marine Drive, Mumbai, Maharashtra',
        medicalHistory: [
            { condition: 'Type 2 Diabetes', diagnosedDate: '2015-05-20', status: 'Active' },
            { condition: 'Hypercholesterolemia', diagnosedDate: '2018-11-01', status: 'Managed' }
        ],
        allergies: [
            { allergen: 'Sulfa drugs', severity: 'High', reaction: 'Severe itching and swelling' }
        ]
    },
    {
        firstName: 'Sneha',
        lastName: 'Verma',
        email: 'sneha.v@example.com',
        phone: '+919833344455',
        dateOfBirth: '2001-02-18',
        gender: 'Female',
        bloodGroup: 'AB+',
        address: '34 Civil Lines, Delhi',
        medicalHistory: [],
        allergies: []
    },
    {
        firstName: 'Suresh',
        lastName: 'Iyer',
        email: 'suresh.i@example.com',
        phone: '+919844455566',
        dateOfBirth: '1965-07-25',
        gender: 'Male',
        bloodGroup: 'O-',
        address: '56 Anna Salai, Chennai, Tamil Nadu',
        medicalHistory: [
            { condition: 'Coronary Artery Disease', diagnosedDate: '2017-09-14', status: 'Active' }
        ],
        allergies: [
            { allergen: 'Aspirin', severity: 'Severe', reaction: 'GI Bleeding / Bronchospasm' }
        ]
    },
    {
        firstName: 'Kavita',
        lastName: 'Nair',
        email: 'kavita.n@example.com',
        phone: '+919855566677',
        dateOfBirth: '1995-12-11',
        gender: 'Female',
        bloodGroup: 'B-',
        address: '19 MG Road, Pune, Maharashtra',
        medicalHistory: [
            { condition: 'Migraine', diagnosedDate: '2021-02-10', status: 'Managed' }
        ],
        allergies: [
            { allergen: 'Shellfish', severity: 'High', reaction: 'Facial swelling' }
        ]
    },
    {
        firstName: 'Arjun',
        lastName: 'Das',
        email: 'arjun.d@example.com',
        phone: '+919866677788',
        dateOfBirth: '2015-04-05',
        gender: 'Male',
        bloodGroup: 'A+',
        address: '77 Sector 18, Noida, UP',
        medicalHistory: [
            { condition: 'Childhood Asthma', diagnosedDate: '2019-10-12', status: 'Active' }
        ],
        allergies: []
    },
    {
        firstName: 'Meera',
        lastName: 'Chopra',
        email: 'meera.c@example.com',
        phone: '+919877788899',
        dateOfBirth: '1982-08-30',
        gender: 'Female',
        bloodGroup: 'O+',
        address: '102 Jubilee Hills, Hyderabad, Telangana',
        medicalHistory: [
            { condition: 'Iron Deficiency Anemia', diagnosedDate: '2022-01-20', status: 'Active' }
        ],
        allergies: [
            { allergen: 'Latex', severity: 'Low', reaction: 'Contact dermatitis' }
        ]
    },
    {
        firstName: 'Alok',
        lastName: 'Mishra',
        email: 'alok.m@example.com',
        phone: '+919888899900',
        dateOfBirth: '1958-01-15',
        gender: 'Male',
        bloodGroup: 'B+',
        address: '14 Hazratganj, Lucknow, UP',
        medicalHistory: [
            { condition: 'Osteoarthritis', diagnosedDate: '2014-06-11', status: 'Managed' },
            { condition: 'Essential Hypertension', diagnosedDate: '2012-04-05', status: 'Managed' }
        ],
        allergies: []
    },
    {
        firstName: 'Neha',
        lastName: 'Sharma',
        email: 'neha.s@example.com',
        phone: '+919899900011',
        dateOfBirth: '1998-06-22',
        gender: 'Female',
        bloodGroup: 'AB-',
        address: '65 Malviya Nagar, Jaipur, Rajasthan',
        medicalHistory: [],
        allergies: [
            { allergen: 'Ibuprofen', severity: 'Medium', reaction: 'Stomach irritation & rash' }
        ]
    },
    {
        firstName: 'Deepak',
        lastName: 'Joshi',
        email: 'deepak.j@example.com',
        phone: '+919900011122',
        dateOfBirth: '1985-10-09',
        gender: 'Male',
        bloodGroup: 'A-',
        address: '23 Mall Road, Shimla, HP',
        medicalHistory: [
            { condition: 'Recurrent Renal Calculi', diagnosedDate: '2018-07-22', status: 'Resolved' }
        ],
        allergies: []
    },
    {
        firstName: 'Anjali',
        lastName: 'Desai',
        email: 'anjali.d@example.com',
        phone: '+919911122233',
        dateOfBirth: '1990-03-27',
        gender: 'Female',
        bloodGroup: 'O+',
        address: '89 SG Highway, Ahmedabad, Gujarat',
        medicalHistory: [
            { condition: 'Polycystic Ovary Syndrome (PCOS)', diagnosedDate: '2016-09-18', status: 'Managed' }
        ],
        allergies: [
            { allergen: 'Sulfa drugs', severity: 'Medium', reaction: 'Hives' }
        ]
    },
    {
        firstName: 'Manoj',
        lastName: 'Tiwari',
        email: 'manoj.t@example.com',
        phone: '+919922233344',
        dateOfBirth: '1972-12-01',
        gender: 'Male',
        bloodGroup: 'B+',
        address: '31 Station Road, Patna, Bihar',
        medicalHistory: [
            { condition: 'Type 2 Diabetes Mellitus', diagnosedDate: '2016-11-15', status: 'Active' }
        ],
        allergies: []
    },
    {
        firstName: 'Pooja',
        lastName: 'Bhatt',
        email: 'pooja.b@example.com',
        phone: '+919933344455',
        dateOfBirth: '2005-09-17',
        gender: 'Female',
        bloodGroup: 'A+',
        address: '50 Ring Road, Surat, Gujarat',
        medicalHistory: [],
        allergies: [
            { allergen: 'Peanuts', severity: 'High', reaction: 'Facial swelling & difficulty breathing' }
        ]
    },
    {
        firstName: 'Rajeshwar',
        lastName: 'Singh',
        email: 'rajeshwar.s@example.com',
        phone: '+919944455566',
        dateOfBirth: '1960-05-05',
        gender: 'Male',
        bloodGroup: 'O+',
        address: '15 Civil Lines, Allahabad, UP',
        medicalHistory: [
            { condition: 'Hypertension', diagnosedDate: '2010-02-14', status: 'Managed' },
            { condition: 'Open-angle Glaucoma', diagnosedDate: '2015-08-19', status: 'Managed' }
        ],
        allergies: []
    }
];

// Sample Pharmacy Inventory (Medicines matching batches schema)
const medicinesData = [
    {
        name: 'Paracetamol 500mg',
        genericName: 'Acetaminophen',
        category: 'Tablet',
        manufacturer: 'Cipla Ltd',
        unitPrice: 3,
        reorderThreshold: 50,
        batches: [{ batchNumber: 'BATCH-P501', quantity: 500, expiryDate: new Date('2027-12-31'), purchasePrice: 2 }]
    },
    {
        name: 'Amoxicillin 500mg',
        genericName: 'Amoxicillin Trihydrate',
        category: 'Capsule',
        manufacturer: 'Sun Pharma',
        unitPrice: 12,
        reorderThreshold: 40,
        batches: [{ batchNumber: 'BATCH-A502', quantity: 300, expiryDate: new Date('2028-06-30'), purchasePrice: 8 }]
    },
    {
        name: 'Metformin 500mg',
        genericName: 'Metformin Hydrochloride',
        category: 'Tablet',
        manufacturer: 'USV Ltd',
        unitPrice: 5,
        reorderThreshold: 60,
        batches: [{ batchNumber: 'BATCH-M503', quantity: 450, expiryDate: new Date('2027-10-31'), purchasePrice: 3 }]
    },
    {
        name: 'Atorvastatin 10mg',
        genericName: 'Atorvastatin Calcium',
        category: 'Tablet',
        manufacturer: 'Zydus Cadila',
        unitPrice: 15,
        reorderThreshold: 30,
        batches: [{ batchNumber: 'BATCH-AT10', quantity: 250, expiryDate: new Date('2028-03-31'), purchasePrice: 10 }]
    },
    {
        name: 'Azithromycin 500mg',
        genericName: 'Azithromycin Dihydrate',
        category: 'Tablet',
        manufacturer: 'Alkem Labs',
        unitPrice: 25,
        reorderThreshold: 25,
        batches: [{ batchNumber: 'BATCH-AZ50', quantity: 180, expiryDate: new Date('2027-08-31'), purchasePrice: 18 }]
    },
    {
        name: 'Ibuprofen 400mg',
        genericName: 'Ibuprofen',
        category: 'Tablet',
        manufacturer: 'Abbott India',
        unitPrice: 6,
        reorderThreshold: 50,
        batches: [{ batchNumber: 'BATCH-IB40', quantity: 350, expiryDate: new Date('2028-11-30'), purchasePrice: 4 }]
    },
    {
        name: 'Omeprazole 20mg',
        genericName: 'Omeprazole',
        category: 'Capsule',
        manufacturer: 'Dr. Reddys',
        unitPrice: 9,
        reorderThreshold: 45,
        batches: [{ batchNumber: 'BATCH-OM20', quantity: 400, expiryDate: new Date('2027-09-30'), purchasePrice: 6 }]
    },
    {
        name: 'Cetirizine 10mg',
        genericName: 'Cetirizine Hydrochloride',
        category: 'Tablet',
        manufacturer: 'GlaxoSmithKline',
        unitPrice: 4,
        reorderThreshold: 80,
        batches: [{ batchNumber: 'BATCH-CE10', quantity: 600, expiryDate: new Date('2028-05-31'), purchasePrice: 2 }]
    },
    {
        name: 'Losartan 50mg',
        genericName: 'Losartan Potassium',
        category: 'Tablet',
        manufacturer: 'Torrent Pharma',
        unitPrice: 11,
        reorderThreshold: 30,
        batches: [{ batchNumber: 'BATCH-LO50', quantity: 220, expiryDate: new Date('2027-07-31'), purchasePrice: 7 }]
    },
    {
        name: 'Pantoprazole 40mg',
        genericName: 'Pantoprazole Sodium',
        category: 'Tablet',
        manufacturer: 'Aristo Pharma',
        unitPrice: 12,
        reorderThreshold: 40,
        batches: [{ batchNumber: 'BATCH-PA40', quantity: 320, expiryDate: new Date('2028-01-31'), purchasePrice: 8 }]
    },
    {
        name: 'Doxycycline 100mg',
        genericName: 'Doxycycline Hyclate',
        category: 'Capsule',
        manufacturer: 'Lupin Ltd',
        unitPrice: 14,
        reorderThreshold: 30,
        batches: [{ batchNumber: 'BATCH-DO10', quantity: 200, expiryDate: new Date('2027-11-30'), purchasePrice: 9 }]
    },
    {
        name: 'Ciprofloxacin 500mg',
        genericName: 'Ciprofloxacin Hydrochloride',
        category: 'Tablet',
        manufacturer: 'Bayer Pharmaceuticals',
        unitPrice: 18,
        reorderThreshold: 20,
        batches: [{ batchNumber: 'BATCH-CI50', quantity: 150, expiryDate: new Date('2028-04-30'), purchasePrice: 12 }]
    },
    {
        name: 'Aspirin 75mg',
        genericName: 'Acetylsalicylic Acid',
        category: 'Tablet',
        manufacturer: 'USV Ltd',
        unitPrice: 2,
        reorderThreshold: 70,
        batches: [{ batchNumber: 'BATCH-AS75', quantity: 550, expiryDate: new Date('2029-01-31'), purchasePrice: 1 }]
    },
    {
        name: 'Levothyroxine 50mcg',
        genericName: 'Levothyroxine Sodium',
        category: 'Tablet',
        manufacturer: 'Abbott India',
        unitPrice: 8,
        reorderThreshold: 35,
        batches: [{ batchNumber: 'BATCH-LE50', quantity: 280, expiryDate: new Date('2028-08-31'), purchasePrice: 5 }]
    },
    {
        name: 'Amlodipine 5mg',
        genericName: 'Amlodipine Besylate',
        category: 'Tablet',
        manufacturer: 'Pfizer',
        unitPrice: 5,
        reorderThreshold: 50,
        batches: [{ batchNumber: 'BATCH-AM05', quantity: 420, expiryDate: new Date('2027-05-31'), purchasePrice: 3 }]
    }
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
        await Prescription.deleteMany({});
        await LabOrder.deleteMany({});
        await Invoice.deleteMany({});
        await ClinicSetting.deleteMany({});
        await AuditLog.deleteMany({});
        await DoctorAvailability.deleteMany({});

        // 2. Seed Users
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

        // 3. Seed Doctor Availability (Matching DoctorAvailability schema)
        console.log('🌱 Seeding Doctor Schedules & Availability...');
        const doctorsList = [drSharma, drSingh, drMehta];
        for (const doc of doctorsList) {
            if (!doc) continue;
            await DoctorAvailability.create({
                doctorId: doc._id,
                workingHours: [
                    { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isOffDay: false },
                    { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isOffDay: false },
                    { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isOffDay: false },
                    { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isOffDay: false },
                    { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isOffDay: false },
                    { dayOfWeek: 6, startTime: '09:00', endTime: '13:00', isOffDay: false },
                    { dayOfWeek: 0, startTime: '00:00', endTime: '00:00', isOffDay: true }
                ],
                slotDuration: 15
            });
        }

        // 4. Seed Patients (Letting Mongoose auto-generate patientId PA0001, PA0002...)
        console.log('🌱 Seeding 15 Patient Profiles...');
        const createdPatients = [];
        for (let i = 0; i < patientsData.length; i++) {
            const pData = patientsData[i];
            const pObj = {
                ...pData,
                createdBy: adminUser ? adminUser._id : undefined
            };
            const pDoc = await Patient.create(pObj);
            createdPatients.push(pDoc);
        }

        // 5. Seed Pharmacy Inventory
        console.log('🌱 Seeding Pharmacy Medicines & Stock Batches...');
        const createdMedicines = await Medicine.insertMany(medicinesData);

        // 6. Seed Appointments, Consultations, Prescriptions, Lab Orders & Invoices
        console.log('🌱 Seeding Appointments, SOAP Consultations, Prescriptions & Invoices...');
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
            duration: 15,
            appointmentType: 'Follow-up',
            status: 'completed',
            reasonForVisit: 'High blood pressure checkup and routine ECG monitoring',
            consultationRoom: 'Room 101 (Cardiology)',
            createdBy: adminUser ? adminUser._id : undefined
        });

        const consult1 = await Consultation.create({
            appointmentId: appt1._id,
            patientId: createdPatients[0]._id,
            doctorId: drSharma._id,
            symptoms: 'Patient reports mild headache and occasional dizziness over the last 3 days.',
            examinationFindings: 'BP 150/95 mmHg, Heart rate 78 bpm. Lungs clear to auscultation.',
            diagnosis: 'Stage 2 Essential Hypertension with mild tension headaches (ICD-10: I10, R51)',
            treatmentPlan: 'Prescribed Amlodipine 5mg once daily. Recommended sodium reduction and daily 30-min brisk walk. Follow-up in 2 weeks.',
            followUpDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
            status: 'Completed'
        });

        await Prescription.create({
            consultationId: consult1._id,
            patientId: createdPatients[0]._id,
            doctorId: drSharma._id,
            medications: [
                {
                    drugName: 'Amlodipine 5mg',
                    dosage: '1 Tablet',
                    frequency: 'Once Daily (Morning after breakfast)',
                    duration: '14 Days',
                    instructions: 'Do not skip dose'
                },
                {
                    drugName: 'Paracetamol 500mg',
                    dosage: '1 Tablet',
                    frequency: 'As needed for severe headache (Max 3/day)',
                    duration: '5 Days',
                    instructions: 'Take after food'
                }
            ],
            notes: 'Take medications regularly after meals and monitor BP daily.',
            status: 'Dispensed'
        });

        await LabOrder.create({
            consultationId: consult1._id,
            patientId: createdPatients[0]._id,
            doctorId: drSharma._id,
            tests: ['Complete Blood Count (CBC)', 'Lipid Profile', 'HbA1c'],
            status: 'Completed',
            results: [
                {
                    documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    parsedText: 'Total Cholesterol: 210 mg/dL, HDL: 45 mg/dL, LDL: 135 mg/dL, HbA1c: 6.2%',
                    notes: 'Borderline high LDL and prediabetes.'
                }
            ]
        });

        await Invoice.create({
            patientId: createdPatients[0]._id,
            consultationId: consult1._id,
            items: [
                { description: 'Cardiology Consultation Fee - Dr. Rajesh Sharma', type: 'Consultation Fee', quantity: 1, unitPrice: 800, total: 800 },
                { description: 'ECG Diagnostic Test', type: 'Procedure', quantity: 1, unitPrice: 300, total: 300 },
                { description: 'Amlodipine 5mg & Paracetamol Pack', type: 'Pharmacy', quantity: 1, unitPrice: 100, total: 100 }
            ],
            billingDetails: {
                subTotal: 1200,
                tax: 60,
                discount: 50,
                grandTotal: 1210,
                amountPaid: 1210,
                amountDue: 0
            },
            status: 'Paid',
            paymentHistory: [
                { date: pastDate1, amount: 1210, method: 'Card', transactionId: 'TXN-CARD-9001', receiptNumber: 'REC-2026-0001' }
            ],
            createdBy: adminUser ? adminUser._id : undefined
        });

        // Past Completed Appointment 2 -> Dr. Singh (Pediatrics)
        const appt2 = await Appointment.create({
            patientId: createdPatients[6]._id, // Arjun Das (child)
            doctorId: drSingh._id,
            appointmentDate: pastDate2,
            duration: 15,
            appointmentType: 'Walk-in',
            status: 'completed',
            reasonForVisit: 'High fever and seasonal dry cough',
            consultationRoom: 'Room 102 (Pediatrics)',
            createdBy: adminUser ? adminUser._id : undefined
        });

        const consult2 = await Consultation.create({
            appointmentId: appt2._id,
            patientId: createdPatients[6]._id,
            doctorId: drSingh._id,
            symptoms: 'Mother reports child has had low-grade fever (100.4 F) and dry cough since yesterday evening.',
            examinationFindings: 'Temp 100.2 F, Throat slightly erythemic. Chest auscultation bilateral clear.',
            diagnosis: 'Acute upper respiratory tract infection / Viral pharyngitis (ICD-10: J06.9)',
            treatmentPlan: 'Prescribed Paracetamol syrup/tablet and Cetirizine for allergic cough relief. Plenty of warm fluids.',
            status: 'Completed'
        });

        await Prescription.create({
            consultationId: consult2._id,
            patientId: createdPatients[6]._id,
            doctorId: drSingh._id,
            medications: [
                {
                    drugName: 'Paracetamol 500mg (Half tablet or Syrup equivalent)',
                    dosage: '0.5 Tablet / 5ml',
                    frequency: 'Three times daily after food',
                    duration: '3 Days',
                    instructions: 'Only if temperature exceeds 100 F'
                },
                {
                    drugName: 'Cetirizine 10mg',
                    dosage: '0.5 Tablet',
                    frequency: 'Once at bedtime',
                    duration: '5 Days',
                    instructions: 'May cause mild drowsiness'
                }
            ],
            notes: 'Give plenty of warm fluids and rest.',
            status: 'Dispensed'
        });

        await Invoice.create({
            patientId: createdPatients[6]._id,
            consultationId: consult2._id,
            items: [
                { description: 'Pediatric Consultation Fee - Dr. Ananya Singh', type: 'Consultation Fee', quantity: 1, unitPrice: 600, total: 600 },
                { description: 'Nebulization Support (Saline)', type: 'Procedure', quantity: 1, unitPrice: 200, total: 200 },
                { description: 'Cetirizine & Paracetamol pack', type: 'Pharmacy', quantity: 1, unitPrice: 50, total: 50 }
            ],
            billingDetails: {
                subTotal: 850,
                tax: 42.5,
                discount: 0,
                grandTotal: 892.5,
                amountPaid: 500,
                amountDue: 392.5
            },
            status: 'Partial',
            paymentHistory: [
                { date: pastDate2, amount: 500, method: 'UPI', transactionId: 'TXN-UPI-7712', receiptNumber: 'REC-2026-0002' }
            ],
            createdBy: adminUser ? adminUser._id : undefined
        });

        // Upcoming Live Queue Appointments (Today & Tomorrow)
        for (const upcomingAppt of [
            {
                patientId: createdPatients[1]._id,
                doctorId: drSharma._id,
                appointmentDate: today,
                duration: 15,
                appointmentType: 'Follow-up',
                status: 'checked-in',
                reasonForVisit: 'Routine ECG and cardiac checkup',
                consultationRoom: 'Room 101 (Cardiology)'
            },
            {
                patientId: createdPatients[2]._id,
                doctorId: drMehta._id,
                appointmentDate: today,
                duration: 15,
                appointmentType: 'Walk-in',
                status: 'booked',
                reasonForVisit: 'Uncontrolled diabetes management and blood sugar review',
                consultationRoom: 'Room 103 (General Medicine)'
            },
            {
                patientId: createdPatients[4]._id,
                doctorId: drSharma._id,
                appointmentDate: today,
                duration: 15,
                appointmentType: 'Online',
                status: 'booked',
                reasonForVisit: 'Chest discomfort evaluation after exercise',
                consultationRoom: 'Online Consultation Video Link'
            },
            {
                patientId: createdPatients[3]._id,
                doctorId: drSingh._id,
                appointmentDate: futureDate1,
                duration: 15,
                appointmentType: 'Walk-in',
                status: 'booked',
                reasonForVisit: 'Annual health checkup and vaccination counseling',
                consultationRoom: 'Room 102 (Pediatrics)'
            },
            {
                patientId: createdPatients[5]._id,
                doctorId: drMehta._id,
                appointmentDate: futureDate2,
                duration: 15,
                appointmentType: 'Follow-up',
                status: 'booked',
                reasonForVisit: 'Severe migraine headache consultation',
                consultationRoom: 'Room 103 (General Medicine)'
            }
        ]) {
            await Appointment.create({
                ...upcomingAppt,
                createdBy: adminUser ? adminUser._id : undefined
            });
        }

        // 7. Seed Clinic Branch Settings (Matching ClinicSetting schema)
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

        // 8. Seed Sample Audit Logs (Matching AuditLog schema)
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
                    details: `Doctor accessed medical history for patient ${createdPatients[0].firstName} ${createdPatients[0].lastName}`,
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
        await Prescription.deleteMany({});
        await LabOrder.deleteMany({});
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
