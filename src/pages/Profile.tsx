import React, { useState } from 'react';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    address: '123 Main St, City, Country',
    company: 'Example Company',
    position: 'Vendor Manager',
    bio: 'Experienced vendor manager with 5+ years in the industry.',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // Here you would typically make an API call to update the profile
    console.log('Profile updated:', profile);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
              <input
                type="text"
                name="company"
                value={profile.company}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
              <input
                type="text"
                name="position"
                value={profile.position}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              disabled={!isEditing}
              rows={4}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
          
          {isEditing && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="mt-6 bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Change Password</label>
            <input
              type="password"
              placeholder="Current Password"
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="New Password"
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 