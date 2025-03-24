import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Link, NavLink } from "react-router-dom";
import { HomeIcon, EditIcon, TrashIcon } from "../icons";
import {
  Card,
  CardBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableBody,
  TableFooter,
  Button,
  Pagination,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
} from "@windmill/react-ui";
import Icon from "../components/Icon";
import axios from "axios"; // Import Axios

const API_BASE_URL = "https://pa-gebeya-backend.onrender.com/api/categories"; // Update API URL

const CategoriesAll = () => {
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [resultsPerPage] = useState(10);
  const totalResults = categories.length;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Fetch Categories
  useEffect(() => {
    axios.get(API_BASE_URL)
      .then((response) => {
        setCategories(response.data);
        console.log("Fetched Categories:", response.data); // Debugging
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  function onPageChange(p) {
    setPage(p);
  }

  // Open Delete Modal
  function openDeleteModal(category) {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
  }

  // Handle Delete
  const handleDelete = async () => {
    if (selectedCategory) {
      try {
        await axios.delete(`${API_BASE_URL}/${selectedCategory._id}`);
        setCategories(categories.filter(cat => cat._id !== selectedCategory._id));
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  // Open Edit Modal
  const openEditModal = (category) => {
    setSelectedCategory(category);
    setUpdatedName(category.name);
    setSelectedImage(null);
    setImagePreview(category.image || "");
    setIsEditModalOpen(true);
  };

  function closeEditModal() {
    setIsEditModalOpen(false);
  }

  // Handle Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Update Category
  const handleUpdate = async () => {
    if (selectedCategory) {
      try {
        const formData = new FormData();
        formData.append("name", updatedName);
        if (selectedImage) formData.append("image", selectedImage);

        await axios.put(`${API_BASE_URL}/${selectedCategory._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === selectedCategory._id
              ? { ...cat, name: updatedName, image: imagePreview }
              : cat
          )
        );
        setIsEditModalOpen(false);
      } catch (error) {
        console.error("Error updating category:", error);
      }
    }
  };

  return (
    <div>
      <PageTitle>All Categories</PageTitle>
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">All Categories</p>
      </div>
      <Card className="mt-5 mb-5 shadow-md">
        <CardBody>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            All Categories
          </p>
        </CardBody>
      </Card>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Name</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Action</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {categories.slice((page - 1) * resultsPerPage, page * resultsPerPage).map((category) => (
              <TableRow key={category._id}>
                <TableCell>
                  <p className="font-semibold">{category.name}</p>
                </TableCell>
                <TableCell>
                  {/* Ensure the image path is a full URL */}
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                    />
                  ) : (
                    <p>No Image</p>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex">
                    <Button
                      icon={EditIcon}
                      className="mr-3"
                      layout="outline"
                      aria-label="Edit"
                      onClick={() => openEditModal(category)}
                    />
                    <Button
                      icon={TrashIcon}
                      layout="outline"
                      onClick={() => openDeleteModal(category)}
                      aria-label="Delete"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onPageChange}
          />
        </TableFooter>
      </TableContainer>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <ModalHeader>
          <Icon icon={TrashIcon} className="w-6 h-6 mr-3" /> Delete Category
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete{" "}
          {selectedCategory && `"${selectedCategory.name}"`}?
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button onClick={handleDelete}>Delete</Button>
        </ModalFooter>
      </Modal>

      {/* Update Category Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalHeader>Update Category</ModalHeader>
        <ModalBody>
          <Label>
            <span>Category Name</span>
            <Input
              className="mt-1"
              placeholder="Category Name"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
            />
          </Label>
          <Label className="mt-4">
            <span>Category Image</span>
            <Input type="file" onChange={handleImageChange} />
          </Label>
          {imagePreview && (
            <div className="mt-4 flex justify-center">
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '5px' }}
              />
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={closeEditModal}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>Update</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CategoriesAll;