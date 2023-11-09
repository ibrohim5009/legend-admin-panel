import axios from "axios";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainpageNews = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const token = sessionStorage.getItem('token');
  const [editingId, setEditingId] = useState(null);
  const [data, setData] = useState([]);
  const [editFormData, setEditFormData] = useState({});

  const onSubmit = async (formData) => {
    const form = new FormData();
    form.append("image", formData.image[0]);
    form.append("text", formData.text);
    form.append("image_2", formData.image_2[0]);

    const options = {
      method: "POST",
      url: `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/main-page-news/store`,
      headers: {
        "Accept": "application/json",
      },
      data: form,
    };

    try {
      const response = await axios(options);
      fetchData();
      toast.success('Asosiy sahifaga yangilik qo\'shildi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.error("Validation Error:", error.response.data);
      } else {
        console.error(error);
      }
      toast.error('Asosiy sahifaga yangilik qo\'shilmadi', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://api.abdullajonov.uz/legend-backend-api/api/main-page-news/get',
      );
      setData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onEdit = async (formData) => {
    const form = new FormData();
    if (formData.image) {
      form.append("image", formData.image[0]);
      form.append("image_2", formData.image_2[0]);
      form.append("text", formData.text);

      const options = {
        method: 'POST',
        url: `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/main-page-news/${editingId}/update`,
        headers: {
          'Content-Type': 'multipart/form-data;',
          Accept: 'application/json'
        },
        data: form,
      };

      try {
        const response = await axios(options);
        setEditingId(null);
        fetchData();
        toast.success('Maxsulotni taxrirlash yakulandi', {
          position: toast.POSITION.TOP_RIGHT
        });
      } catch (error) {
        console.error(error);
        toast.error('Maxsulotni taxrirlash yakulanmadi', {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    } else {
      console.error("formData.image is undefined.");
    }
  };

  const deleteNews = async (idToDelete) => {
    try {
      const response = await axios.delete(
        `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/main-page-news/${idToDelete}/delete`,
        {
          headers: {
            "Accept": "application/json",
          }
        }
      );
      fetchData();
      toast.success('Maxsulotni o\'chirish yakulandi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      console.error(error);
      toast.error('Maxsulotni o\'chirish yakulanmadi', {
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
    <div className="mt-10 mx-auto flex max-w-screen-lg flex-col gap-8 min-h-[840px] min-w-full bg-white shadow-2xl">
      <div className="mx-3 mt-16 mb-6 lg:mx-4">
        <div className="grid gap-4">
          <form className="new_info" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center">
              <input
                type="file"
                placeholder="image_upload_product"
                className="w-52 h-10 px-4 py-1 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 ml-5"
                {...register("image")}
              />
              <input
                className="w-52 h-10 px-4 py-1 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 ml-2"
                type="file"
                {...register("image_2")}
              />
              <input
                type="text"
                placeholder="Text"
                className="w-52 h-10 px-4 py-2 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 ml-2"
                {...register("text")}
              />
              <button type="submit" className="col-span-6 w-52 h-10 border border-blue-400 bg-blue-500 text-white text-lg rounded-lg ml-5">
                <span>Ma'lumotlarni yuborish</span>
              </button>
            </div>
          </form>

          <div className=" ml-5 max-h-[670px] overflow-y-auto">
            {Array.isArray(data) && data.map((item) => (
              <>
                <div className="w-full border-2 border-[#dee2e6] flex items-center justify-evenly p-2 mt-3" key={item.id}>
                  <img
                    className="w-20 h-32 object-cover"
                    src={`https://api.abdullajonov.uz/legend-backend-api/public/storage/images/${item.image}`}
                    alt={item.title}
                  />
                  <img
                    className="w-20 h-32 object-cover"
                    src={`https://api.abdullajonov.uz/legend-backend-api/public/storage/images/${item.image_2}`}
                    alt={item.title}
                  />
                  <p className="main_page_text">{item.text}</p>
                  <div className="flex gap-5">
                    <button
                      className="w-44 h-10 px-4 py-2 border-2 border-blue-400 text-blue-600 rounded-lg flex items-center justify-evenly"
                      onClick={() => editNews(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="w-44 h-10 px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg flex items-center justify-evenly"
                      onClick={() => deleteNews(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="flex mt-5 ">
                  {editingId !== null && editingId === item.id && (
                    <form onSubmit={handleSubmit(onEdit)} className="flex">
                      <input
                        className="w-52 h-10 px-4 py-1 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600"
                        type="file"
                        {...register("image")}
                      />
                      <input
                        className="w-52 h-10 px-4 py-1 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 ml-2"
                        type="file"
                        {...register("image_2")}
                      />
                      <input
                        className="w-52 h-10 px-4 py-2 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 ml-2"
                        type="text"
                        {...register("text")}
                      />
                      <button
                        className="w-44 h-10 px-4 py-2 border-2 border-blue-400 text-blue-600 rounded-lg flex items-center justify-evenly ml-3"
                        onClick={() => onEdit(item.id, { name: item.text })}
                      >
                        Save
                      </button>
                    </form>
                  )}
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default MainpageNews;
