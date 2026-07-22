const ROLES = {
    ADMIN: "admin",
    DOCTOR: "doctor",
    RECEPTIONIST: "receptionist",
    PHARMACIST: "pharmacist",
    PATIENT: "patient"
};

const STAFF_ROLES = [
    ROLES.ADMIN,
    ROLES.DOCTOR,
    ROLES.RECEPTIONIST,
    ROLES.PHARMACIST
];

module.exports = {
    ROLES,
    STAFF_ROLES
};
