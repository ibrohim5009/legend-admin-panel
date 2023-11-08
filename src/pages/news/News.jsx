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
      toast.error('Yanglik o\'chirilmadi', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const editNews = (item) => {
    setEditFormData(item);
    setEditingId(item.id);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="mt-10 mx-auto max-w-screen-lg flex flex-col gap-8 min-h-[840px] min-w-full bg-white shadow-2xl p-4">
      <div className="mt-16 mb-6">
        <div className="grid grid-cols-6 gap-4">
          <form
            className=" grid gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex items-center col-span-6">
              <input
                type="file"
                className=" flex items-center justify-center text-center p-1 w-52 h-10 border border-black rounded-md px-4"
                {...register("image")}
              />
              <input
                type="text"
                placeholder="Text"
                className="order_input col-span-2 w-52 h-10 border border-black rounded-md px-4"
                {...register("text")}
                defaultValue={""}
              />
              <input
                type="text"
                placeholder="Title"
                className="product_slug_input col-span-2 w-52 h-10 border border-black rounded-md px-4"
                {...register("title")}
                defaultValue={""}
              />
              <input
                type="date"
                placeholder="Time"
                className="time_input col-span-1 w-52 h-10 border border-black rounded-md px-4"
                {...register("time")}
                defaultValue={"time"}
              />
              <button className="news_btn col-span-6 w-52 h-10 border border-black bg-blue-500 text-white text-lg">
                <span>Ma'lumotlarni yuborish</span>
              </button>
            </div>
          </form>
        </div>
        <div className="news-container max-h-96 overflow-y-auto">
          {Array.isArray(data) ? (
            data.map((item) => (
              <div
                key={item.id}
                className="news-item w-96 border border-black rounded-md p-2 ml-4 mb-4 flex"
              >
                <img
                  className="images_around w-20 h-36 object-cover"
                  src={`https://api.abdullajonov.uz/legend-backend-api/public/storage/images/${item.image}`}
                  alt=""
                />
                <div className="around_text_around flex items-center gap-5">
                  <p>{item.text}</p>
                  <p>{item.title}</p>
                </div>
                <div className="around_button_with flex items-center gap-5">
                  <button
                    className="deleted_news_button w-32 h-10 border border-red-500 rounded-md bg-red-500 text-white text-lg"
                    onClick={() => deleteNews(item.id)}
                  >
                    <BsFillTrashFill />
                  </button>
                  <button
                    className="edit_news_button w-32 h-10 border border-blue-500 rounded-md bg-blue-500 text-white text-lg"
                    onClick={() => editNews(item)}
                  >
                    <FiEdit2 />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="w-96">Data is not available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;
