import { useForm } from "react-hook-form";
import axios from "axios";
import { useState, useEffect } from "react";
import { BsFillTrashFill } from 'react-icons/bs';
import { FiEdit2 } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';

const History = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const token = sessionStorage.getItem('token');
  const [editingItemId, setEditingItemId] = useState(null);
  const [newText, setNewText] = useState('');

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("text", data.text);

    const options = {
      method: "POST",
      url: `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/history/store`,
      headers: {
        "Accept": "application/json",
      },
      data: formData
    };

    try {
      const response = await axios(options);
      fetchData();
      toast.success('Legend tarixi qo\'shildi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.error("Validation Error:", error.response.data);
      } else {
        console.error(error);
      }
      toast.error('Legend tarixi qo\'shilmadi', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const editHistoricalItem = async (idToUpdate, newText) => {
    try {
      const options = {
        method: 'POST',
        url: `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/history/${idToUpdate}/update`,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        data: { text: newText }
      };
      const response = await axios.request(options);
      fetchData(); // Refresh the data after a successful edit
      toast.success('Tarixni tahrirlandi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      console.error(error);
      toast.error('Tarixni tahrirlovchi xatolik', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const deletePrivacyPolicy = async (idToDelete) => {
    try {
      const options = {
        method: "DELETE",
        url: `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/history/${idToDelete}/id`,
        headers: {
          "Accept": "application.json",
        },
      };
      const response = await axios(options);
      fetchData();
      toast.success('Tarixni o\'chirildi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      console.error(error);
      toast.error('Tarixni o\'chirilmadi', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://api.abdullajonov.uz/legend-backend-api/api/history/get"
      );
      const data = response.data.histories;
      setData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const startEdit = (item) => {
    setEditingItemId(item.id);
    setNewText(item.text);
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setNewText('');
  };

  const saveEdit = () => {
    if (newText.trim() !== '') {
      editHistoricalItem(editingItemId, newText);
      setEditingItemId(null);
      setNewText('');
    }
  };

  return (
    <div className="mt-[8px] rounded-lg md:mt-10 mx-auto flex max-w-screen-lg flex-col gap-8 min-h-[840px] min-w-full bg-white shadow-2xl">
      <div className="mx-3 mt-16 mb-6 lg:mx-4">
        <div className="">
          <div className="flex flex-wrap gap-4 md:flex">
          <form onSubmit={handleSubmit(onSubmit)}>
              <div className="items-center md:flex">
              <input
                type="text"
                placeholder="History text..."
                  className=" w-[320px] ml-1 md:w-52 h-10 px-4 py-2 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 placeholder-gray-600 ml-5"
                {...register("text")}
              />
                <button type="submit" className=" w-[320px] mt-3 ml-1 md:w-52 h-10 px-4 py-2 flex text-center border-2 border-[#dee2e6] text-gray-600 rounded-lg ml-5 hover:bg-blue-400 hover:border-blue-400 hover:text-white">
                Ma'lumotlarni yuborish
              </button>
            </div>
          </form>
          <div className="ml-1 md:w-[50rem] grid gap-4 ml-5 max-h-[670px] overflow-y-auto mt-5">
            {data && data.length > 0 &&
              data.map((item) => (
                <div key={item.id} className="w-[320px] md:flex w-full items-center justify-evenly border-2 border-[#dee2e6] p-2">
                  {editingItemId === item.id ? (
                    <div className="">
                      <textarea
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        style={{ resize: "none" }} // resize xususiyatini cheklang
                        className="w-full mt-1 h-full md:w-[45rem] h-[24rem] border border-black rounded-md px-4 mt-8 text-gray-600 p-2"
                      ></textarea>
                      <div className="flex mt-5 gap-11">
                        <button onClick={saveEdit} className="w-44 h-10 px-4 py-2 border-2 border-blue-400 text-blue-600 rounded-lg flex items-center justify-evenly">
                          Save
                        </button>
                        <button onClick={cancelEdit} className="w-44 h-10 px-4 py-2 border-2 border-red text-red-600 rounded-lg flex items-center justify-evenly">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                      <>
                        <div className="">
                          <p textarea className=" text-base md:text-xl font-semibold text-gray-600">{item.text}</p>
                          <div className="flex mt-5 space-x-4">
                            <button onClick={() => startEdit(item)} className="w-48 h-10 border border-blue-500 rounded-md bg-blue-500 text-white text-lg">
                              Tahrirlash
                            </button>
                            <button onClick={() => deletePrivacyPolicy(item.id)} className="w-48 h-10 border border-red-500 rounded-md bg-red-500 text-white text-lg">
                              O'chirish
                            </button>
                          </div>
                        </div>
                    </>
                  )}
                </div>
              ))
            }
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;
