import { Card } from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { BsFillTrashFill } from 'react-icons/bs';
import { FiEdit2 } from 'react-icons/fi';
import Popup from "reactjs-popup";
import { ToastContainer, toast } from 'react-toastify';


const contentStyle = {
  maxWidth: "100%",
  width: "100%",
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: "center",
  backgroundColor: 'rgba(0, 0, 0,0.65)',
  backdropFilter: 'blur(4px)',
};

export function Tables() {
  const [data, setData] = useState([]); // Product category data
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const token = sessionStorage.getItem('token'); // User token
  const [editingId, setEditingId] = useState(null); // ID of the product being edited
  const [datas, setDatas] = useState([]); // Product data
  const [editFormData, setEditFormData] = useState({}); // Data for editing a product
  const [isEditing, setIsEditing] = useState(false); // Edit mode flag

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", Number(data.price));
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("slug", data.slug);
    formData.append("shipping_price", data.shipping_price);
    formData.append("image", data.image[0]);

    const options = {
      method: "POST",
      url: `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/products/store`,
      headers: {
        Accept: "application/json",
      },
      data: formData,
    };

    try {
      const response = await axios(options);
      fetchDatas();
      // Show a success toast notification
      toast.success('Maxsulot qo\'shildi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.error("Xatolik: Tadqiqot xatoliklari", error.response.data);
      } else {
        console.error(error);
      }
      // Show an error toast notification
      toast.error('Maxsulot qo\'shilmadi', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  useEffect(() => {
    // Fetch product category data when the component is mounted
    async function makeRequest() {
      const url = "https://api.abdullajonov.uz/legend-backend-api/api/child-category/get";
      const options = {
        method: "GET",
        headers: { Accept: "application/json" },
      };

      try {
        const response = await fetch(url, options);
        const jsonDatas = await response.json();
        setData(jsonDatas.data);
      } catch (error) {
        console.error(error);
      }
    }

    makeRequest();
  }, []);

  const fetchDatas = async () => {
    try {
      // Fetch product data from the API
      const response = await axios.get("https://api.abdullajonov.uz/legend-backend-api/api/products/get");
      const newsData = response.data.products.data;
      setDatas(newsData);
    } catch (error) {
      console.error(error);
    }
  };

  const onEdit = async (formData) => {
    const updatedData = new FormData();
    updatedData.append("name", formData.name);
    updatedData.append("price", Number(formData.price));
    updatedData.append("description", formData.description);
    updatedData.append("category", formData.category);
    updatedData.append("slug", formData.slug);
    updatedData.append("shipping_price", formData.shipping_price);
    updatedData.append("image", formData.image[0]);

    const options = {
      method: "POST",
      url: `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/products/${editingId}/update`,
      headers: {
        Accept: "application/json",
      },
      data: updatedData,
    };

    try {
      const response = await axios(options);
      fetchDatas();
      setIsEditing(false);
      // Show a success toast notification
      toast.success('Maxsulotni taxrirlash yakulandi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      console.error(error);
      // Show an error toast notification
      toast.error('Maxsulotni taxrirlash yakulanmadi', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const deleteNews = async (idToDelete) => {
    try {
      const response = await axios.delete(
        `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/products/${idToDelete}`,
        {
          headers: {
            Accept: "application.json",
          },
        }
      );
      fetchDatas();
      // Show a success toast notification
      toast.success('Maxsulotni o\'chirish yakulandi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      console.error(error);
      // Show an error toast notification
      toast.error('Maxsulotni o\'chirish yakulanmadi', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const fetchSearchData = async () => {
    const options = {
      method: 'GET',
      url: 'https://api.abdullajonov.uz/legend-backend-api/api/search',
      headers: { Accept: 'application/json' }
    };

    try {
      const { data } = await axios.request(options);
      setData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const editNews = (item) => {
    setEditFormData(item);
    setEditingId(item.id);
    setIsEditing(true);
  };

  useEffect(() => {
    fetchDatas(); // Fetch product data when the component is mounted
  }, []);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <div>
          <Popup
            trigger={<button className="bg-blue-500 text-white p-2 rounded-lg ml-5 mt-5"> Mahsulot qo'shish </button>}
            modal
            contentStyle={contentStyle}
          >
              {(close) => (
              <div className=" -z-40 backdrop-blur bg-black">
                <form className=" z-50 grid grid-rows-3 gap-4 h-[550px] w-[700px] p-5 bg-white rounded-lg" onSubmit={handleSubmit(onSubmit)}>
                  <a className="close absolute text-4xl right-10 top-2 cursor-pointer" onClick={close}>
                    &times;
                  </a>
                  <input
                    type="text"
                    placeholder="Nomi"
                    className="w-5/6 h-10 border border-black rounded-lg p-2 ml-4 mt-3"
                    {...register("name")}
                  />
                  {errors.name && <span className="text-red-500 text-sm ml-4">This field is required.</span>}
                  <input
                    type="number"
                    placeholder="Narxi"
                    className="w-5/6 h-10 border border-black rounded-lg p-2 ml-4"
                    {...register("price")}
                  />
                  {errors.price && <span className="text-red-500 text-sm ml-4">This field is required.</span>}
                  <input
                    type="text"
                    placeholder="Tavsifi"
                    className="w-5/6 h-10 border border-black rounded-lg p-2 ml-4"
                    {...register("description")}
                  />
                  {errors.description && <span className="text-red-500 text-sm ml-4">This field is required.</span>}
                  <div className="flex gap-6">
                    <input
                      type="file"
                      placeholder="image_upload"
                      className="w-60 h-10 border border-black rounded-lg p-2 ml-4"
                      {...register("image")}
                    />
                    {errors.image && <span className="text-red-500 text-sm ml-4">This field is required.</span>}
                    <select name="" id="" {...register("category")} className=" w-72 p-2 border border-black rounded-lg">
                      {Array.isArray(data) ? (
                        data.map((item) => (
                          <option key={item.id} value={item.slug}>{item.name}</option>
                        ))
                      ) : (
                        <option value="">Ma'lumotlar mavjud emas</option>
                      )}
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Nimadur"
                    className="w-5/6 h-10 border border-black rounded-lg p-2 ml-4 mt-3"
                    {...register("slug")}
                  />
                  {errors.slug && <span className="text-red-500 text-sm ml-4">This field is required.</span>}
                  <input
                    type="number"
                    placeholder="Yetkazib berish narxi"
                    className="w-5/6 h-10 border border-black rounded-lg p-2 ml-4 mt-3"
                    {...register("shipping_price")}
                  />
                  {errors.shipping_price && <span className="text-red-500 text-sm ml-4">This field is required.</span>}
                  <button type="submit" onClick={onSubmit} className="border border-black w-72 h-12 ml-4 mt-4">
                    <span className="text-black">Ma'lumotlarni yuborish</span>
                  </button>
                </form>
              </div>
              )}
          </Popup>
        </div>

        <div className="flex flex-wrap justify-center items-center m-20">
          {Array.isArray(datas) ? (
            datas.map((item) => (
              isEditing && editingId === item.id ? (
                // Edit form
                <div key={item.id} className=" p-4 border border-gray-300 rounded-lg m-4 w-80">
                  {isEditing && (
                    <form className="edit-form" onSubmit={handleSubmit(onEdit)}>
                      <input
                        type="text"
                        placeholder="Nomi"
                        className="w-5/6 h-10 border border-black rounded-lg p-2 ml-4"
                        {...register("name")}
                        defaultValue={editFormData.name}
                      />
                      {errors.name && <span className="text-red-500 text-sm ml-4">This field is required.</span>}
                      <input
                        type="number"
                        placeholder="Narxi"
                        className="w-5/6 h-10 border border-black rounded-lg p-2 ml-4"
                        {...register("price")}
                        defaultValue={editFormData.price}
                      />
                      {errors.price && <span className="text-red-500 text-sm ml-4">This field is required.</span>}
                      <input
                        type="text"
                        placeholder="Tavsifi"
                        className="w-5/6 h-10 border border-black rounded-lg p-2 ml-4"
                        {...register("description")}
                        defaultValue={editFormData.description}
                      />
                      {errors.description && <span className="text-red-500 text-sm ml-4">This field is required.</span>}
                      <input
                        type="file"
                        placeholder="image_upload"
                        className="w-5/6 h-10 border border-black rounded-lg p-2 ml-4"
                        {...register("image")}
                      />
                      {errors.image && <span className="text-red-500 text-sm ml-4">This field is required.</span>}
                      <select
                        name="category"
                        id="category"
                        {...register("category")}
                        className="w-72 p-2 border border-black rounded-lg ml-4"
                        defaultValue={editFormData.category}
                      >
                        {errors.category && <span className="text-red-500 text-sm ml-4">This field is required.</span>}
                        {Array.isArray(data) ? (
                          data.map((item) => (
                            <option key={item.id} value={item.slug}>
                              {item.name}
                            </option>
                          ))
                        ) : (
                          <option value="">Ma'lumotlar mavjud emas</option>
                        )}
                      </select>
                      <input
                        type="text"
                        placeholder="Nimadur"
                        className="w-5/6 h-10 border border-black rounded-lg p-2 ml-4"
                        {...register("slug")}
                        defaultValue={editFormData.slug}
                      />
                      {errors.slug && <span className="text-red-500 text-sm ml-4">This field is required.</span>}
                      <input
                        type="number"
                        placeholder="Yetkazib berish narxi"
                        className="w-5/6 h-10 border border-black rounded-lg p-2 ml-4"
                        {...register("shipping_price")}
                        defaultValue={editFormData.shipping_price}
                      />
                      {errors.shipping_price && <span className="text-red-500 text-sm ml-4">This field is required.</span>}
                      <button type="submit" className="border border-black w-80 h-10 ml-4 mt-4">
                        <span className="text-black">Ma'lumotlarni saqlash</span>
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <div key={item.id} className="border border-gray-300 rounded-lg m-4 flex-wrap w-[305px]">
                  <img
                    src={`https://api.abdullajonov.uz/legend-backend-api/public/storage/images/${item.image}`}
                    alt=""
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="flex flex-col p-4">
                      <div className="flex justify-between">
                        <p className="text-xl font-semibold">{item.name}</p>
                        <p className="text-lg">{item.price}</p>
                    </div>
                      <div className="flex justify-between mt-3">
                        <p className="text-lg">{item.description}</p>
                        <p className="text-lg">{item.slug}</p>
                   </div>
                      <div className="flex justify-between mt-3">
                        <p className="text-lg">{item.shipping_price}</p>
                        <p className="text-lg">{item.category}</p>
                    </div>
                  </div>
                  <div className="flex justify-center m-4">
                    <button onClick={() => deleteNews(item.id)} className="border border-red-500 w-40 h-10 mr-2 flex items-center justify-center rounded-lg">
                        <BsFillTrashFill className="text-red-500 text-xl" />
                    </button>
                      <button onClick={() => editNews(item)} className="border border-blue-500 w-40 h-10 flex items-center justify-center rounded-lg">
                        <FiEdit2 className="text-blue-500 text-xl" />
                    </button>
                  </div>
                </div>
              )
            ))
          ) : (
            <p className="text-lg">Ma'lumotlar mavjud emas</p>
          )}
        </div>

      </Card>
    </div>
  );
}

export default Tables;
