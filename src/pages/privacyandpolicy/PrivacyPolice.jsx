import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { BsFillTrashFill } from 'react-icons/bs';
import { FiEdit2 } from 'react-icons/fi';
import { GrDocumentUpdate } from 'react-icons/gr'
import { ToastContainer, toast } from 'react-toastify';

const PrivacyPolice = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const token = sessionStorage.getItem('token');
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [inputValue, setInputValue] = useState(""); // To track the input value

  const onSubmit = async (formData) => {
    if (editingId) {
      onEdit(formData);
    } else {
      const options = {
        method: "POST",
        url: `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/privacy-policy/store`,
        headers: {
          "Accept": "application/json",
        },
        data: { text: formData.text },
      };

      try {
        const response = await axios(options);
        fetchData();
        setInputValue("");
        toast.success('Maxfiylik qo\'shildi', {
          position: toast.POSITION.TOP_RIGHT
        });
      } catch (error) {
        if (error.response && error.response.status === 422) {
          console.error("Validation Error:", error.response.data);
        } else {
          console.error(error);
        }
        toast.error('Maxfiylik qo\'shilmadi', {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    }
  };

  const onEdit = async (formData) => {
    const options = {
      method: "POST",
      url: `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/privacy-policy/${editingId}/update`,
      headers: {
        "Accept": "application/json",
      },
      data: { text: formData.text },
    };

    try {
      const response = await axios(options);
      setEditingId(null);
      fetchData();
      toast.success('Maxfiylik taxrirlandi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      console.error(error);
    }
    toast.error('Maxfiylik taxrirlanmadi', {
      position: toast.POSITION.TOP_RIGHT
    });
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://api.abdullajonov.uz/legend-backend-api/api/privacy-policy/get"
      );
      const data = response.data.data;
      setData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const deletePrivacyPolicy = async (idToDelete) => {
    try {
      const options = {
        method: "DELETE",
        url: `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/privacy-policy/${idToDelete}/delete`,
        headers: {
          "Accept": "application/json",
        },
      };
      const response = await axios(options);
      fetchData();
      toast.success('Maxfiylik o\'chirildi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      console.error(error);
    }
    toast.success('Maxfiylik o\'chirilmadi', {
      position: toast.POSITION.TOP_RIGHT
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="mt-10 mx-auto flex max-w-screen-lg flex-col gap-8 min-h-[840px] min-w-full bg-white shadow-2xl">
      <div className="mx-3 mt-16 mb-6 lg:mx-4">
        <div className="">
          <div className="grid gap-4">
            <form className="nimadur" onSubmit={handleSubmit((formData, e) => {
              e.preventDefault();
              onSubmit(formData);
            })}>
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Privacy and policy text"
                  className="w-52 h-10 px-4 py-2 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 placeholder-gray-600 ml-5"
                  {...register("text")}
                  value={inputValue} // Set the value of the input field
                  onChange={(e) => setInputValue(e.target.value)} // Update input value
                />
                <button type="submit" className="w-52 h-10 px-4 py-[5px] flex items-center justify-center border-2 border-[#dee2e6] text-black rounded-lg ml-5 hover:bg-blue-400 hover:border-blue-400 hover:text-white">Ma'lumot qo'shish</button>
             </div>
            </form>
          </div>
        </div>
        <div>
          <div className="w-[50rem] grid gap-4 ml-5 max-h-[670px] overflow-y-auto mt-5">
            {data.length > 0 &&
              data.map((item) => (
                <div key={item.id} className="">
                  {editingId === item.id ? (
                    <form
                      onSubmit={handleSubmit((formData, e) => {
                        e.preventDefault();
                        onEdit(formData);
                      })}
                      className="flex items-center justify-around w-full border-2 border-[#dee2e6]  p-2"
                    >
                      <input
                        type="text"
                        defaultValue={item.text}
                        {...register("text")}
                        className="w-52 h-10 px-4 py-2 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 placeholder-gray-600 ml-5"
                      />
                      <button type="submit" className="w-52 h-10 px-4 py-2 flex text-center border-2 border-[#dee2e6] text-black rounded-lg ml-5 hover:bg-blue-400 hover:border-blue-400 hover:text-white"><GrDocumentUpdate /> Update</button>
                    </form>
                  ) : (
                    <div className="w-full border-2 border-[#dee2e6] flex items-center justify-between p-2">
                        <p className=" text-gray-700 font-bold">{item.text}</p>
                        <div className="flex gap-11">
                        <button
                          onClick={() => setEditingId(item.id)}
                            className="w-44 h-10 px-4 py-2 border-2 border-blue-400 text-blue-600 rounded-lg flex items-center justify-evenly"
                        >
                          <FiEdit2 />
                          Tahrirlash
                        </button>
                        <button
                          onClick={() => deletePrivacyPolicy(item.id)}
                            className="w-44 h-10 px-4 py-2 border-2 border-red text-red-600 rounded-lg flex items-center justify-evenly"
                        >
                          <BsFillTrashFill />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolice;
