
// Patient 
// - create schedule, delete schedule, update schedule 

// Doctor
// - accept schedule, decline schedule(update)
 

// Admin
// - see statistics 

const AdminPermission = [
  {
    Scheduling:["Create","Read","Update","Delete"]
  }
]

const PatientPermission = [
  {
    Scheduling:["Create","Read","Update","Delete"]
  }
]

const DoctorPermission = [
  {
    Scheduling:["Create","Read","Update","Delete"]
  }
]

const Roles = [
  {
    RoleName:"Admin",
    Permissions: AdminPermission
  },
  {
    RoleName:"Patient",
    Permissions: PatientPermission
  },
  {
    RoleName:"Doctor",
    Permissions: DoctorPermission
  },
  
]


export default { Roles }
