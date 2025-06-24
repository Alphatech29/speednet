import React, { useEffect, useState, useContext } from 'react';
import { Label } from 'flowbite-react';
import { getCurrentUser } from "../../../../components/backendApis/user/user";
import { AuthContext } from '../../../../components/control/authContext';

const ProfileTab = () => {
  const { user: authUser } = useContext(AuthContext); // get user from AuthContext
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!authUser?.uid) return;

      try {
        const response = await getCurrentUser(authUser.uid);
        if (response?.success && response.data) {
          setUser(response.data);
        } else {
          console.error("Failed to load user profile.");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [authUser]);

  if (loading) {
    return <div className="text-gray-300">Loading profile...</div>;
  }

  return (
    <div className="bg-gray-800 p-4 rounded-md text-gray-100">
     <div>
       <div className="flex items-center gap-4">
        <div className="w-28 h-28 rounded-full overflow-hidden border border-gray-600">
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>

    <div>
          <h2 className="mt-3 text-xl font-semibold">{user.full_name}</h2>
        <p className="text-sm text-gray-400">Username: {user.username}</p>
        <p className="text-sm text-gray-400">Level: {user.role }</p>
    </div>

      </div>

        <div className="mt-4 w-full text-left space-y-2">
          <div>
          <Label htmlFor="email" value="Email" />
          <input
            id="email"
            name="email"
            type="text"
            value={user.email}
            className="w-full bg-transparent border border-gray-600 text-sm px-3 py-2 rounded-md placeholder:text-gray-600"
            readOnly
          />
        </div>

        <div>
          <Label htmlFor="phone" value="Phone Number" />
          <input
            id="phone"
            name="phone"
            type="text"
            value={user.phone_number}
            className="w-full bg-transparent border border-gray-600 text-sm px-3 py-2 rounded-md placeholder:text-gray-600"
            readOnly
          />
        </div>
         <div>
          <Label htmlFor="country" value="Country" />
          <input
            id="country"
            name="country"
            type="text"
            value={user.country}
            className="w-full bg-transparent border border-gray-600 text-sm px-3 py-2 rounded-md placeholder:text-gray-600"
            readOnly
          />
        </div>
          <p><strong>Note:</strong> To make any change on profile please send a to support@speednet.com and requste for account profile update.</p>
        </div>
     </div>
    </div>
  );
};

export default ProfileTab;
