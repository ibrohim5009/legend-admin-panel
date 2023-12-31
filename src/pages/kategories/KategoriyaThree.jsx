import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BsFillTrashFill } from 'react-icons/bs';
import { FiEdit2 } from 'react-icons/fi';
import { GrDocumentUpdate } from 'react-icons/gr';
import { ToastContainer, toast } from 'react-toastify';

function KategoriyaThree() {
  const [data, setData] = useState([]);
  const [datas, setDatas] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const token = sessionStorage.getItem('token');

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("child_type_id", data.child_type_id);

    const options = {
      method: "POST",
      url: `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/child-category/store`,
      headers: {
        "Accept": "application/json",
      },
      data: formData,
    };

    try {
      const response = await axios(options);
      fetchData();
      toast.success('Uchinchi katogoriya qo\'shildi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.error("Validation Error:", error.response.data);
      } else {
        console.error(error);
      }
      toast.error('Uchinchi katogoriya qo\'shilmadi', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const fetchDatas = async () => {
    try {
      const response = await axios.get(
        'https://api.abdullajonov.uz/legend-backend-api/api/child-category-type/get',
      );
      const data = response.data.data;
      setDatas(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://api.abdullajonov.uz/legend-backend-api/api/child-category/get',
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
        `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/child-category/${idToDelete}`,
        {
          headers: {
            "Accept": "application/json",
          }
        }
      );
      fetchData();
      toast.success('Uchinchi katogoriya o\'chirildi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      console.error(error);
    }
    toast.success('Uchinchi katogoriya o\'chirilmadi', {
      position: toast.POSITION.TOP_RIGHT
    });
  };

  const onEdit = async (formData) => {
    const options = {
      method: "POST",
      url: `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/child-category/${editingId}/update`,
      headers: {
        "Accept": "application/json",
      },
      data: { name: formData.name },
    };

    try {
      const response = await axios(options);
      fetchData();
      toast.success('Uchinchi katogoriya taxrirlandi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      console.error(error);
    }
    toast.success('Uchinchi katogoriya taxrirlanmadi', {
      position: toast.POSITION.TOP_RIGHT
    });
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchDatas();
  }, []);

  return (
    <div className="mt-[8px] rounded-lg md:mt-10 mx-auto flex max-w-screen-lg flex-col gap-8 min-h-[840px] min-w-full bg-white shadow-2xl">
      <div className="mx-3 mt-16 mb-6 lg:mx-4">
        <div className="">
          <div className="flex flex-wrap gap-4 md:flex">
            <form className="" onSubmit={handleSubmit(onSubmit)}>
              <div className="items-center md:flex">
                <select
                  name="parent_id"
                  id="parent_id"
                  {...register("child_type_id")}
                  className="w-[320px] ml-1 md:w-52 h-10 px-4 py-2 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 ml-5"
                >
                  {datas.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Nomi"
                  className="w-[320px] ml-1 mt-3 md:w-52 h-10 px-4 py-2 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 placeholder-gray-600 ml-5"
                  {...register("name")}
                />
                <button type="submit" className="w-[320px] mt-3 ml-1 md:w-52 h-10 px-4 py-2 flex text-center border-2 border-[#dee2e6] text-gray-600 rounded-lg ml-5 hover:bg-blue-400 hover:border-blue-400 hover:text-white">
                  <span>Ma'lumotlarni yuborish</span>
                </button>
             </div>
            </form>
          </div>
          <div>
            <div className="ml-1 md:w-[50rem] grid gap-4 ml-5 max-h-[670px] overflow-y-auto mt-5">
              {data.map((item) => (
                <div className="w-[320px] md:flex w-full items-center justify-evenly border-2 border-[#dee2e6] p-2" key={item.id}>
                  <p className="text-gray-600 md:text-gray-700 font-bold">{item.name}</p>
                  <div className="mt-2 flex gap-11 md:flex gap-11">
                    <button className="border-red flex h-10 w-44 items-center justify-evenly rounded-lg border-2 px-4 py-2 text-red-600" onClick={() => deleteChildCategory(item.id)}>
                      <BsFillTrashFill /> O'chirish
                    </button>
                    <button type="button" className="flex h-10 w-44 items-center justify-evenly rounded-lg border-2 border-blue-400 px-4 py-2 text-blue-600" onClick={() => setEditingId(item.id)}>
                      <FiEdit2 /> Tahrirlash
                    </button>
                  </div>
                  {editingId !== null && editingId === item.id && (
                    <>
                      <form className="kategoriya_child_dates" onSubmit={handleSubmit(onEdit)}>
                        <input
                          type="text"
                          defaultValue={item.name}
                          className="w-52 h-10 border-2 border-blue-700 bg-blue-700 text-white rounded-lg px-4 mt-5 ml-5"
                          {...register("name")}
                        />
                        <button type="submit" className="w-52 h-10 bg-blue-800 text-white rounded-lg text-center ml-5">
                          <GrDocumentUpdate /> Upload
                        </button>
                      </form>
                    </>
                  )}
                </div>
              ))}
           </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default KategoriyaThree;
