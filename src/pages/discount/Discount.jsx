import axios from "axios";
import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';

const Discount = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const token = sessionStorage.getItem('token');

  const [datas, setDatas] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [discounts, setDiscounts] = useState([]);

  const onSubmit = async (formData) => {
    const form = new FormData();
    form.append("amount", Number(formData.amount));
    form.append("product_slug", formData.product_slug);
    form.append("start_time", formData.start_time);
    form.append("end_time", formData.end_time);

    const options = {
      method: "POST",
      url: `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/discount/store`,
      headers: {
        "Accept": "application/json",
      },
      data: form,
    };

    try {
      const response = await axios(options);
      fetchDiscounts();
      toast.success('Chegirma qo\'shildi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.error("Validation Error:", error.response.data);
      } else {
        console.error(error);
      }
      toast.error('Chegirma qo\'shilmadi', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://api.abdullajonov.uz/legend-backend-api/api/products/get',
      );
      const data = response.data.products.data;
      setDatas(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDiscounts = async () => {
    try {
      const response = await axios.get(
        'https://api.abdullajonov.uz/legend-backend-api/api/discount/get',
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        }
      );
      const discountData = response.data.data;
      setDiscounts(discountData);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteDiscount = async (idToDelete) => {
    try {
      const response = await axios.delete(
        `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/discount/${idToDelete}`,
        {
          headers: {
            "Accept": "application/json",
          }
        }
      );
      fetchDiscounts();
      toast.success('Chegirma o\'chirildi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      console.error(error);
    }
    toast.error('Chegirma o\'chirilmadi', {
      position: toast.POSITION.TOP_RIGHT
    });
  };

  const onEdit = async (formDatas) => {
    const forms = new FormData();
    forms.append("amount", Number(formDatas.amount));
    forms.append("product_slug", formDatas.product_slug);
    forms.append("start_time", formDatas.start_time);
    forms.append("end_time", formDatas.end_time);
    const options = {
      method: "POST",
      url: `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/discount/${editingId}/update`,
      headers: {
        "Accept": "application/json",
      },
      data: formDatas,
    };

    try {
      const response = await axios(options);
      setEditingId(null);
      fetchDiscounts();
      toast.success('Chegirma taxrirlandi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      console.error(error);
    }
    toast.error('Chegirma taxrirlanmadi', {
      position: toast.POSITION.TOP_RIGHT
    });
  };

  useEffect(() => {
    fetchData();
    fetchDiscounts();
  }, []);
  return (
    <div className="mt-10 mx-auto flex max-w-screen-lg flex-col gap-8 min-h-[840px] min-w-full bg-white shadow-2xl">
      <div className="mx-3 mt-16 mb-6 lg:mx-4">
        <div className="grid gap-4">
          <form className="discount_info" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center">
              <input
                type="number"
                placeholder="Discount Amount"
                className="w-52 h-10 px-4 py-1 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 ml-5"
                {...register("amount")}
              />
              <select name="" id="" {...register("product_slug")} className="w-52 h-10 px-4 py-1 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 ml-2">
                {Array.isArray(datas) ? (
                  datas.map((item) => (
                    <option key={item.id} value={item.slug}>{item.slug}</option>
                  ))
                ) : (
                  <option value="">Ma'lumotlar mavjud emas</option>
                )}
              </select>
              <input
                type="date"
                placeholder="Start Date"
                className="w-52 h-10 px-4 py-1 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 ml-2"
                {...register("start_time")}
              />
              <input
                type="date"
                placeholder="End Date"
                className="w-52 h-10 px-4 py-1 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 ml-2"
                {...register("end_time")}
              />
              <button type="submit" className="col-span-6 w-52 h-10 border border-blue-400 bg-blue-500 text-white text-lg rounded-lg ml-5"><span>Submit Data</span></button>
            </div>
          </form>

          <h2 className="text-2xl mb-2 ml-5 font-bold text-gray-600">Existing Discounts</h2>
            <div className="ml-5 max-h-[670px] overflow-y-auto">
            {discounts.map((discount) => (
                <>
                <div key={discount.id} className="mb-5 border border-black p-3 flex flex-wrap justify-between">
                  <p className="text-xl font-bold text-gray-600 mt-2">{discount.amount}% off for</p>
                  <p className="text-xl font-bold text-gray-600 mt-2">{discount.product_slug}</p>
                  <p className="text-xl font-bold text-gray-600 mt-2">from {discount.start_time}</p>
                  <p className="text-xl font-bold text-gray-600 mt-2">to {discount.end_time}</p>
                  <button onClick={() => setEditingId(discount.id)} className=" w-36 h-10 px-4 py-2 border-2 border-blue-400 text-blue-600 rounded-lg flex items-center justify-evenly">Edit</button>
                  <button onClick={() => deleteDiscount(discount.id)} className="w-36 h-10 px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg flex items-center justify-evenly">Delete</button>
                </div>
                {editingId !== null && editingId === discount.id && (
                  <form className="flex" onSubmit={handleSubmit(onEdit)}>
                    <input
                      type="number"
                      placeholder="Discount Amount"
                      className="w-52 h-10 px-4 py-1 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 ml-0"
                      {...register("amount")}
                    />
                    <select name="" id="" {...register("product_slug")} className="w-52 h-10 px-4 py-1 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 ml-2">
                      {Array.isArray(datas) ? (
                        datas.map((item) => (
                          <option key={item.id} value={item.slug}>{item.slug}</option>
                        ))
                      ) : (
                        <option value="">Ma'lumotlar mavjud emas</option>
                      )}
                    </select>
                    <input
                      type="date"
                      placeholder="Start Date"
                      className="w-52 h-10 px-4 py-1 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 ml-2"
                      {...register("start_time")}
                    />
                    <input
                      type="date"
                      placeholder="End Date"
                      className="w-52 h-10 px-4 py-1 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 ml-2"
                      {...register("end_time")}
                    />
                    <button type="submit" className="w-44 h-10 px-4 py-2 border-2 border-blue-400 text-blue-600 rounded-lg flex items-center justify-evenly ml-3"><span>Submit Data</span></button>
                  </form>
                )}
              </>
              ))}
            </div>
          </div>
      </div>
    </div>
  );
}

export default Discount;
