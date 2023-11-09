import { Card, Input } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsFillTrashFill } from "react-icons/bs";
import { FiEdit2 } from "react-icons/fi";
import { toast } from "react-toastify";
import Popup from "reactjs-popup";

const contentStyle = {
  maxWidth: "100%",
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0,0.65)",
  backdropFilter: "blur(4px)",
};

export function Tables() {
  const [data, setData] = useState([]); // Product category data
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const token = sessionStorage.getItem("token"); // User token
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
      toast.success("Maxsulot qo'shildi", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.error("Xatolik: Tadqiqot xatoliklari", error.response.data);
      } else {
        console.error(error);
      }
      // Show an error toast notification
      toast.error("Maxsulot qo'shilmadi", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  useEffect(() => {
    // Fetch product category data when the component is mounted
    async function makeRequest() {
      const url =
        "https://api.abdullajonov.uz/legend-backend-api/api/child-category/get";
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
      const response = await axios.get(
        "https://api.abdullajonov.uz/legend-backend-api/api/products/get"
      );
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
      toast.success("Maxsulotni taxrirlash yakulandi", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error(error);
      // Show an error toast notification
      toast.error("Maxsulotni taxrirlash yakulanmadi", {
        position: toast.POSITION.TOP_RIGHT,
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
      toast.success("Maxsulotni o'chirish yakulandi", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error(error);
      // Show an error toast notification
      toast.error("Maxsulotni o'chirish yakulanmadi", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const fetchSearchData = async () => {
    const options = {
      method: "GET",
      url: "https://api.abdullajonov.uz/legend-backend-api/api/search",
      headers: { Accept: "application/json" },
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    let { search } = e.target;
    console.log(search);
    try {
      let response = await axios.get(
        `https://api.abdullajonov.uz/legend-backend-api/api/search?query=${search.value}`
      );
      setProducts(response?.data?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return;
    }
  }
  console.log(products, "prducts");
  const [input, setInput] = useState();
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <div className="mr-auto ml-5 mt-5 md:mr-4 md:w-56">
          <form onSubmit={handleSearch}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              name="search"
              label="Type here"
            />
          </form>
        </div>
        <div className=" mt-5 flex items-center justify-around gap-5">
          {Array.isArray(products) ? (
            input?.length !== 0 &&
            products.map((item) =>
              isEditing && editingId === item.id ? (
                // Edit form
                <div
                  key={item.id}
                  className="m-4 w-80 rounded-lg border border-gray-300 p-4"
                >
                  {isEditing && (
                    <form className="edit-form" onSubmit={handleSubmit(onEdit)}>
                      <input
                        type="text"
                        placeholder="Nomi"
                        className="w-full rounded-lg border border-black p-2"
                        {...register("name")}
                        defaultValue={editFormData.name}
                      />
                      {errors.name && (
                        <span className="ml-4 text-sm text-red-500">
                          This field is required.
                        </span>
                      )}
                      <input
                        type="number"
                        placeholder="Narxi"
                        className="mt-2 w-full rounded-lg border border-black p-2"
                        {...register("price")}
                        defaultValue={editFormData.price}
                      />
                      {errors.price && (
                        <span className="ml-4 text-sm text-red-500">
                          This field is required.
                        </span>
                      )}
                      <input
                        type="text"
                        placeholder="Tavsifi"
                        className="mt-2 w-full rounded-lg border border-black p-2"
                        {...register("description")}
                        defaultValue={editFormData.description}
                      />
                      {errors.description && (
                        <span className="ml-4 text-sm text-red-500">
                          This field is required.
                        </span>
                      )}
                      <input
                        type="file"
                        placeholder="image_upload"
                        className="mt-2 w-full rounded-lg border border-black p-2"
                        {...register("image")}
                      />
                      {errors.image && (
                        <span className="ml-4 text-sm text-red-500">
                          This field is required.
                        </span>
                      )}
                      <select
                        name="category"
                        id="category"
                        {...register("category")}
                        className="mt-2 w-full rounded-lg border border-black p-2"
                        defaultValue={editFormData.category}
                      >
                        {errors.category && (
                          <span className="ml-4 text-sm text-red-500">
                            This field is required.
                          </span>
                        )}
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
                        className="mt-2 w-full rounded-lg border border-black p-2"
                        {...register("slug")}
                        defaultValue={editFormData.slug}
                      />
                      {errors.slug && (
                        <span className="ml-4 text-sm text-red-500">
                          This field is required.
                        </span>
                      )}
                      <input
                        type="number"
                        placeholder="Yetkazib berish narxi"
                        className="mt-2 w-full rounded-lg border border-black p-2"
                        {...register("shipping_price")}
                        defaultValue={editFormData.shipping_price}
                      />
                      {errors.shipping_price && (
                        <span className="ml-4 text-sm text-red-500">
                          This field is required.
                        </span>
                      )}
                      <button
                        type="submit"
                        className="mt-2 w-full border border-black p-2"
                      >
                        <span className="text-black">
                          Ma'lumotlarni saqlash
                        </span>
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <div
                  key={item.id}
                  className="team-member m-4 w-80 rounded-lg border border-gray-300"
                >
                  <img
                    src={`https://api.abdullajonov.uz/legend-backend-api/public/storage/images/${item.image}`}
                    alt=""
                    className="h-48 w-full rounded-t-lg object-cover"
                  />
                  <div className="flex flex-col p-4">
                    <div className="flex justify-between">
                      <p className="text-xl font-semibold">{item.name}</p>
                      <p className="text-lg">{item.price}</p>
                    </div>
                    <div className="mt-3 flex justify-between">
                      <p className="text-lg">{item.description}</p>
                      <p className="text-lg">{item.slug}</p>
                    </div>
                    <div className="mt-3 flex justify-between">
                      <p className="text-lg">{item.shipping_price}</p>
                      <p className="text-lg">{item.category}</p>
                    </div>
                  </div>
                  <div className="m-4 flex justify-center">
                    <button
                      onClick={() => deleteNews(item.id)}
                      className="mr-2 flex h-10 w-40 items-center justify-center rounded-lg border border-red-500"
                    >
                      <BsFillTrashFill className="text-xl text-red-500" />
                    </button>
                    <button
                      onClick={() => editNews(item)}
                      className="flex h-10 w-40 items-center justify-center rounded-lg border border-blue-500"
                    >
                      <FiEdit2 className="text-xl text-blue-500" />
                    </button>
                  </div>
                </div>
              )
            )
          ) : (
            <p className="text-lg">Ma'lumotlar mavjud emas</p>
          )}
        </div>
        <div>
          <Popup
            trigger={
              <button className="ml-5 mt-10 rounded-lg bg-blue-500 p-2 text-white">
                {" "}
                Mahsulot qo'shish{" "}
              </button>
            }
            modal
            contentStyle={contentStyle}
          >
            {(close) => (
              <form
                className="relative grid h-[500px] w-[700px] grid-rows-3 gap-4 bg-white p-5"
                onSubmit={handleSubmit(onSubmit)}
              >
                <a
                  className="close absolute right-10 top-2 text-4xl"
                  onClick={close}
                >
                  &times;
                </a>
                <input
                  type="text"
                  placeholder="Nomi"
                  className="w-full  rounded-lg border border-black p-2"
                  {...register("name")}
                />
                {errors.name && (
                  <span className="ml-4 text-sm text-red-500">
                    This field is required.
                  </span>
                )}
                <input
                  type="number"
                  placeholder="Narxi"
                  className="w-full  rounded-lg border border-black p-2"
                  {...register("price")}
                />
                {errors.price && (
                  <span className="ml-4 text-sm text-red-500">
                    This field is required.
                  </span>
                )}
                <input
                  type="text"
                  placeholder="Tavsifi"
                  className="w-full  rounded-lg border border-black p-2"
                  {...register("description")}
                />
                {errors.description && (
                  <span className="ml-4 text-sm text-red-500">
                    This field is required.
                  </span>
                )}
                <div className="ml-4 flex gap-6">
                  <input
                    type="file"
                    placeholder="image_upload"
                    className="ml-4 h-10 w-60 rounded-lg border border-black p-2"
                    {...register("image")}
                  />
                  {errors.image && (
                    <span className="ml-4 text-sm text-red-500">
                      This field is required.
                    </span>
                  )}
                  <select
                    name=""
                    id=""
                    {...register("category")}
                    className="w-64 rounded-lg border border-black p-2"
                  >
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
                </div>
                <input
                  type="text"
                  placeholder="Nimadur"
                  className="w-full  rounded-lg border border-black p-2"
                  {...register("slug")}
                />
                {errors.slug && (
                  <span className="ml-4 text-sm text-red-500">
                    This field is required.
                  </span>
                )}
                <input
                  type="number"
                  placeholder="Yetkazib berish narxi"
                  className="w-full  rounded-lg border border-black p-2"
                  {...register("shipping_price")}
                />
                {errors.shipping_price && (
                  <span className="ml-4 text-sm text-red-500">
                    This field is required.
                  </span>
                )}
                <button
                  type="submit"
                  onClick={onSubmit}
                  className="ml-4 mt-4 h-12 w-72 border border-black"
                >
                  <span className="text-black">Ma'lumotlarni yuborish</span>
                </button>
              </form>
            )}
          </Popup>
        </div>

        <div className=" mt-5 flex items-center justify-around gap-5">
          {Array.isArray(datas) ? (
            datas.map((item) =>
              isEditing && editingId === item.id ? (
                // Edit form
                <div
                  key={item.id}
                  className="m-4 w-80 rounded-lg border border-gray-300 p-4"
                >
                  {isEditing && (
                    <form className="edit-form" onSubmit={handleSubmit(onEdit)}>
                      <input
                        type="text"
                        placeholder="Nomi"
                        className="w-full rounded-lg border border-black p-2"
                        {...register("name")}
                        defaultValue={editFormData.name}
                      />
                      {errors.name && (
                        <span className="ml-4 text-sm text-red-500">
                          This field is required.
                        </span>
                      )}
                      <input
                        type="number"
                        placeholder="Narxi"
                        className="mt-2 w-full rounded-lg border border-black p-2"
                        {...register("price")}
                        defaultValue={editFormData.price}
                      />
                      {errors.price && (
                        <span className="ml-4 text-sm text-red-500">
                          This field is required.
                        </span>
                      )}
                      <input
                        type="text"
                        placeholder="Tavsifi"
                        className="mt-2 w-full rounded-lg border border-black p-2"
                        {...register("description")}
                        defaultValue={editFormData.description}
                      />
                      {errors.description && (
                        <span className="ml-4 text-sm text-red-500">
                          This field is required.
                        </span>
                      )}
                      <input
                        type="file"
                        placeholder="image_upload"
                        className="mt-2 w-full rounded-lg border border-black p-2"
                        {...register("image")}
                      />
                      {errors.image && (
                        <span className="ml-4 text-sm text-red-500">
                          This field is required.
                        </span>
                      )}
                      <select
                        name="category"
                        id="category"
                        {...register("category")}
                        className="mt-2 w-full rounded-lg border border-black p-2"
                        defaultValue={editFormData.category}
                      >
                        {errors.category && (
                          <span className="ml-4 text-sm text-red-500">
                            This field is required.
                          </span>
                        )}
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
                        className="mt-2 w-full rounded-lg border border-black p-2"
                        {...register("slug")}
                        defaultValue={editFormData.slug}
                      />
                      {errors.slug && (
                        <span className="ml-4 text-sm text-red-500">
                          This field is required.
                        </span>
                      )}
                      <input
                        type="number"
                        placeholder="Yetkazib berish narxi"
                        className="mt-2 w-full rounded-lg border border-black p-2"
                        {...register("shipping_price")}
                        defaultValue={editFormData.shipping_price}
                      />
                      {errors.shipping_price && (
                        <span className="ml-4 text-sm text-red-500">
                          This field is required.
                        </span>
                      )}
                      <button
                        type="submit"
                        className="mt-2 w-full border border-black p-2"
                      >
                        <span className="text-black">
                          Ma'lumotlarni saqlash
                        </span>
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <div
                  key={item.id}
                  className="team-member m-4 w-80 rounded-lg border border-gray-300"
                >
                  <img
                    src={`https://api.abdullajonov.uz/legend-backend-api/public/storage/images/${item.image}`}
                    alt=""
                    className="h-48 w-full rounded-t-lg object-cover"
                  />
                  <div className="flex flex-col p-4">
                    <div className="flex justify-between">
                      <p className="text-xl font-semibold">{item.name}</p>
                      <p className="text-lg">{item.price}</p>
                    </div>
                    <div className="mt-3 flex justify-between">
                      <p className="text-lg">{item.description}</p>
                      <p className="text-lg">{item.slug}</p>
                    </div>
                    <div className="mt-3 flex justify-between">
                      <p className="text-lg">{item.shipping_price}</p>
                      <p className="text-lg">{item.category}</p>
                    </div>
                  </div>
                  <div className="m-4 flex justify-center">
                    <button
                      onClick={() => deleteNews(item.id)}
                      className="mr-2 flex h-10 w-40 items-center justify-center rounded-lg border border-red-500"
                    >
                      <BsFillTrashFill className="text-xl text-red-500" />
                    </button>
                    <button
                      onClick={() => editNews(item)}
                      className="flex h-10 w-40 items-center justify-center rounded-lg border border-blue-500"
                    >
                      <FiEdit2 className="text-xl text-blue-500" />
                    </button>
                  </div>
                </div>
              )
            )
          ) : (
            <p className="text-lg">Ma'lumotlar mavjud emas</p>
          )}
        </div>
      </Card>
    </div>
  );
}

export default Tables;
