import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Card, CardBody, Button, Label } from "@windmill/react-ui";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const Ads = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [ads, setAds] = useState([]);
  const [banners, setBanners] = useState([]);
  const [banner1, setBanner1] = useState([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("ads");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const fetchAds = async (type, setter) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/ads/${type}`);
        setter(response.data);
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
      }
    };
    fetchAds("ads", setAds);
    fetchAds("banner", setBanners);
    fetchAds("banner1", setBanner1);
  };

  const handleImageChange = (e) => {
    setSelectedImages(Array.from(e.target.files));
    if (editId) {
      handleUpload();
    }
  };

  const handleUpload = async () => {
    if (!selectedImages.length) return alert("Please select an image.");

    const formData = new FormData();
    selectedImages.forEach((image) => formData.append("images", image));

    try {
      setLoading(true);
      if (editId) {
        await axios.put(`http://localhost:5000/api/ads/${editId}`, formData);
      } else {
        await axios.post(`http://localhost:5000/api/ads/${type}`, formData);
      }
      alert(editId ? "Update successful!" : "Upload successful!");
      fetchData();
      setSelectedImages([]);
      setEditId(null);
    } catch (error) {
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this ad?")) return;
    await axios.delete(`http://localhost:5000/api/ads/${id}`);
    fetchData();
  };

  const handleEditAd = (id) => {
    setEditId(id);
    document.getElementById("editFileInput").click();
  };

  return (
    <div>
      <PageTitle>Manage Ads</PageTitle>
      <Card className="shadow-md">
        <CardBody>
          <Label className="block text-sm">
            <span className="text-gray-700">Upload Image</span>
            <select className="mt-2 p-2 border" onChange={(e) => setType(e.target.value)}>
              <option value="ads">Ads</option>
              <option value="banner">Banner</option>
              <option value="banner1">Banner 1</option>
            </select>
            <input id="adFileInput" type="file" multiple onChange={handleImageChange} className="hidden" />
            <Button className="mt-2" onClick={() => document.getElementById("adFileInput").click()}>
              Choose File
            </Button>
          </Label>

          <Button className="mt-4" onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : editId ? "Update" : "Upload"}
          </Button>
        </CardBody>
      </Card>

      {/* Hidden File Input for Editing */}
      <input id="editFileInput" type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />

      {[["Ads", ads], ["Banner", banners], ["Banner 1", banner1]].map(([title, data]) => (
        <div key={title} className="mt-6">
          <h3 className="text-xl font-semibold mb-4">{title}</h3>
          <div className="grid grid-cols-3 gap-4">
            {data.map((item) => (
              <div key={item._id} className="border p-2">
                <img src={`http://localhost:5000/${item.images[0]}`} alt="Ad" className="w-full h-40 object-cover" />
                <div className="mt-2 flex justify-center gap-4">
                  <FaEdit className="text-blue-500 cursor-pointer" onClick={() => handleEditAd(item._id)} />
                  <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDelete(item._id)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Ads;
