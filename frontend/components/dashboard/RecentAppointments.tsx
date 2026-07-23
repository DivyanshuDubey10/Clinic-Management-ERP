const appointments = [
  {
    id: 1,
    patient: "Rahul Sharma",
    doctor: "Dr. Mehta",
    time: "10:00 AM",
    status: "Completed",
  },
  {
    id: 2,
    patient: "Priya Das",
    doctor: "Dr. Roy",
    time: "11:30 AM",
    status: "Pending",
  },
  {
    id: 3,
    patient: "Amit Kumar",
    doctor: "Dr. Singh",
    time: "01:00 PM",
    status: "Completed",
  },
  {
    id: 4,
    patient: "Neha Patel",
    doctor: "Dr. Khan",
    time: "03:30 PM",
    status: "Cancelled",
  },
];

export default function RecentAppointments(){
    return(
        <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                    Recent Appointments
                </h2>

                <button className="text-blue-600 font-medium hover:underline">
                    View All
                </button>
            </div>

            <table className="w-full">
                <thead>
                    <tr className="text-left text-gray-500 border-b">
                        <th className="pb-3">Patient</th>
                        <th className="pb-3">Doctor</th>
                        <th className="pb-3">Time</th>
                        <th className="pb-3">Status</th>
                    </tr>
                </thead>

                <tbody>
                    {appointments.map((appointment)=>(
                        <tr
                        key={appointment.id}
                        className="border-b hover:bg-gray-50">
                            <td className="py-4">{appointment.patient}</td>
                            <td>{appointment.doctor}</td>
                            <td>{appointment.time}</td>

                            <td>
                                <span
                                className={`px-3 py-1 rounded-full text-sm font-medium
                                ${
                                appointment.status === "Completed"
                                ?"bg-green-100 text-green-700":
                                appointment.status==="pending"
                                ?"bg-yellow-100 text-yellow-700":
                                "bg-red-100 text-red-700"}`}>
                                    {appointment.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}