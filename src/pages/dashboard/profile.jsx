import {
  Card,
  CardBody,
} from "@material-tailwind/react";
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import './profile.css'

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
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url(https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-blue-500/50" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4">
        <CardBody className="p-[150px] flex items-center">
            <div className="bootstrap nimadur">
              <div className="row">
                <div className="col-xs-3 col-sm-3">
                  <form className="form-horizontal" onSubmit={handleSubmit}>
                    <div className="panel panel-default">
                      <div className="panel-body text-center">
                        <img
                          src="https://bootdey.com/img/Content/avatar/avatar6.png"
                          className="img-circle profile-avatar"
                          alt="User avatar"
                        />
                      </div>
                    </div>
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <h4 className="panel-title">User info</h4>
                      </div>
                      <div className="panel-body">
                        <div className="form-group">
                          <label className="col-sm-2 control-label">Name</label>
                          <div className="col-sm-10">
                            <input
                              type="text"
                              name="name"
                              className="form-control"
                              value={formData.name}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-2 control-label">Login</label>
                          <div className="col-sm-10">
                            <input
                              type="text"
                              name="login"
                              className="form-control"
                              value={formData.login}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-2 control-label">Current password</label>
                          <div className="col-sm-10">
                            <input
                              type="password"
                              name="password"
                              className="form-control"
                              value={formData.password}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="form-group" style={{ marginTop: '20px' }}>
                          <div className="col-sm-10 col-sm-offset-2">
                            <button type="submit" className="btn btn-primary">
                              Submit
                            </button>
                            <button type="reset" className="btn btn-default">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
        </CardBody>
      </Card>
    </>
  );
}

export default Profile;
