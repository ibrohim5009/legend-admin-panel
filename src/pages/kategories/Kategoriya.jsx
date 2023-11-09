import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BsFillTrashFill } from 'react-icons/bs';
import { FiEdit2 } from 'react-icons/fi';
import { GrDocumentUpdate } from 'react-icons/gr';
import { ToastContainer } from "react-toastify";

function Kategoriya() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const token = sessionStorage.getItem('token');
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const onSubmit = async (formData) => {
    const formDataObject = new FormData();
    formDataObject.append("name", formData.name);
    formDataObject.append("slug", formData.slug);

    try {
      const response = await axios.post(
        `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/parent-category/store`,
        formDataObject,
        {
          headers: {
            "Accept": "application/json",
          }
        }
      );
      fetchData();
      toast.success('Kategoriya qo\'shildi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.error("Validation Error:", error.response.data);
      } else {
        console.error(error);
      }
      toast.error('Kategoriya qo\'shilmadi', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }


  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://api.abdullajonov.uz/legend-backend-api/api/parent-category/get'
      );
      const data = response.data.data;
      setData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteParentCategory = async (idToDelete) => {
    try {
      const response = await axios.delete(
        `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/parent-category/${idToDelete}`,
        {
          headers: {
            "Accept": "application/json",
          }
        }
      );
      fetchData();
      toast.success('Katogoriya o\'chirildi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      console.error(error);
      toast.error('Katogoriya o\'chirilmadi', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const onEdit = async (formData) => {
    const options = {
      method: "POST",
      url: `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/parent-category/${editingId}/update`,
      headers: {
        "Accept": "application/json",
      },
      data: { name: formData.name },
    };

    try {
      const response = await axios(options);
      setEditingId(null);
      fetchData();
      toast.success('Katogoriya taxrirlandi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      console.error(error);
      toast.error('Katogoriya taxrirlanmadi', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="mt-10 mx-auto flex max-w-screen-lg flex-col gap-8 min-h-[840px] min-w-full bg-white shadow-2xl">
      <div className="mx-3 mt-16 mb-6 lg:mx-4">
        <div className="">
          <div className=" flex-wrap flex md:flex gap-4">
            <form className=" flex md:block" onSubmit={handleSubmit(onSubmit)}>
              <div className=" flex-wrap flex md:flex items-center">
                <input
                  type="text"
                  placeholder="Katogoriya nomi"
                  className=" w-40 ml-0  md:w-52 h-10 px-4 py-2 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 placeholder-gray-600 ml-5"
                  {...register("name")}
                />
                <input
                  type="text"
                  placeholder="Slug nomi"
                  className=" w-40 md:w-52 h-10 px-4 py-2 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 placeholder-gray-600 ml-5"
                  {...register("slug")}
                />
                <button type="submit" className=" w-52 h-10 px-4 py-2 flex text-center border-2 border-[#dee2e6] text-black rounded-lg ml-5 hover:bg-blue-400 hover:border-blue-400 hover:text-white">
                  <span>Ma'lumotlarni qo'shish</span>
                </button>
              </div>
            </form>
            <div className="w-[50rem] grid gap-4 ml-5 max-h-[670px] overflow-y-auto">
              {data.map((category) => (
                <div className="w-full border-2 border-[#dee2e6] flex items-center justify-evenly p-2" key={category.id}>
                  <span className="w-full text-gray-700 font-bold">{category.name}</span>
                  <div className="flex gap-11">
                    <button className="w-44 h-10 px-4 py-2 border-2 border-red text-red-600 rounded-lg flex items-center justify-evenly" onClick={() => deleteParentCategory(category.id)}>
                      <BsFillTrashFill /> O'chirish
                    </button>
                    <button className="w-44 h-10 px-4 py-2 border-2 border-blue-400 text-blue-600 rounded-lg flex items-center justify-evenly" onClick={() => setEditingId(category.id)}>
                      <FiEdit2 /> Tahrirlash
                    </button>
                  </div>

                  {editingId !== null && editingId === category.id ? (
                    <form className="kategoriya_dates" onSubmit={handleSubmit(onEdit)}>
                      <input
                        defaultValue={category.name}
                        type="text"
                        placeholder="Updated Text"
                        className="w-52 h-10 px-4 py-2 border-2 border-blue-700 bg-blue-700 text-white rounded-lg focus:outline-none placeholder-gray-100 ml-5"
                        {...register("name")}
                      />
                      <button type="submit" className="w-52 h-10 px-4 py-2 bg-blue-800 text-white rounded-lg text-center ml-5">
                        <GrDocumentUpdate /> Updated
                      </button>
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
      <ToastContainer/>
    </div>

  );
}

export default Kategoriya;
