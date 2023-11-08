import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BsFillTrashFill } from 'react-icons/bs';
import { FiEdit2 } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';

const News = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const token = sessionStorage.getItem('token');
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("image", data.image[0]);
    formData.append("text", data.text);
    formData.append("title", data.title);
    formData.append("time", data.time);

    const options = {
      method: "POST",
      url: `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/news/store`,
      headers: {
        "Accept": "application/json",
      },
      data: formData,
    };

    try {
      const response = await axios(options);
      fetchData();
      toast.success('Yangilik qo\'shildi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.error("Validation Error:", error.response.data);
      } else {
        console.error(error);
      }
      toast.error('Yangilik qo\'shilmadi', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://api.abdullajonov.uz/legend-backend-api/api/news/get'
      );
      const newsData = response.data.news.data;
      setData(newsData);
    } catch (error) {
      console.error(error);
    }
  };

  const onEdit = async (datas) => {
    const formDatas = new FormData();
    formDatas.append("image", datas.image[0]);
    formDatas.append("text", datas.text);
    formDatas.append("title", datas.title);
    formDatas.append("time", datas.time);

    const options = {
      method: 'POST',
      url: `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/news/${editingId}/update`,
      headers: {
        'Accept': 'application/json',
      },
      data: formDatas
    };

    try {
      const response = await axios(options);
      fetchData();
      toast.success('Yanglik taxrirlandi', {
        position: toast.POSITION.TOP_RIGHT
      });
      setEditingId(null);
      setEditFormData({});
    } catch (error) {
      console.error(error);
      toast.error('Yangilik taxrirlanmadi', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };


  const deleteNews = async (idToDelete) => {
    try {
      const response = await axios.delete(
        `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/news/${idToDelete}`,
        {
          headers: {
            "Accept": "application.json",
          }
        }
      );
      fetchData();
      toast.success('Yangilik o\'chirildi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      console.error(error);
      toast.error('Yangilik o\'chirilmadi', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const editNews = (item) => {
    setEditFormData(item);
    setEditingId(item.id);
  };

  const onCancelEdit = () => {
    setEditFormData({});
    setEditingId(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="mt-10 mx-auto max-w-screen-lg flex flex-col gap-8 min-h-[840px] min-w-full bg-white shadow-2xl p-4">
      <div className="mt-16 mb-6">
        <div className="flex">
          <form
            className="flex"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex items-center gap-2">
              <input
                type="file"
                className="w-52 h-10 px-2 py-[3px] border-2 border-[#dee2e6] bg-white rounded-lg focus:outline-none focus:border-blue-400 ml-2"
                {...register("image")}
              />
              <input
                type="text"
                placeholder="Text"
                className="w-52 h-10 px-4 py-2 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 placeholder-gray-600 ml-5"
                {...register("text")}
                defaultValue={""}
              />
              <input
                type="text"
                placeholder="Title"
                className="w-52 h-10 px-4 py-2 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 placeholder-gray-600 ml-5"
                {...register("title")}
                defaultValue={""}
              />
              <input
                type="date"
                placeholder="Time"
                className="w-52 h-10 px-4 py-2 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 ml-5"
                {...register("time")}
                defaultValue={"time"}
              />
              <button className="col-span-6 w-52 h-10 border border-blue-400 bg-blue-500 text-white text-lg rounded-lg">
                <span>Ma'lumotlarni yuborish</span>
              </button>
            </div>
          </form>
        </div>
        <div className="max-h-96 overflow-y-auto ml-5">
          {Array.isArray(data) ? (
            data.map((item) => (
              <div
                key={item.id}
                className=" mt-5 w-[60rem] border-2 border-[#dee2e6] flex items-center justify-between p-2"
              >
                <img
                  className="images_around w-20 h-32 object-cover"
                  src={`https://api.abdullajonov.uz/legend-backend-api/public/storage/images/${item.image}`}
                  alt=""
                />
                {editingId !== null && editingId === item.id && (
                  <form
                    className="around_text_around flex items-center gap-5"
                    onSubmit={handleSubmit(onEdit)}
                  >
                    <input
                      type="file"
                      {...register("image")}
                      defaultValue={editFormData.image}
                    />
                    <input
                      type="text"
                      {...register("text")}
                      defaultValue={editFormData.text}
                    />
                    <input
                      type="text"
                      {...register("title")}
                      defaultValue={editFormData.title}
                    />
                    <input
                      type="date"
                      {...register("time")}
                      defaultValue={editFormData.time}
                    />
                    <button className="w-44 h-10 px-4 py-2 border-2 border-blue-400 text-blue-600 rounded-lg flex items-center justify-evenly">
                      <FiEdit2 /> Saqlash
                    </button>
                  </form>
                )}
                <div className="around_text_around flex items-center gap-5">
                  <p>{item.text}</p>
                  <p>{item.title}</p>
                </div>
                <div className="around_button_with flex items-center gap-5">
                  {editingId === item.id ? (
                    <button
                      className="w-44 h-10 px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg flex items-center justify-evenly"
                      onClick={onCancelEdit}
                    >
                      Bekor qilish
                    </button>
                  ) : (
                    <button
                      className="w-44 h-10 px-4 py-2 border-2 border-blue-400 text-blue-600 rounded-lg flex items-center justify-evenly"
                      onClick={() => editNews(item)}
                    >
                      <FiEdit2 /> Tahrirlash
                    </button>
                  )}
                  <button
                    className="w-44 h-10 px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg flex items-center justify-evenly"
                    onClick={() => deleteNews(item.id)}
                  >
                    <BsFillTrashFill /> O'chirish
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="w-96">Ma'lumotlar mavjud emas</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;
