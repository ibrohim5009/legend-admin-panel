import {
  Card,
  CardBody,
} from "@material-tailwind/react";
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

export function Profile() {
  const initialFormData = {
    name: '',
    login: '',
    password: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const token = sessionStorage.getItem('token');
  console.log(token);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/edit`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      toast.success('Adminni tahhirlash muoffiqiyatli yakulandi', {
        position: toast.POSITION.TOP_RIGHT
      });
      console.log(response.data);

      setFormData(initialFormData);
    } catch (error) {
      console.error(error);
      toast.success('Adminni tahhirlash yakulanmadi', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  return (
    <>
      <div className="md:relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url(https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-blue-500/50" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4">
        <CardBody className=" flex items-center">
          <div class="min-w-md w-full flex justify-center items-center">
            <div class="bg-white min-w-md w-[1000px] shadow-lg p-4 space-y-4">
              <div class="text-center">
                <img src="https://bootdey.com/img/Content/avatar/avatar6.png" class="w-24 h-24 rounded-full mx-auto" alt="User avatar" />
              </div>
              <form class=" md:p-8 rounded-lg" onSubmit={handleSubmit}>
                <h4 class="text-2xl font-bold mb-4 text-center">User Info</h4>
                <div class="mb-4">
                  <label class="font-semibold">Name</label>
                  <input
                    type="text"
                    name="name"
                    class="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-xl"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div class="mb-4">
                  <label class="font-semibold">Login</label>
                  <input
                    type="text"
                    name="login"
                    class="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    value={formData.login}
                    onChange={handleInputChange}
                  />
                </div>
                <div class="mb-6">
                  <label class="font-semibold">Current Password</label>
                  <input
                    type="password"
                    name="password"
                    class="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <div class="flex items-center justify-center gap-7">
                  <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-600">Submit</button>
                  <button type="reset" class="bg-gray-300 text-gray-700 py-2 px-4 rounded cursor-pointer hover:bg-gray-400">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default Profile;
