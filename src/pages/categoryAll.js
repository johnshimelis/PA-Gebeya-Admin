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
import categoriesData from "../utils/demo/categoriesData";

const CategoriesAll = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [allCategories, setAllCategories] = useState(categoriesData);
  const totalResults = allCategories.length;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Load paginated data
  useEffect(() => {
    setData(allCategories.slice((page - 1) * resultsPerPage, page * resultsPerPage));
  }, [page, resultsPerPage, allCategories]);

  function onPageChange(p) {
    setPage(p);
  }

  // Open Delete Modal
  function openDeleteModal(categoryId) {
    let category = allCategories.find((cat) => cat.id === categoryId);
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  }

  // Close Delete Modal
  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
  }

  // Handle Category Deletion
  const handleDelete = () => {
    if (selectedCategory) {
      const updatedCategories = allCategories.filter(
        (cat) => cat.id !== selectedCategory.id
      );
      setAllCategories(updatedCategories);
      setIsDeleteModalOpen(false);

      // Adjust pagination if necessary
      const lastPage = Math.ceil(updatedCategories.length / resultsPerPage);
      if (page > lastPage) {
        setPage(lastPage);
      }
    }
  };

  // Open Edit Modal
  const openEditModal = (categoryId) => {
    let category = allCategories.find((cat) => cat.id === categoryId);
    setSelectedCategory(category);
    setUpdatedName(category.name);
    setSelectedImage(null);
    setImagePreview(category.image || "");
    setIsEditModalOpen(true);
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

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
    } else {
      setImagePreview("");
    }
  };

  // Handle Update Category
  const handleUpdate = () => {
    if (selectedCategory) {
      const updatedCategories = allCategories.map((cat) => {
        if (cat.id === selectedCategory.id) {
          return {
            ...cat,
            name: updatedName,
            image: imagePreview,
          };
        }
        return cat;
      });
      setAllCategories(updatedCategories);
      setIsEditModalOpen(false);
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
              <TableCell>Description</TableCell>
              <TableCell>Action</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <p className="font-semibold">{category.name}</p>
                </TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <div className="flex">
                    <Button
                      icon={EditIcon}
                      className="mr-3"
                      layout="outline"
                      aria-label="Edit"
                      onClick={() => openEditModal(category.id)}
                    />
                    <Button
                      icon={TrashIcon}
                      layout="outline"
                      onClick={() => openDeleteModal(category.id)}
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
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-4 w-full h-auto rounded-lg"
            />
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
