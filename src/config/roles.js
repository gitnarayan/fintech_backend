const allRoles = {
  user: ['updateUser', 'mutualfund'],
  admin: ['getUsers',],
};



const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));
export {
  roles,
  roleRights,
};
