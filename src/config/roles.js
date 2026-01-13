const allRoles = {
  user: ['updateUser', 'mutualfund', 'getDocuments'],
  admin: ['getUsers', 'getDocuments'],
};



const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));
export {
  roles,
  roleRights,
};
