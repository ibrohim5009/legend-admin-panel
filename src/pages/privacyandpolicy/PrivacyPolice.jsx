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
    <div className="mt-[8px] rounded-lg md:mt-10 mx-auto flex max-w-screen-lg flex-col gap-8 min-h-[840px] min-w-full bg-white shadow-2xl">
      <div className="mx-3 mt-16 mb-6 lg:mx-4">
        <div className="">
          <div className="flex flex-wrap gap-4 md:flex">
            <form className="nimadur" onSubmit={handleSubmit((formData, e) => {
              e.preventDefault();
              onSubmit(formData);
            })}>
              <div className="items-center md:flex">
                <input
                  type="text"
                  placeholder="Privacy and policy text"
                  className="w-[320px] ml-1 md:w-52 h-10 px-4 py-2 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 placeholder-gray-600 ml-5"
                  {...register("text")}
                  value={inputValue} // Set the value of the input field
                  onChange={(e) => setInputValue(e.target.value)} // Update input value
                />
                <button type="submit" className="w-[320px] ml-1 mt-3 md:w-52 h-10 px-4 py-[5px] flex border-2 border-[#dee2e6] text-gray-600 rounded-lg ml-5 hover:bg-blue-400 hover:border-blue-400 hover:text-white">Ma'lumot qo'shish</button>
             </div>
            </form>
          </div>
        </div>
        <div>
          <div className=" ml-1 md:w-[50rem] grid gap-4 ml-5 max-h-[670px] overflow-y-auto mt-5">
            {data.length > 0 &&
              data.map((item) => (
                <div key={item.id} className="w-[320px] md:flex w-full items-center justify-evenly border-2 border-[#dee2e6] p-2">
                  <div className="">
                    <p className=" text-gray-700 font-bold">{item.text}</p>
                    <div className="mt-2 flex gap-11 md:flex gap-11">
                      <button
                        onClick={() => setEditingId(item.id)}
                        className="w-44 h-10 px-4 py-2 border-2 border-blue-400 text-blue-600 rounded-lg flex items-center justify-evenly"
                      >
                        <FiEdit2 />
                        Tahrirlash
                      </button>
                      <button
                        onClick={() => deletePrivacyPolicy(item.id)}
                        className="w-44 h-10 px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg flex items-center justify-evenly"
                      >
                        <BsFillTrashFill />
                        Delete
                      </button>
                    </div>
                  </div>
                  {editingId !== null && editingId === item.id ? (
                    <form
                      onSubmit={handleSubmit((formData, e) => {
                        e.preventDefault();
                        onEdit(formData);
                      })}
                      className=""
                    >
                      <div className="mt-2 flex gap-5 md:flex gap-11">
                        <input
                          type="text"
                          defaultValue={item.text}
                          {...register("text")}
                          className="w-32 md:flex h-10 w-52 items-center justify-evenly rounded-lg border-2 border-[#dee2e6] px-4 py-2 text-gray-600 placeholder-gray-600 focus:outline-none"
                        />
                        <button type="submit" className="w-32 flex items-center justify-evenly md:flex h-10 w-44 rounded-lg border-2 border-gray-400 px-4 py-2 text-black"><GrDocumentUpdate /> Update</button>
                      </div>
                    </form>
                  ) : (
                      <p></p>
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
