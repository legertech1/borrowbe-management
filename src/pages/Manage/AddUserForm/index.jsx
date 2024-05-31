// import React, { useEffect, useState } from "react";
// import validateEmail from "../../../utils/validateEmail";
// import validatePassword from "../../../utils/validatePassword";
// import useNotification from "../../../hooks/useNotification";
// import { Button, Checkbox, Input, Select } from "../ManageShared";
// import "./index.css";

// import axios from "axios";
// import apis from "../../../services/api";

// const userTypes = ["USER", "MANAGEMENT"];

// export default function AddUserForm() {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [currGroup, setCurrGroup] = useState();
//   const [accType, setAccType] = useState(userTypes[0]);
//   const [selectedPermissions, setSelectedPermissions] = useState();

//   const notification = useNotification();

//   const handleFormData = (name, value) => {
//     setFormData({ ...formData, [name]: value });
//   };

//   useEffect(() => {

//   }, [currGroup]);

//   const validateForm = () => {
//     if (!validatePassword(formData.password))
//       return notification.error("Invalid password");

//     if (!validateEmail(formData.email))
//       return notification.error("Invalid email");

//     if (!formData.fullName) return notification.error("Invalid full name");

//     return true;
//   };

//   const handleSubmit = async () => {
//     let proceed = false;

//     if (!proceed) {
//       return notification.error(
//         "You don't have permission to create this user"
//       );
//     }

//     if (validateForm()) {
//       let names = formData.fullName.trim().split(" ");
//       let firstName = names[0][0].toUpperCase() + names[0].slice(1);
//       let lastName = "";
//       for (let i = 1; i < names.length; i++) {
//         lastName += names[i][0].toUpperCase() + names[i].slice(1) + " ";
//       }

//       try {
//         setLoading(true);
//         await axios.post(apis.registerEmployee, {
//           firstName,
//           lastName,
//           email: formData.email.toLowerCase(),
//           password: formData.password,
//           permissions: accType === "USER" ? null : selectedPermissions,
//         });
//         notification.success("User created successfully");
//         setFormData({
//           fullName: "",
//           email: "",
//           password: "",
//         });
//         setLoading(false);
//       } catch (error) {
//         notification.error(error.response.data.error);
//         setLoading(false);
//       }
//     }
//   };

//   return (
//     <div className="add_user_modal">
//       <label>Full Name:</label>
//       <Input
//         type="text"
//         name="fullName"
//         value={formData.fullName}
//         onChange={(e) => handleFormData(e.target.name, e.target.value)}
//       />
//       <label>Email:</label>
//       <Input
//         type="text"
//         name="email"
//         value={formData.email}
//         onChange={(e) => handleFormData(e.target.name, e.target.value)}
//       />
//       <label>Password:</label>
//       <Input
//         type="password"
//         name="password"
//         value={formData.password}
//         onChange={(e) => handleFormData(e.target.name, e.target.value)}
//       />
//       <label>Account type:</label>
//       <Select
//         value={accType}
//         onChange={(e) => {
//           setAccType(e.target.value);
//         }}
//       >
//         {userTypes.map((type) => (
//           <option key={type} value={type}>
//             {type}
//           </option>
//         ))}
//       </Select>
//       {accType !== "USER" && (
//         <>
//           <label>Permission Group:</label>
//           <Select
//             value={currGroup}
//             onChange={(e) => setCurrGroup(e.target.value)}
//           >
//             {USER_ROLES_LIST.map((role) => (
//               <option key={role} value={role}>
//                 {role}
//               </option>
//             ))}
//           </Select>

//           <div>
//             <label>Select/Unselect all:</label>
//             {/* Select/Unselect all */}
//             <Checkbox
//               checked={
//                 selectedPermissions.length ===
//                 getPredefinedPermissionsByRole(currGroup).length
//               }
//               onChange={(e) => {
//                 if (e.target.checked) {
//                   setSelectedPermissions(
//                     getPredefinedPermissionsByRole(currGroup)
//                   );
//                 } else {
//                   setSelectedPermissions([]);
//                 }
//               }}
//             />
//           </div>
//           <br />
//           <div className="perm_cont">
//             {ALL_PERMISSIONS_ARRAY.map((perm) => (
//               <div className="perm_item" key={perm}>
//                 <Checkbox
//                   checked={selectedPermissions.includes(perm)}
//                   onChange={(e) => {
//                     if (e.target.checked) {
//                       setSelectedPermissions([...selectedPermissions, perm]);
//                     } else {
//                       setSelectedPermissions(
//                         selectedPermissions.filter((p) => p !== perm)
//                       );
//                     }
//                   }}
//                 />
//                 <label>{perm}</label>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//       <Button
//         loading={loading}
//         disabled={
//           formData.fullName === "" ||
//           formData.email === "" ||
//           formData.password === ""
//         }
//         className="primary"
//         onClick={() => {
//           handleSubmit();
//         }}
//       >
//         Create New User
//       </Button>
//     </div>
//   );
// }

export default <>needs work</>;
