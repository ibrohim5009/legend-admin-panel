import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BsFillTrashFill } from 'react-icons/bs';
import { FiEdit2 } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "../loading/Loading";

const News = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const token = sessionStorage.getItem('token');
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

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

  const onEdit = async (data) => {
    const formDatas = new FormData();
    formDatas.append("image", data.image[0]);
    formDatas.append("text", data.text);
    formDatas.append("title", data.title);
    formDatas.append("time", data.time);

    const options = {
      method: 'POST',
      url: `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/news/${editingId}/update`,
      headers: {
        'Accept': 'application/json',
      },
      data: formDatas,
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
            "Accept": "application/json",
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
    setEditingId(null);
    setEditFormData({});
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="mt-[8px] rounded-lg md:mt-10 mx-auto max-w-screen-lg flex flex-col gap-8 min-h-[840px] min-w-full bg-white shadow-2xl p-4">
      <div className="md:mx-3 mt-16 mb-6 lg:mx-4">
        <div className="">
          <div className="flex flex-wrap gap-4 md:flex">
            <form
              className="md:block"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="items-center md:flex">
                <input
                  type="file"
                  className="w-[320px] ml-1 md:w-52 h-10 px-2 py-[3px] text-gray-600 border-2 border-[#dee2e6] bg-white rounded-lg focus:outline-none focus:border-blue-400 ml-5"
                  {...register("image")}
                />
                <input
                  type="text"
                  placeholder="Text"
                  className="w-[320px] ml-1 mt-3 md:w-52 h-10 px-4 py-2 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 placeholder-gray-600 ml-2"
                  {...register("text")}
                  defaultValue={""}
                />
                <input
                  type="text"
                  placeholder="Title"
                  className="w-[320px] ml-1 mt-3 md:w-52 h-10 px-4 py-2 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 placeholder-gray-600 ml-2"
                  {...register("title")}
                  defaultValue={""}
                />
                <input
                  type="date"
                  placeholder="Time"
                  className="w-[320px] ml-1 mt-3 md:w-52 h-10 px-4 py-2 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 ml-2"
                  {...register("time")}
                  defaultValue={"time"}
                />
                <button className="w-[320px] ml-1 mt-3 md:col-span-6 w-52 h-10 border border-blue-400 bg-blue-500 text-white text-lg rounded-lg">
                  <span>Ma'lumotlarni yuborish</span>
                </button>
              </div>
            </form>
            <div className="ml-1 md:min-h-96 overflow-y-auto ml-5">
              {Array.isArray(data) ? (
                data.map((item) => (
                  <div>
                    <div key={item.id} className="w-[320px] md:flex w-[60rem] items-center justify-between border-2 border-[#dee2e6] p-2">
                      <img className=" w-[320px] object-cover md:w-20 h-32 object-cover" src={`https://api.abdullajonov.uz/legend-backend-api/public/storage/images/${item.image}`} alt="" />
                      <div className="flex text-[12px] md:flex items-center justify-center gap-5">
                        <p className=" text-base md:text-gray-600">{item.text}</p>
                        <p>{item.title}</p>
                      </div>
                      <div className="flex gap-5">
                        <button className="w-44 h-10 px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg flex items-center justify-evenly" onClick={() => deleteNews(item.id)}><BsFillTrashFill /></button>
                        <button className=" w-44 h-10 px-4 py-2 border-2 border-blue-400 text-blue-600 rounded-lg flex items-center justify-evenly" onClick={() => editNews(item)}><FiEdit2 /></button>
                      </div>
                    </div>
                    <div className="mt-10 ml-0">
                      {editingId !== null && editingId === item.id && (
                        <form className="flex items-center gap-5" onSubmit={handleSubmit(
                          onEdit
                        )}>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              placeholder="image_upload_product"
                              className="w-52 h-10 px-2 py-[4px] border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 ml-1"
                              {...register("image")}
                            />
                            <input
                              type="text"
                              placeholder="Text"
                              className="w-44 h-10 px-4 py-2 border-2 focus:border-blue-400 rounded-lg flex items-center justify-evenly"
                              {...register("text")}
                              defaultValue={item.text}
                            />
                            <input
                              type="text"
                              placeholder="Title"
                              className="w-44 h-10 px-4 py-2 border-2 focus:border-blue-400 rounded-lg flex items-center justify-evenly"
                              {...register("title")}
                              defaultValue={item.title}
                            />
                            <input
                              type="date"
                              placeholder="Time"
                              className="w-44 h-10 px-4 py-2 border-2 focus:border-blue-400 rounded-lg flex items-center justify-evenly text-gray-600"
                              {...register("time")}
                              defaultValue={item.time}
                            />
                            <button className="w-44 h-10 px-4 py-2 border-2 border-blue-400 text-blue-600 rounded-lg flex items-center justify-evenly" onClick={handleSubmit(onEdit)}>
                              Upload
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p>Data is not available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
