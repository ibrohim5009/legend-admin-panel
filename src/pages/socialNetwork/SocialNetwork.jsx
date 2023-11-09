import axios from "axios";
import { useForm } from "react-hook-form";
import { BsFillTrashFill } from 'react-icons/bs';
import { FiEdit2 } from 'react-icons/fi';
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';

const SocialNetwork = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const token = sessionStorage.getItem('token');
  const [editingId, setEditingId] = useState(null);
  const [data, setData] = useState([]);
  const [editFormData, setEditFormData] = useState({});

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("icon", data.image[0]);
    formData.append("link", data.link);

    const options = {
      method: "POST",
      url: `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/social-network/store`,
      headers: {
        "Accept": "application/json",
      },
      data: formData,
    };
    try {
      const response = await axios(options);
      fetchData();
      toast.success('Ijtomoiy tarmoq qo\'shildi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.error("Validation Error:", error.response.data);
      } else {
        console.error(error);
      }
      toast.error('Ijtomoiy tarmoq qo\'shilmadi', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://api.abdullajonov.uz/legend-backend-api/api/social-network/get',
      );
      const newsData = response.data.data; // Assuming data is nested
      setData(newsData);
    } catch (error) {
      console.error(error);
    }
  };

  const onEdit = async (formData) => {
    const form = new FormData();
    if (formData.image) {
      form.append("icon", formData.icon[0]);
      form.append("link", formData.link);

      const options = {
        method: 'POST',
        url: `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/social-network/${editingId}/update`,
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
        toast.success('Ijtimoiy tarmoq taxrirlandi', {
          position: toast.POSITION.TOP_RIGHT
        });
      } catch (error) {
        console.error(error);
      }
      toast.success('Ijtimoiy tarmoq taxrirlanmadi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } else {
      console.error("formData.image is undefined.");
    }
  };

  const deleteNews = async (idToDelete) => {
    try {
      const response = await axios.delete(
        `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/social-network/${idToDelete}`,
        {
          headers: {
            "Accept": "application/json",
          }
        }
      );
      fetchData();
      toast.success('Ijtimoiy tarmoq o\'chirildi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      console.error(error);
    }
    toast.success('Ijtimoiy tarmoq o\'chirilmadi', {
      position: toast.POSITION.TOP_RIGHT
    });
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
          <form className="product_info" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center">
              <input
                type="file"
                placeholder="image_upload"
                className="w-52 h-10 px-4 py-1 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 ml-5"
                {...register("image")}
              />
              <input
                type="text"
                placeholder="Nomi"
                className="w-52 h-10 px-4 py-1 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 ml-2"
                {...register("link")}
              />
              <button type="submit" className="col-span-6 w-52 h-10 border border-blue-400 bg-blue-500 text-white text-lg rounded-lg ml-5">
                <span>Ma'lumotlarni yuborish</span>
              </button>
            </div>
          </form>

          <div className="ml-5 max-h-[670px] overflow-y-auto">
            {Array.isArray(data) &&
              data.map((item) => (
                <>
                  <div key={item.id} className="m-4 w-80 rounded-lg border border-gray-300 p-3">
                    <img
                      src={`https://api.abdullajonov.uz/legend-backend-api/public/storage/images/${item.icon}`}
                      alt=""
                      className="h-48 w-full rounded-t-lg object-cover"
                    />
                    <p className="text-18 my-2">{item.link}</p>
                    <div className="flex gap-12">
                      <button
                        className="w-48 h-10 bg-red-500 text-white text-17 rounded p-2 border border-red-500 flex items-center justify-center gap-5"
                        onClick={() => deleteNews(item.id)}
                      >
                        <BsFillTrashFill className="mr-2" />
                        Delete
                      </button>
                      <button
                        className=" w-48 h-10 bg-blue-500 text-white text-17 rounded p-2 border border-blue-500 flex items-center justify-center gap-5"
                        onClick={() => editNews(item)}
                      >
                        <FiEdit2 className="mr-2" />
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="editing_social_network">
                    {editingId !== null && editingId === item.id && (
                      <form onSubmit={handleSubmit(onEdit)}>
                        <input
                          type="file"
                          {...register("icon")}
                          className="w-52 h-10 px-4 py-1 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 ml-5"
                        />
                        <input
                          type="text"
                          defaultValue={item.link}
                          {...register("link")}
                          className="w-52 h-10 px-4 py-1 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 ml-2"
                        />
                        <button
                          onClick={() => onEdit(item.id, { link: item.link })}
                          className="w-40 h-10 border border-blue-400 bg-blue-500 text-white text-lg rounded-lg ml-5"
                        >
                          <span>Save</span>
                        </button>
                      </form>

                    )}
                  </div>
                </>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialNetwork;
