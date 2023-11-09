import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BsFillTrashFill } from "react-icons/bs";
import { FiEdit2 } from "react-icons/fi";
import { GrDocumentUpdate } from "react-icons/gr";
import { ToastContainer } from "react-toastify";

function Kategoriya() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const token = sessionStorage.getItem("token");
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
            Accept: "application/json",
          },
        }
      );
      fetchData();
      toast.success("Kategoriya qo'shildi", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.error("Validation Error:", error.response.data);
      } else {
        console.error(error);
      }
      toast.error("Kategoriya qo'shilmadi", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://api.abdullajonov.uz/legend-backend-api/api/parent-category/get"
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
            Accept: "application/json",
          },
        }
      );
      fetchData();
      toast.success("Katogoriya o'chirildi", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error(error);
      toast.error("Katogoriya o'chirilmadi", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const onEdit = async (formData) => {
    const options = {
      method: "POST",
      url: `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/parent-category/${editingId}/update`,
      headers: {
        Accept: "application/json",
      },
      data: { name: formData.name },
    };

    try {
      const response = await axios(options);
      setEditingId(null);
      fetchData();
      toast.success("Katogoriya taxrirlandi", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error(error);
      toast.error("Katogoriya taxrirlanmadi", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="mt-[8px] rounded-lg md:container mx-auto mt-10 flex min-h-[840px] min-w-full max-w-screen-lg flex-col gap-8 bg-white shadow-2xl">
      <div className=" mx-3 mt-16 mb-6 lg:mx-4">
        <div className="">
          <div className="flex flex-wrap gap-4 md:flex">
            <form className="md:block" onSubmit={handleSubmit(onSubmit)}>
              <div className="items-center md:flex">
                <input
                  type="text"
                  placeholder="Katogoriya nomi"
                  className=" w-[320px] md:ml-5 h-10 rounded-lg border-2 w-[300px]  border-[#dee2e6] px-4 py-2 placeholder-gray-600 focus:border-blue-400 focus:outline-none"
                  {...register("name")}
                />
                <input
                  type="text"
                  placeholder="Slug nomi"
                  className=" w-[320px] mt-3 md:ml-5 h-10 w-40 rounded-lg border-2 border-[#dee2e6] px-4 py-2 placeholder-gray-600 focus:border-blue-400 focus:outline-none"
                  {...register("slug")}
                />
                <button
                  type="submit"
                  className=" w-[320px] mt-3 md:ml-5 flex h-10 w-52 rounded-lg border-2 border-[#dee2e6] px-4 py-2 text-center text-gray-600 hover:border-blue-400 hover:bg-blue-400 hover:text-white"
                >
                  <span>Ma'lumotlarni qo'shish</span>
                </button>
              </div>
            </form>
            <div className="md:ml-5 grid max-h-[670px] w-[50rem] gap-4 overflow-y-auto">
              {data.map((category) => (
                <div
                  className="w-[320px] md:flex w-full items-center justify-evenly border-2 border-[#dee2e6] p-2"
                  key={category.id}
                >
                  <span className=" md:w-full font-bold text-gray-700">
                    {category.name}
                  </span>
                  <div className="mt-2 flex gap-11 md:flex gap-11">
                    <button
                      className="border-red flex h-10 w-44 items-center justify-evenly rounded-lg border-2 px-4 py-2 text-red-600"
                      onClick={() => deleteParentCategory(category.id)}
                    >
                      <BsFillTrashFill /> O'chirish
                    </button>
                    <button
                      className="flex h-10 w-44 items-center justify-evenly rounded-lg border-2 border-blue-400 px-4 py-2 text-blue-600"
                      onClick={() => setEditingId(category.id)}
                    >
                      <FiEdit2 /> Tahrirlash
                    </button>
                  </div>

                  {editingId !== null && editingId === category.id ? (
                    <form
                      className="kategoriya_dates"
                      onSubmit={handleSubmit(onEdit)}
                    >
                      <div className="mt-2 flex gap-11 md:flex gap-11">
                        <input
                          defaultValue={category.name}
                          type="text"
                          placeholder="Updated Text"
                          className=" w-32 md:flex h-10 w-52 items-center justify-evenly rounded-lg border-2 border-[#dee2e6] px-4 py-2 text-gray-600 placeholder-gray-600 focus:outline-none"
                          {...register("name")}
                        />
                        <button
                          type="submit"
                          className=" w-32 flex items-center justify-evenly md:flex h-10 w-44 rounded-lg border-2 border-gray-400 px-4 py-2 text-black"
                        >
                          <GrDocumentUpdate/> Updated
                        </button>
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
      <ToastContainer />
    </div>
  );
}

export default Kategoriya;
