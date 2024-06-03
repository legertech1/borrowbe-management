import React, { useEffect, useRef } from "react";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import apis from "../../services/api";
import Checkbox from "../../components/Shared/Checkbox";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";
import AddIcon from "@mui/icons-material/Add";
import Input from "../../components/Shared/Input";
import Dropdown from "../../components/Shared/Dropdown";
import ImageIcon from "@mui/icons-material/Image";
import parseImage from "../../utils/parseImage";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ArrowDropDown, Height, KeyboardArrowDown } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { fetchCategories } from "../../store/categorySlice";

function CategoryManagement() {
  const user = useSelector((state) => state.auth);
  const data = useSelector((state) => state.categories);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [AllCategoriesSelected, setAllCategoriesSelected] = useState(false);
  const [categoryEdit, setCategoryEdit] = useState(false);
  const [subCategoryEdit, setSubCategoryEdit] = useState(false);
  const [categoryFieldEdit, setCategoryFieldEdit] = useState(false);
  const [subCategoryFieldEdit, setSubCategoryFieldEdit] = useState(false);
  const [AllSubCategoriesSelected, setAllSubCategoriesSelected] =
    useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    icon: "",
    status: "active",
  });
  const [subCategoryForm, setSubCategoryForm] = useState({
    name: "",
    status: "active",
  });
  const [fieldForm, setFieldForm] = useState({
    inputType: "text",
    name: "",
    placeholder: "",
    required: "true",
    info: "",
    options: "",
  });

  const [categoryFields, setCategoryFields] = useState([]);
  const [subCategoryFields, setSubCategoryFields] = useState([]);
  const [selectedCategoryFields, setSelectedCategoryFields] = useState([]);
  const [selectedSubCategoryFields, setSelectedSubCategoryFields] = useState(
    []
  );
  const [draggedCategoryField, setDraggedCategoryField] = useState(null);
  const [draggedSubCategoryField, setDraggedSubCategoryField] = useState(null);
  const [fieldFormOpen, setFieldFormOpen] = useState(false);

  const [viewPackages, setViewPackages] = useState(false);
  const [viewAddOns, setViewAddOns] = useState(false);

  const [viewExtras, setViewExtras] = useState(false);
  const categoryIconRef = useRef();
  const [addOnForm, setAddOnForm] = useState({
    type: null,
    days: "",
    price: "",
  });
  const dispatch = useDispatch();
  const getCatgeories = async () => {
    dispatch(fetchCategories());
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setSelectedCategoryFields([]);
    setSelectedSubCategoryFields([]);
    setSubCategoryEdit(false);
    setCategoryEdit(false);
  };

  useEffect(() => {
    getCatgeories();
  }, []);

  useEffect(() => {
    if (!data.length) return;
    localStorage.setItem(
      "selections",
      JSON.stringify({
        category: selectedCategory?._id,
        subCategory: selectedSubCategory?._id,
      })
    );
  }, [selectedCategory, selectedSubCategory]);

  useEffect(() => {
    if (!localStorage.getItem("selections")) return;
    let noCategory = true;
    let noSubCategory = true;

    data.forEach((item) => {
      if (
        item._id == JSON.parse(localStorage.getItem("selections"))?.category
      ) {
        setSelectedCategory(item);
        noCategory = false;
        item.subCategories.forEach((item) => {
          if (
            item._id ==
            JSON.parse(localStorage.getItem("selections"))?.subCategory
          ) {
            setSelectedSubCategory(item);
            noSubCategory = false;
          }
        });
      }
    });

    noCategory && setSelectedCategory(null);
    noSubCategory && setSelectedSubCategory(null);
  }, [data]);

  function clipboard(data) {
    navigator.clipboard.writeText(JSON.stringify(data));
  }

  function checkAllCategroiesSelected() {
    if (!data?.length || !selectedCategories?.length) return false;
    const ids = selectedCategories.map((item) => item._id);
    return data.reduce(
      (val, item) => (ids.includes(item._id) ? val : false),
      true
    );
  }

  function checkAllSubCategroiesSelected() {
    if (!selectedCategory || !selectedSubCategories?.length) return false;
    const ids = selectedSubCategories.map((item) => item._id);
    return selectedCategory.subCategories.reduce(
      (val, item) => (ids.includes(item._id) ? val : false),
      true
    );
  }

  useEffect(() => {
    if (!data) return setAllCategoriesSelected(false);
    if (!selectedCategory?.subCategories?.length)
      return setAllSubCategoriesSelected(false);
    setAllCategoriesSelected(checkAllCategroiesSelected());
    setAllSubCategoriesSelected(checkAllSubCategroiesSelected());
  }, [data, selectedCategories, selectedSubCategories, selectedCategory]);
  useEffect(() => {
    setSelectedSubCategories([]);
    setSelectedCategoryFields([]);
    !selectedCategory?.subCategories
      .map((item) => item._id)
      .includes(selectedSubCategory?._id) && setSelectedSubCategory(null);
    setCategoryFields(selectedCategory?.fields);
  }, [selectedCategory]);
  useEffect(() => {
    setSelectedSubCategoryFields([]);
    setSubCategoryFields(selectedSubCategory?.fields);
  }, [selectedSubCategory]);

  async function deleteCategories() {
    const conf = window.confirm(
      "Are you sure you want to delete the selected Categories?"
    );
    if (!conf) return setSelectedCategories([]);
    await axios.post(apis.deleteCategories, {
      ids: selectedCategories.map((item) => item._id),
    });
    getCatgeories();
  }

  async function updatePackages(id, packages) {
    await axios.put(apis.updatePackages + id, packages);
    getCatgeories();
  }

  async function updateAddOns(id, addOns) {
    await axios.put(apis.updateAddOns + id, addOns);
    getCatgeories();
  }
  async function updateExtras(id, extras) {
    await axios.put(apis.updateExtras + id, extras);
    getCatgeories();
  }
  async function deleteSubCategories() {
    const conf = window.confirm(
      "Are you sure you want to delete the selected Sub-categories?"
    );
    if (!conf) return setSelectedSubCategories([]);
    await axios.post(apis.deleteSubCategories, {
      ids: selectedSubCategories.map((item) => item._id),
    });
    getCatgeories();
  }
  async function deactivateCategories() {
    await axios.post(apis.deactivateCategories, {
      ids: selectedCategories.map((item) => item._id),
    });
    getCatgeories();
  }
  async function activateCategories() {
    await axios.post(apis.activateCategories, {
      ids: selectedCategories.map((item) => item._id),
    });
    getCatgeories();
  }
  async function deactivateSubCategories() {
    await axios.post(apis.deactivateSubCategories + selectedCategory._id, {
      ids: selectedSubCategories.map((item) => item._id),
    });
    getCatgeories();
  }
  async function activateSubCategories() {
    await axios.post(apis.activateSubCategories + selectedCategory._id, {
      ids: selectedSubCategories.map((item) => item._id),
    });
    getCatgeories();
  }

  async function makeCategory() {
    if (!categoryForm.name || !categoryForm.icon || !categoryForm.status)
      return;
    setCategoryForm({ name: "", icon: "", status: "active" });
    await axios.post(apis.makeCategory, categoryForm);

    getCatgeories();
  }
  async function makeSubCategory() {
    if (!subCategoryForm.name || !subCategoryForm.status) return;
    setSubCategoryForm({ name: "", status: "active" });
    await axios.post(
      apis.makeSubCategory + selectedCategory._id,
      subCategoryForm
    );

    getCatgeories();
  }

  async function deleteCategoryFields() {
    const conf = window.confirm(
      "Are you sure you want to delete the selected fields?"
    );
    if (!conf) return setSelectedCategoryFields([]);
    if (!selectedCategory) return;
    await axios.post(apis.deleteCategoryFields + selectedCategory._id, {
      fields: selectedCategoryFields,
    });
    getCatgeories();
  }
  async function makeCategoryField() {
    if (!selectedCategory) return;
    setFieldForm({
      inputType: "text",
      name: "",
      placeholder: "",
      required: "true",
      info: "",
      options: "",
    });
    await axios.post(apis.makeCategoryField + selectedCategory._id, {
      ...fieldForm,
      options: fieldForm.options.split(",").map((item) => item.trim()),
    });
    getCatgeories();
  }

  async function deleteSubCategoryFields() {
    const conf = window.confirm(
      "Are you sure you want to delete the selected fields?"
    );
    if (!conf) return setSelectedSubCategoryFields([]);
    if (!selectedSubCategory) return;
    await axios.post(apis.deleteSubCategoryFields + selectedSubCategory._id, {
      fields: selectedSubCategoryFields,
    });
    getCatgeories();
  }
  async function makeSubCategoryField() {
    if (!selectedSubCategory) return;
    setFieldForm({
      inputType: "text",
      name: "",
      placeholder: "",
      required: "true",
      info: "",
      options: "",
    });
    await axios.post(apis.makeSubCategoryField + selectedSubCategory._id, {
      ...fieldForm,
      options: fieldForm.options.split(",").map((item) => item.trim()),
    });
    getCatgeories();
  }

  function findInCollection(col, id) {
    for (let i = 0; i < col.length; i++) {
      if (col[i]._id === id) {
        return col[i];
      }
    }
  }

  async function updateCategories() {
    for (let i = 0; i < selectedCategories.length; i++) {
      await axios.post(
        apis.updateCategory + selectedCategories[i]._id,
        selectedCategories[i]
      );
    }

    getCatgeories();
  }
  async function updateSubCategories() {
    for (let i = 0; i < selectedSubCategories.length; i++) {
      await axios.post(
        apis.updateSubCategory + selectedSubCategories[i]._id,
        selectedSubCategories[i]
      );
    }

    getCatgeories();
  }
  async function updateCategoryRules() {
    if (!selectedCategory) return;
    await axios.post(
      apis.updateCategoryRules + selectedCategory._id,
      selectedCategory.rules
    );
    getCatgeories();
  }

  async function updateSubCategoryRules() {
    if (!selectedSubCategory) return;
    await axios.post(
      apis.updateSubCategoryRules + selectedSubCategory._id,
      selectedSubCategory.rules
    );
    getCatgeories();
  }

  async function revertSubCategoryRules() {
    const conf = window.confirm(
      "Are you sure you want this Sub-category to follow parent rules?"
    );
    if (!conf) return;
    if (!selectedSubCategory) return;
    await axios.post(apis.revertSubCategoryRules + selectedSubCategory._id);
    getCatgeories();
  }
  async function enforceSubCategoryRules() {
    if (!selectedSubCategory) return;
    await axios.post(apis.revertSubCategoryRules + selectedSubCategory._id, {
      rules: selectedCategory?.rules,
    });
    getCatgeories();
  }

  function onDropCategory(ind) {
    const changeFrom = categoryFields[ind];
    if (changeFrom._id == draggedCategoryField._id) return;
    const updatedArr = categoryFields.map((item) => {
      if (item._id == changeFrom._id) return draggedCategoryField;
      if (item._id == draggedCategoryField._id) return changeFrom;
      return item;
    });
    setCategoryFields(updatedArr);
    setDraggedCategoryField(null);
    changeCategoryFieldOrder(updatedArr);
  }

  function onDragCategory(e, field) {
    // setCategoryFields()
    setDraggedCategoryField(field);
  }

  function onDropSubCategory(ind) {
    const changeFrom = subCategoryFields[ind];
    if (changeFrom._id == draggedSubCategoryField._id) return;

    const updatedArr = subCategoryFields.map((item) => {
      if (item._id == changeFrom._id) return draggedSubCategoryField;
      if (item._id == draggedSubCategoryField._id) return changeFrom;
      return item;
    });
    setSubCategoryFields(updatedArr);
    setDraggedSubCategoryField(null);
    changeSubCategoryFieldOrder(updatedArr);
  }

  function onDragSubCategory(e, field) {
    // setCategoryFields()
    setDraggedSubCategoryField(field);
  }

  async function changeCategoryFieldOrder(arr) {
    if (!categoryFields.length || !selectedCategory) return;
    await axios.post(apis.changeCategoryFieldOrder + selectedCategory._id, {
      fields: arr,
    });
    getCatgeories();
  }

  async function changeSubCategoryFieldOrder(arr) {
    if (!subCategoryFields.length || !selectedSubCategory) return;
    await axios.post(
      apis.changeSubCategoryFieldOrder + selectedSubCategory._id,
      { fields: arr }
    );
    getCatgeories();
  }

  async function addAddOn() {
    if (!addOnForm.type || !addOnForm.price || !addOnForm.days) return;

    setSelectedCategory({
      ...selectedCategory,
      pricing: {
        ...selectedCategory.pricing,
        AddOns: {
          ...selectedCategory.pricing.AddOns,
          [addOnForm.type.value]: [
            ...selectedCategory.pricing.AddOns[addOnForm.type.value],
            {
              [addOnForm.type.value == "bumpUp" ? "frequency" : "days"]:
                addOnForm.days,
              price: addOnForm.price,
              _id: Math.random() * Math.random() * 10000,
            },
          ],
        },
      },
    });
    setAddOnForm({ type: null, price: "", days: "" });
  }

  return (
    <div className="category_management">
      <div className="main">
        <div className="category_management_nav">
          <div className="info">
            <div>
              {" "}
              <span className="num">{data?.length} </span> Categories <hr />{" "}
              <span className="num">
                {" "}
                {data?.reduce((v, i) => (i.status == "active" ? v + 1 : v), 0)}
              </span>{" "}
              Applied
            </div>
            <div>
              {" "}
              <span className="num">
                {" "}
                {data?.reduce((v, i) => v.concat(i.subCategories), [])?.length}
              </span>{" "}
              Sub-categories <hr />{" "}
              <span className="num">
                {data
                  ?.reduce(
                    (v, i) =>
                      i.status == "active" ? v.concat(i.subCategories) : v,
                    []
                  )
                  ?.reduce((v, i) => (i.status == "active" ? v + 1 : v), 0)}
              </span>{" "}
              Applied
            </div>
          </div>
          <div className="info">
            <p>
              Current Category:{" "}
              <span className="num">{selectedCategory?.name}</span>
            </p>
            <div>
              <div>
                Sub-categories:{" "}
                <span className="num">
                  {selectedCategory?.subCategories?.length}
                </span>
              </div>
              <div>
                Fields:{" "}
                <span className="num">{selectedCategory?.fields?.length}</span>
              </div>
            </div>
          </div>
          <div className="info">
            <p>
              Current Sub-category:{" "}
              <span className="num">{selectedSubCategory?.name}</span>
            </p>
            <div>
              <div>
                Fields:{" "}
                <span className="num">
                  {selectedSubCategory?.fields?.length}
                </span>
              </div>
              <div>
                No of Ads: <span className="num">{100}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="paths">
              <Link to="/">back to home</Link>
            </div>

            <div className="profile">
              <img src={user?.image} alt="" />
              <div>
                <span>Logged in as</span>
                <span>
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* category  category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category */}
        <div className="category">
          <div className="tile">
            <div className="tile_header">
              <div className="info">
                <Checkbox
                  checked={AllCategoriesSelected}
                  setChecked={() =>
                    AllCategoriesSelected
                      ? setSelectedCategories([])
                      : setSelectedCategories(data)
                  }
                ></Checkbox>
                <span className="num">{data?.length}</span> Categories
                <hr />
                <span className="num">{selectedCategories?.length} </span>
                Selected
              </div>
              <div className="actions">
                {categoryEdit ? (
                  <>
                    <button
                      className="primary"
                      onClick={() => setCategoryEdit(false)}
                    >
                      discard
                    </button>
                    <button
                      className="primary"
                      onClick={() => updateCategories()}
                    >
                      save
                    </button>
                  </>
                ) : (
                  <button
                    className="primary"
                    onClick={() => setCategoryEdit(true)}
                  >
                    <EditOutlinedIcon /> Edit
                  </button>
                )}
                <button
                  className="secondary"
                  onClick={() => {
                    activateCategories();
                  }}
                >
                  <CheckIcon /> Activate
                </button>
                <button
                  className="warning"
                  onClick={() => {
                    deactivateCategories();
                  }}
                >
                  <CloseIcon /> Deactivate
                </button>
                <button className="error" onClick={() => deleteCategories()}>
                  <DeleteOutlineIcon />
                  Delete
                </button>
              </div>
            </div>
            <div className="add_category">
              <input
                type="file"
                name=""
                id=""
                onChange={(e) => {
                  parseImage(e.target.files[0], (file) =>
                    setCategoryForm({ ...categoryForm, icon: file })
                  );
                  e.target.value = "";
                }}
                style={{ display: "none" }}
                ref={categoryIconRef}
              />
              <div
                className="icon"
                onClick={() => categoryIconRef.current.click()}
              >
                {categoryForm.icon ? (
                  <img src={categoryForm.icon} />
                ) : (
                  <ImageIcon />
                )}
              </div>
              <input
                type="text"
                value={categoryForm.name}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, name: e.target.value })
                }
                name=""
                id=""
                placeholder="Enter category name*"
              />
              <div className="select">
                <p className="label">Status:</p>
                <div
                  className={
                    "option " +
                    (categoryForm.status == "active" ? "active" : "")
                  }
                  onClick={() =>
                    setCategoryForm({ ...categoryForm, status: "active" })
                  }
                >
                  active
                </div>
                <div
                  className={
                    "option " +
                    (categoryForm.status == "inactive" ? "active" : "")
                  }
                  onClick={() =>
                    setCategoryForm({ ...categoryForm, status: "inactive" })
                  }
                >
                  inactive
                </div>
              </div>
              <button className="primary" onClick={makeCategory}>
                <AddIcon /> Add Category
              </button>
            </div>
            <div className="tile_list">
              {data.map((category) => (
                <>
                  <div
                    className={
                      "tile_item" +
                      (selectedCategory?._id == category._id ? " active" : "")
                    }
                    onClick={() => setSelectedCategory(category)}
                  >
                    {categoryEdit &&
                    selectedCategories.reduce(
                      (val, item) => (item._id == category._id ? true : val),
                      false
                    ) ? (
                      <>
                        {" "}
                        <input
                          type="file"
                          name=""
                          id={category._id}
                          onChange={(e) => {
                            parseImage(e.target.files[0], (file) =>
                              setSelectedCategories((state) =>
                                state.map((i) =>
                                  i._id == category._id
                                    ? { ...i, icon: file }
                                    : i
                                )
                              )
                            );
                            e.target.value = "";
                          }}
                          style={{ display: "none" }}
                          ref={categoryIconRef}
                        />
                        <div
                          className="icon"
                          onClick={() =>
                            document.getElementById(category._id).click()
                          }
                        >
                          {findInCollection(selectedCategories, category._id)
                            .icon ? (
                            <img
                              src={
                                findInCollection(
                                  selectedCategories,
                                  category._id
                                ).icon
                              }
                            />
                          ) : (
                            <ImageIcon />
                          )}
                        </div>
                      </>
                    ) : (
                      <Checkbox
                        checked={selectedCategories.reduce(
                          (val, item) =>
                            item._id == category._id ? true : val,
                          false
                        )}
                        setChecked={() =>
                          selectedCategories.reduce(
                            (val, item) =>
                              item._id == category._id ? true : val,
                            false
                          )
                            ? setSelectedCategories((state) =>
                                state.filter((item) => item._id != category._id)
                              )
                            : setSelectedCategories((state) => [
                                ...state,
                                category,
                              ])
                        }
                      ></Checkbox>
                    )}

                    <div className="name">
                      {!(
                        categoryEdit &&
                        selectedCategories.reduce(
                          (val, item) =>
                            item._id == category._id ? true : val,
                          false
                        )
                      ) && <img src={category.icon} alt="" />}
                      {categoryEdit &&
                      selectedCategories.reduce(
                        (val, item) => (item._id == category._id ? true : val),
                        false
                      ) ? (
                        <input
                          type="text"
                          value={
                            findInCollection(selectedCategories, category._id)
                              .name
                          }
                          onChange={(e) =>
                            setSelectedCategories((state) =>
                              state.map((i) =>
                                i._id == category._id
                                  ? { ...i, name: e.target.value }
                                  : i
                              )
                            )
                          }
                          name=""
                          id=""
                          placeholder="Enter category name*"
                        />
                      ) : (
                        <>{category.name}</>
                      )}
                    </div>

                    <div className="info">
                      {category.subCategories.length} Sub-categories <hr />{" "}
                      {category.fields.length} Fields
                    </div>

                    {/* <div className="updated">
                                    {new Date(category.updatedAt).toLocaleDateString()}
                                </div> */}
                    <div className={"status " + category.status}>
                      {category.status}
                    </div>
                    <button className="history">
                      <HistoryIcon />
                    </button>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
        {/* category  category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category category */}

        {/* subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires  */}
        <div className="sub_category">
          <div className="tile">
            <div className="tile_header">
              <div className="info">
                <Checkbox
                  checked={AllSubCategoriesSelected}
                  setChecked={() =>
                    selectedCategory && AllSubCategoriesSelected
                      ? setSelectedSubCategories([])
                      : setSelectedSubCategories(
                          selectedCategory?.subCategories
                        )
                  }
                />{" "}
                <span className="num">
                  {selectedCategory?.subCategories?.length || 0}
                </span>{" "}
                Sub-categories
                <hr />
                <span className="num">
                  {selectedSubCategories?.length}
                </span>{" "}
                Selected
              </div>
              <div className="actions">
                {subCategoryEdit ? (
                  <>
                    <button
                      className="primary"
                      onClick={() => setSubCategoryEdit(false)}
                    >
                      discard
                    </button>
                    <button
                      className="primary"
                      onClick={() => {
                        updateSubCategories();
                      }}
                    >
                      save
                    </button>
                  </>
                ) : (
                  <button
                    className="primary"
                    onClick={() => setSubCategoryEdit(true)}
                  >
                    <EditOutlinedIcon /> Edit
                  </button>
                )}
                <button
                  className="secondary"
                  onClick={() => {
                    activateSubCategories();
                  }}
                >
                  <CheckIcon /> Activate
                </button>
                <button
                  className="warning"
                  onClick={() => {
                    deactivateSubCategories();
                  }}
                >
                  <CloseIcon /> Deactivate
                </button>
                <button
                  className="error"
                  onClick={() => {
                    deleteSubCategories();
                  }}
                >
                  <DeleteOutlineIcon />
                  Delete
                </button>
              </div>
            </div>
            <div className="add_category">
              <input
                type="text"
                value={subCategoryForm.name}
                onChange={(e) =>
                  setSubCategoryForm({
                    ...subCategoryForm,
                    name: e.target.value,
                  })
                }
                name=""
                id=""
                placeholder="Enter sub-category name*"
              />
              <div className="select">
                <p className="label">Status:</p>
                <div
                  className={
                    "option " +
                    (subCategoryForm.status == "active" ? "active" : "")
                  }
                  onClick={() =>
                    setSubCategoryForm({ ...subCategoryForm, status: "active" })
                  }
                >
                  active
                </div>
                <div
                  className={
                    "option " +
                    (subCategoryForm.status == "inactive" ? "active" : "")
                  }
                  onClick={() =>
                    setSubCategoryForm({
                      ...subCategoryForm,
                      status: "inactive",
                    })
                  }
                >
                  inactive
                </div>
              </div>
              <button
                className="primary"
                onClick={() => {
                  makeSubCategory();
                }}
              >
                <AddIcon /> Add Sub-category
              </button>
            </div>
            <div className="tile_list">
              {selectedCategory?.subCategories?.map((category) => (
                <>
                  <div
                    className={
                      "tile_item" +
                      (selectedSubCategory?._id == category._id
                        ? " active"
                        : "")
                    }
                    onClick={() => setSelectedSubCategory(category)}
                  >
                    {!(
                      subCategoryEdit &&
                      selectedSubCategories.reduce(
                        (val, item) => (item._id == category._id ? true : val),
                        false
                      )
                    ) && (
                      <Checkbox
                        checked={selectedSubCategories?.reduce(
                          (val, item) =>
                            item._id == category._id ? true : val,
                          false
                        )}
                        setChecked={() =>
                          selectedSubCategories?.reduce(
                            (val, item) =>
                              item._id == category._id ? true : val,
                            false
                          )
                            ? setSelectedSubCategories((state) =>
                                state.filter((item) => item._id != category._id)
                              )
                            : setSelectedSubCategories((state) => [
                                ...state,
                                category,
                              ])
                        }
                      ></Checkbox>
                    )}

                    <div className="name">
                      {" "}
                      {subCategoryEdit &&
                      selectedSubCategories.reduce(
                        (val, item) => (item._id == category._id ? true : val),
                        false
                      ) ? (
                        <input
                          type="text"
                          value={
                            findInCollection(
                              selectedSubCategories,
                              category._id
                            ).name
                          }
                          onChange={(e) =>
                            setSelectedSubCategories((state) =>
                              state.map((i) =>
                                i._id == category._id
                                  ? { ...i, name: e.target.value }
                                  : i
                              )
                            )
                          }
                          name=""
                          id=""
                          placeholder="Enter category name*"
                        />
                      ) : (
                        <>{category.name}</>
                      )}
                    </div>

                    <div className="info">
                      {category.fields.length} Fields <hr />
                      {"100 Ads"}
                    </div>

                    <div className="updated">
                      {new Date(category.updatedAt).toLocaleDateString()}
                    </div>
                    <div className={"status " + category.status}>
                      {category.status}
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
        {/* subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires subcategoires  */}

        {/* Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields  */}
        <div className="fields">
          <div className="tile">
            <div className="tile_header">
              <div className="info">
                {" "}
                {selectedSubCategory ? (
                  <>
                    <span className="num">
                      {" "}
                      {categoryFields?.length + subCategoryFields?.length || 0}
                    </span>{" "}
                    Effective fields applied to this Sub-category{" "}
                  </>
                ) : (
                  "Select a Sub Category to see effective applied fields"
                )}
              </div>
              <div className="actions">
                <button
                  className="primary"
                  onClick={(e) => setFieldFormOpen(true)}
                >
                  <AddIcon /> Add Field
                </button>
              </div>
            </div>
            {fieldFormOpen && (
              <>
                <div className="add_field add_category">
                  <input
                    type="text"
                    value={fieldForm.name}
                    onChange={(e) =>
                      setFieldForm({ ...fieldForm, name: e.target.value })
                    }
                    name=""
                    id=""
                    placeholder="name*"
                  />
                  <input
                    type="text"
                    value={fieldForm.placeholder}
                    onChange={(e) =>
                      setFieldForm({
                        ...fieldForm,
                        placeholder: e.target.value,
                      })
                    }
                    placeholder="Placeholder"
                  />
                  <Dropdown
                    array={[
                      "text",
                      "number",
                      "dropdown",
                      "checkbox",
                      "date",
                      "radio",
                    ]}
                    setValue={(v) =>
                      setFieldForm({ ...fieldForm, inputType: v })
                    }
                    value={fieldForm.inputType}
                    placeholder="Input type*"
                  ></Dropdown>
                  <div className="select">
                    <p className="label">required:</p>
                    <div
                      className={
                        "option " +
                        (fieldForm.required == "true" ? "active" : "")
                      }
                      onClick={() =>
                        setFieldForm({
                          ...fieldForm,
                          required: "true",
                        })
                      }
                    >
                      true
                    </div>
                    <div
                      className={
                        "option " +
                        (fieldForm.required == "false" ? "active" : "")
                      }
                      onClick={() =>
                        setFieldForm({
                          ...fieldForm,
                          required: "false",
                        })
                      }
                    >
                      false
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Info"
                    value={fieldForm.info}
                    onChange={(e) =>
                      setFieldForm({ ...fieldForm, info: e.target.value })
                    }
                  />
                  {(fieldForm.inputType == "dropdown" ||
                    fieldForm.inputType == "radio") && (
                    <input
                      className="options"
                      type="text"
                      placeholder="seperate options with a comma"
                      value={fieldForm.options}
                      onChange={(e) =>
                        setFieldForm({
                          ...fieldForm,
                          options: e.target.value,
                        })
                      }
                    />
                  )}

                  <div className="form_btn_container">
                    <button
                      className="primary"
                      onClick={() => {
                        makeCategoryField();
                      }}
                    >
                      <AddIcon />
                      Add category field
                    </button>
                    <button
                      className="primary"
                      onClick={() => {
                        makeSubCategoryField();
                      }}
                    >
                      <AddIcon />
                      Add sub-category field
                    </button>
                    <button
                      className="error"
                      onClick={(e) => setFieldFormOpen(false)}
                    >
                      {" "}
                      <CloseIcon /> Close
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="tile_header">
              <div className="info">
                <Checkbox
                  checked={
                    (selectedCategory?.fields?.length &&
                      selectedCategoryFields?.length ==
                        selectedCategory?.fields?.length) ||
                    false
                  }
                  setChecked={() =>
                    selectedCategory?.fields?.length &&
                    selectedCategoryFields?.length ==
                      selectedCategory?.fields?.length
                      ? setSelectedCategoryFields([])
                      : setSelectedCategoryFields(selectedCategory?.fields)
                  }
                />{" "}
                <span className="num">
                  {selectedCategory?.fields?.length || 0}
                </span>{" "}
                Category fields
                <hr />
                <span className="num">
                  {selectedCategoryFields?.length || 0}{" "}
                </span>
                Selected
              </div>
              <div className="actions">
                <button className="primary">
                  <EditOutlinedIcon /> Edit
                </button>
                <button
                  className="error"
                  onClick={() => {
                    deleteCategoryFields();
                  }}
                >
                  <DeleteOutlineIcon />
                  Delete
                </button>
              </div>
            </div>
            <div className="tile_list" id="categoryFields">
              {categoryFields?.map((field, ind) => (
                <>
                  <div
                    className="tile_item"
                    id={field._id}
                    draggable
                    onDragStart={(e) => onDragCategory(e, field)}
                    onDrop={() => onDropCategory(ind)}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <span>
                      <div className="field_name">
                        <Checkbox
                          checked={selectedCategoryFields?.reduce(
                            (val, item) => (item._id == field._id ? true : val),
                            false
                          )}
                          setChecked={() =>
                            selectedCategoryFields?.reduce(
                              (val, item) =>
                                item._id == field._id ? true : val,
                              false
                            )
                              ? setSelectedCategoryFields((state) =>
                                  state.filter((item) => item._id != field._id)
                                )
                              : setSelectedCategoryFields((state) => [
                                  ...state,
                                  field,
                                ])
                          }
                        ></Checkbox>
                        {field.name}
                      </div>
                      <div className="type">{field.inputType}</div>
                      <div className="placeholder">
                        {field.placeholder || "No placeholder"}
                      </div>
                      <div
                        className={
                          "status " +
                          (field.required ? "required" : "not-required")
                        }
                      >
                        {field.required ? "required" : "not-required"}
                      </div>
                      <div className="show">
                        <button
                          onClick={(e) =>
                            document
                              .getElementById("hidden" + field._id)
                              .classList.toggle("active")
                          }
                        >
                          <KeyboardArrowDown />
                        </button>
                      </div>
                    </span>
                    <div className="hidden" id={"hidden" + field._id}>
                      <div className="field_extra">
                        info: <span className="val">{field.info}</span>
                      </div>
                      <div className="field_extra">
                        {" "}
                        options:{" "}
                        <span className="val">
                          {field.options
                            .reduce((v, i) => v + i + " , ", "")
                            .slice(
                              0,
                              field.options.reduce((v, i) => v + i + " , ", "")
                                .length - 3
                            )}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>
            <div className="tile_header">
              <div className="info">
                <Checkbox
                  checked={
                    (selectedSubCategory?.fields?.length &&
                      selectedSubCategoryFields?.length ==
                        selectedSubCategory?.fields?.length) ||
                    false
                  }
                  setChecked={() =>
                    selectedSubCategory?.fields?.length &&
                    selectedSubCategoryFields?.length ==
                      selectedSubCategory?.fields?.length
                      ? setSelectedSubCategoryFields([])
                      : setSelectedSubCategoryFields(
                          selectedSubCategory?.fields
                        )
                  }
                />{" "}
                <span className="num">
                  {selectedSubCategory?.fields?.length || 0}
                </span>{" "}
                Sub-category fields
                <hr />
                <span className="num">
                  {selectedSubCategoryFields?.length || 0}
                </span>{" "}
                Selected
              </div>
              <div className="actions">
                <button className="primary">
                  <EditOutlinedIcon /> Edit
                </button>
                <button
                  className="error"
                  onClick={() => {
                    deleteSubCategoryFields();
                  }}
                >
                  <DeleteOutlineIcon />
                  Delete
                </button>
              </div>
            </div>
            <div className="tile_list" id="subCategoryFields">
              {subCategoryFields?.map((field, ind) => (
                <>
                  <div
                    className="tile_item"
                    draggable
                    onDragStart={(e) => onDragSubCategory(e, field)}
                    onDrop={() => onDropSubCategory(ind)}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <span>
                      {" "}
                      <div className="field_name">
                        {" "}
                        <Checkbox
                          checked={selectedSubCategoryFields?.reduce(
                            (val, item) => (item._id == field._id ? true : val),
                            false
                          )}
                          setChecked={() =>
                            selectedSubCategoryFields?.reduce(
                              (val, item) =>
                                item._id == field._id ? true : val,
                              false
                            )
                              ? setSelectedSubCategoryFields((state) =>
                                  state.filter((item) => item._id != field._id)
                                )
                              : setSelectedSubCategoryFields((state) => [
                                  ...state,
                                  field,
                                ])
                          }
                        ></Checkbox>
                        {field.name}
                      </div>
                      <div className="type">{field.inputType}</div>
                      <div className="placeholder">
                        {field.placeholder || "No placeholder"}
                      </div>
                      <div
                        className={
                          "status " +
                          (field.required ? "required" : "not-required")
                        }
                      >
                        {field.required ? "required" : "not-required"}
                      </div>
                      <div className="show">
                        <button
                          onClick={(e) =>
                            document
                              .getElementById("hidden" + field._id)
                              .classList.toggle("active")
                          }
                        >
                          <KeyboardArrowDown />
                        </button>
                      </div>
                    </span>
                    <div className="hidden" id={"hidden" + field._id}>
                      <div className="field_extra">
                        info: <span className="val">{field.info}</span>
                      </div>
                      <div className="field_extra">
                        {" "}
                        options:{" "}
                        <span className="val">
                          {field.options
                            .reduce((v, i) => v + i + " , ", "")
                            .slice(
                              0,
                              field.options.reduce((v, i) => v + i + " , ", "")
                                .length - 3
                            )}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>

        {/* Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields   Fields  */}
        <div className="rules">
          <div className="tile">
            <div className="tile_header">
              <div className="info">Default across the category</div>
              <div className="actions">
                <button className="secondary" onClick={updateCategoryRules}>
                  Save Changes
                </button>
                <button
                  className="warning"
                  onClick={(e) =>
                    setSelectedCategory(
                      data.reduce(
                        (v, i) => (i._id == selectedCategory._id ? i : v),
                        null
                      )
                    )
                  }
                >
                  Discard Changes
                </button>
              </div>
            </div>
            <div className="tile_list rules">
              {selectedCategory && (
                <>
                  <div className="rule">
                    <label htmlFor="">Maximum Price</label>
                    <input
                      type="number"
                      name=""
                      id=""
                      value={selectedCategory?.rules?.maxPrice}
                      onChange={(e) =>
                        setSelectedCategory((state) => {
                          return {
                            ...state,
                            rules: { ...state.rules, maxPrice: e.target.value },
                          };
                        })
                      }
                    />
                  </div>
                  <div className="rule">
                    <label htmlFor="">Minimum Price:</label>
                    <input
                      type="number"
                      name=""
                      id=""
                      value={selectedCategory?.rules?.minPrice}
                      onChange={(e) =>
                        setSelectedCategory((state) => {
                          return {
                            ...state,
                            rules: { ...state.rules, minPrice: e.target.value },
                          };
                        })
                      }
                    />
                  </div>
                  <div className="rule">
                    <label htmlFor="">Maximum No. of Ads:</label>
                    <input
                      type="number"
                      name=""
                      id=""
                      value={selectedCategory?.rules?.maxAds}
                      onChange={(e) =>
                        setSelectedCategory((state) => {
                          return {
                            ...state,
                            rules: { ...state.rules, maxAds: e.target.value },
                          };
                        })
                      }
                    />
                  </div>

                  <div className="rule">
                    <label htmlFor="">Minimum Ad Term</label>
                    <Dropdown
                      array={["day", "month", "year"]}
                      value={selectedCategory?.rules?.minAdTerm}
                      setValue={(v) =>
                        setSelectedCategory((state) => {
                          return {
                            ...state,
                            rules: { ...state.rules, minAdTerm: v },
                          };
                        })
                      }
                    />
                  </div>
                  <div className="rule">
                    <label htmlFor="">Ad Duration</label>
                    <input
                      type="number"
                      name=""
                      id=""
                      value={selectedCategory?.rules?.adDuration}
                      onChange={(e) =>
                        setSelectedCategory((state) => {
                          return {
                            ...state,
                            rules: {
                              ...state.rules,
                              adDuration: Number(e.target.value),
                            },
                          };
                        })
                      }
                    />
                  </div>
                </>
              )}
            </div>
            <div className="tile_header">
              <div className="info">Specific changes for this sub-category</div>
              <div className="actions">
                {/* <button className="primary" onClick={revertSubCategoryRules}>
                  Use parent rules
                </button> */}

                <div className="cb">
                  <p className="label">Use parent rules</p>{" "}
                  <Checkbox
                    checked={
                      Object.keys(selectedSubCategory?.rules || {}).length <= 1
                    }
                    setChecked={(v) =>
                      v ? revertSubCategoryRules() : enforceSubCategoryRules()
                    }
                  ></Checkbox>
                </div>

                <button className="secondary" onClick={updateSubCategoryRules}>
                  Save Changes
                </button>
                <button
                  className="warning"
                  onClick={(e) =>
                    selectedCategory &&
                    setSelectedSubCategory(
                      selectedCategory?.subCategories?.reduce(
                        (v, i) => (i._id == selectedSubCategory._id ? i : v),
                        null
                      )
                    )
                  }
                >
                  Discard Changes
                </button>
              </div>
            </div>
            <div className="tile_list rules">
              {selectedSubCategory && (
                <>
                  <div className="rule">
                    <label htmlFor="">Maximum Price</label>
                    <input
                      type="number"
                      name=""
                      id=""
                      value={
                        selectedSubCategory?.rules?.maxPrice ||
                        selectedCategory?.rules?.maxPrice
                      }
                      onChange={(e) =>
                        setSelectedSubCategory((state) => {
                          return {
                            ...state,
                            rules: { ...state.rules, maxPrice: e.target.value },
                          };
                        })
                      }
                    />
                  </div>
                  <div className="rule">
                    <label htmlFor="">Minimum Price:</label>
                    <input
                      type="number"
                      name=""
                      id=""
                      value={
                        selectedSubCategory?.rules?.minPrice ||
                        selectedCategory?.rules?.minPrice
                      }
                      onChange={(e) =>
                        setSelectedSubCategory((state) => {
                          return {
                            ...state,
                            rules: { ...state.rules, minPrice: e.target.value },
                          };
                        })
                      }
                    />
                  </div>
                  <div className="rule">
                    <label htmlFor="">Maximum No. of Ads:</label>
                    <input
                      type="number"
                      name=""
                      id=""
                      value={
                        selectedSubCategory?.rules?.maxAds ||
                        selectedCategory?.rules?.maxAds
                      }
                      onChange={(e) =>
                        setSelectedSubCategory((state) => {
                          return {
                            ...state,
                            rules: { ...state.rules, maxAds: e.target.value },
                          };
                        })
                      }
                    />
                  </div>

                  <div className="rule">
                    <label htmlFor="">Minimum Ad Term</label>
                    <Dropdown
                      array={["day", "month", "year"]}
                      value={
                        selectedSubCategory?.rules?.minAdTerm ||
                        selectedCategory?.rules?.minAdTerm
                      }
                      setValue={(v) =>
                        setSelectedSubCategory((state) => {
                          return {
                            ...state,
                            rules: { ...state.rules, minAdTerm: v },
                          };
                        })
                      }
                    />
                  </div>
                  <div className="rule">
                    <label htmlFor="">Ad Duration</label>
                    <input
                      type="number"
                      name=""
                      id=""
                      value={selectedSubCategory?.rules?.adDuration}
                      onChange={(e) =>
                        setSelectedSubCategory((state) => {
                          return {
                            ...state,
                            rules: {
                              ...state.rules,
                              adDuration: Number(e.target.value),
                            },
                          };
                        })
                      }
                    />
                  </div>
                </>
              )}{" "}
            </div>
          </div>
        </div>
      </div>
      <div className="pricing_container">
        {" "}
        <div className="pricing">
          <div>
            <div className="pricing_heading">
              <button
                className={"open" + (viewPackages ? " active" : "")}
                onClick={(e) => setViewPackages(!viewPackages)}
              >
                <KeyboardArrowDownIcon />
              </button>
              <h1>Packages</h1>
              <div className="details">
                <div className="package_overview">
                  <p className="name">Basic</p>
                  <p className="price">
                    ${selectedCategory?.pricing?.Basic?.price}
                  </p>
                </div>
                <hr />
                <div className="package_overview">
                  <p className="name">Standard</p>
                  <p className="price">
                    ${selectedCategory?.pricing?.Standard?.price}
                  </p>
                </div>
                <hr />
                <div className="package_overview">
                  <p className="name">Premium</p>
                  <p className="price">
                    ${selectedCategory?.pricing?.Premium?.price}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={
                "packages_controller_cont" + (viewPackages ? " active" : "")
              }
            >
              <div className="packages_controller">
                <div className="package_control">
                  <div className="package_price">
                    <h2>Basic</h2>
                    <div>
                      $
                      <input
                        type="number"
                        value={selectedCategory?.pricing?.Basic?.price}
                        onChange={(e) =>
                          setSelectedCategory({
                            ...selectedCategory,
                            pricing: {
                              ...selectedCategory.pricing,
                              Basic: {
                                ...selectedCategory.pricing.Basic,
                                price:
                                  e.target.value ||
                                  selectedCategory.pricing.Basic.price,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <Package
                    plan={selectedCategory?.pricing?.Basic}
                    setPlan={(plan) =>
                      setSelectedCategory({
                        ...selectedCategory,
                        pricing: {
                          ...selectedCategory.pricing,
                          Basic: plan,
                        },
                      })
                    }
                  />
                </div>
                <div className="divider" />
                <div className="package_control">
                  <div className="package_price">
                    <h2>Standard</h2>
                    <div>
                      $
                      <input
                        type="number"
                        onChange={(e) =>
                          setSelectedCategory({
                            ...selectedCategory,
                            pricing: {
                              ...selectedCategory.pricing,
                              Standard: {
                                ...selectedCategory.pricing.Standard,
                                price: e.target.value,
                              },
                            },
                          })
                        }
                        value={selectedCategory?.pricing?.Standard?.price}
                      />
                    </div>
                  </div>
                  <Package
                    plan={selectedCategory?.pricing?.Standard}
                    setPlan={(plan) =>
                      setSelectedCategory({
                        ...selectedCategory,
                        pricing: {
                          ...selectedCategory.pricing,
                          Standard: plan,
                        },
                      })
                    }
                  />
                </div>
                <div className="divider" />
                <div className="package_control">
                  <div className="package_price">
                    <h2>Premium</h2>
                    <div>
                      $
                      <input
                        type="number"
                        onChange={(e) =>
                          setSelectedCategory({
                            ...selectedCategory,
                            pricing: {
                              ...selectedCategory.pricing,
                              Premium: {
                                ...selectedCategory.pricing.Premium,
                                price: e.target.value,
                              },
                            },
                          })
                        }
                        value={selectedCategory?.pricing?.Premium?.price}
                      />
                    </div>
                  </div>
                  <Package
                    plan={selectedCategory?.pricing?.Premium}
                    setPlan={(plan) =>
                      setSelectedCategory({
                        ...selectedCategory,
                        pricing: {
                          ...selectedCategory.pricing,
                          Premium: plan,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="actions">
                <button
                  className="revert"
                  onClick={(e) => {
                    const target = data.filter(
                      (c) => c._id == selectedCategory._id
                    )[0];
                    setSelectedCategory({
                      ...selectedCategory,
                      pricing: {
                        ...selectedCategory.pricing,
                        Basic: target.pricing.Basic,
                        Standard: target.pricing.Standard,
                        Premium: target.pricing.Premium,
                      },
                    });
                  }}
                >
                  Revert / Discard
                </button>
                <button
                  className="apply"
                  onClick={(e) =>
                    updatePackages(selectedCategory?._id, {
                      Basic: selectedCategory?.pricing?.Basic,
                      Standard: selectedCategory?.pricing?.Standard,
                      Premium: selectedCategory?.pricing?.Premium,
                    })
                  }
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
          <div>
            <div className="pricing_heading">
              <button
                className={"open" + (viewAddOns ? " active" : "")}
                onClick={(e) => setViewAddOns(!viewAddOns)}
              >
                <KeyboardArrowDownIcon />
              </button>
              <h1>Add Ons</h1>
              <div className="details">
                <div className="package_overview">
                  <p className="name">Bump Up</p>
                  <p className="options">
                    {selectedCategory?.pricing?.AddOns?.bumpUp?.length}{" "}
                  </p>
                </div>
                <hr />
                <div className="package_overview">
                  <p className="name">Featured</p>
                  <p className="options">
                    {selectedCategory?.pricing?.AddOns?.featured?.length}
                  </p>
                </div>
                <hr />
                <div className="package_overview">
                  <p className="name">Highlighted</p>
                  <p className="options">
                    {selectedCategory?.pricing?.AddOns?.highlighted?.length}
                  </p>
                </div>
                <hr />
                <div className="package_overview">
                  <p className="name">HomePage Gallery</p>
                  <p className="options">
                    {selectedCategory?.pricing?.AddOns?.homepageGallery?.length}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={
                "packages_controller_cont" + (viewAddOns ? " active" : "")
              }
            >
              <div className="add_row">
                <h4> Add new Addon:</h4>
                <Dropdown
                  array={[
                    { text: "Bump Up", value: "bumpUp" },
                    { text: "Highlighted", value: "highlighted" },
                    { text: "Featured", value: "featured" },
                    { text: "Homepage Gallery", value: "homepageGallery" },
                  ]}
                  setValue={(v) => setAddOnForm({ ...addOnForm, type: v })}
                  placeholder="Type"
                  value={addOnForm.type}
                />
                <Input
                  placeholder={"Number of days"}
                  value={addOnForm.days}
                  onChange={(e) =>
                    setAddOnForm({ ...addOnForm, days: e.target.value })
                  }
                  type="number"
                />
                <Input
                  placeholder={"Price"}
                  type="number"
                  value={addOnForm.price}
                  onChange={(e) =>
                    setAddOnForm({ ...addOnForm, price: e.target.value })
                  }
                />
                <button className="add primary" onClick={() => addAddOn()}>
                  {" "}
                  <AddIcon /> Add Option
                </button>
              </div>
              <div className="packages_controller">
                <div className="package_control">
                  <div className="package_price">
                    <h2>
                      Bump up {/* <button> */}
                      {/* <AddIcon />
                      </button> */}
                    </h2>
                    <span>
                      {selectedCategory?.pricing?.AddOns?.bumpUp?.length}
                    </span>
                  </div>
                  <AddOns
                    setAddOn={(v) => {
                      setSelectedCategory({
                        ...selectedCategory,
                        pricing: {
                          ...selectedCategory.pricing,
                          AddOns: {
                            ...selectedCategory.pricing.AddOns,
                            bumpUp: selectedCategory.pricing.AddOns.bumpUp.map(
                              (item) => (item._id == v._id ? v : item)
                            ),
                          },
                        },
                      });
                    }}
                    addOn={selectedCategory?.pricing?.AddOns?.bumpUp}
                    remove={(id) =>
                      setSelectedCategory({
                        ...selectedCategory,
                        pricing: {
                          ...selectedCategory.pricing,
                          AddOns: {
                            ...selectedCategory.pricing.AddOns,
                            bumpUp:
                              selectedCategory.pricing.AddOns.bumpUp.filter(
                                (el) => el._id != id
                              ),
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="divider" />
                <div className="package_control">
                  <div className="package_price">
                    <h2>
                      Featured{" "}
                      {/* <button>
                        <AddIcon />
                      </button> */}
                    </h2>
                    <span>
                      {selectedCategory?.pricing?.AddOns?.featured?.length}
                    </span>
                  </div>
                  <AddOns
                    setAddOn={(v) => {
                      setSelectedCategory({
                        ...selectedCategory,
                        pricing: {
                          ...selectedCategory.pricing,
                          AddOns: {
                            ...selectedCategory.pricing.AddOns,
                            featured:
                              selectedCategory.pricing.AddOns.featured.map(
                                (item) => (item._id == v._id ? v : item)
                              ),
                          },
                        },
                      });
                    }}
                    remove={(id) =>
                      setSelectedCategory({
                        ...selectedCategory,
                        pricing: {
                          ...selectedCategory.pricing,
                          AddOns: {
                            ...selectedCategory.pricing.AddOns,
                            featured:
                              selectedCategory.pricing.AddOns.featured.filter(
                                (el) => el._id != id
                              ),
                          },
                        },
                      })
                    }
                    addOn={selectedCategory?.pricing?.AddOns?.featured}
                  />
                </div>
                <div className="divider" />
                <div className="package_control">
                  <div className="package_price">
                    <h2>
                      Highlighted{" "}
                      {/* <button>
                        <AddIcon />
                      </button> */}
                    </h2>
                    <span>
                      {selectedCategory?.pricing?.AddOns?.highlighted?.length}
                    </span>
                  </div>
                  <AddOns
                    setAddOn={(v) => {
                      setSelectedCategory({
                        ...selectedCategory,
                        pricing: {
                          ...selectedCategory.pricing,
                          AddOns: {
                            ...selectedCategory.pricing.AddOns,
                            highlighted:
                              selectedCategory.pricing.AddOns.highlighted.map(
                                (item) => (item._id == v._id ? v : item)
                              ),
                          },
                        },
                      });
                    }}
                    remove={(id) =>
                      setSelectedCategory({
                        ...selectedCategory,
                        pricing: {
                          ...selectedCategory.pricing,
                          AddOns: {
                            ...selectedCategory.pricing.AddOns,
                            highlighted:
                              selectedCategory.pricing.AddOns.highlighted.filter(
                                (el) => el._id != id
                              ),
                          },
                        },
                      })
                    }
                    addOn={selectedCategory?.pricing?.AddOns?.highlighted}
                  />
                </div>
                <div className="divider"></div>
                <div className="package_control">
                  <div className="package_price">
                    <h2>
                      Homepage Gallery{" "}
                      {/* <button>
                        <AddIcon />
                      </button> */}
                    </h2>
                    <span>
                      {
                        selectedCategory?.pricing?.AddOns?.homepageGallery
                          ?.length
                      }
                    </span>
                  </div>
                  <AddOns
                    setAddOn={(v) => {
                      setSelectedCategory({
                        ...selectedCategory,
                        pricing: {
                          ...selectedCategory.pricing,
                          AddOns: {
                            ...selectedCategory.pricing.AddOns,
                            homepageGallery:
                              selectedCategory.pricing.AddOns.homepageGallery.map(
                                (item) => (item._id == v._id ? v : item)
                              ),
                          },
                        },
                      });
                    }}
                    remove={(id) =>
                      setSelectedCategory({
                        ...selectedCategory,
                        pricing: {
                          ...selectedCategory.pricing,
                          AddOns: {
                            ...selectedCategory.pricing.AddOns,
                            homepageGallery:
                              selectedCategory.pricing.AddOns.homepageGallery.filter(
                                (el) => el._id != id
                              ),
                          },
                        },
                      })
                    }
                    addOn={selectedCategory?.pricing?.AddOns?.homepageGallery}
                  />
                </div>
              </div>
              <div className="actions">
                <button
                  className="revert"
                  onClick={(e) => {
                    const target = data.filter(
                      (c) => c._id == selectedCategory._id
                    )[0];
                    setSelectedCategory({
                      ...selectedCategory,
                      pricing: {
                        ...selectedCategory.pricing,
                        AddOns: target.pricing.AddOns,
                      },
                    });
                  }}
                >
                  Revert / Discard
                </button>
                <button
                  className="apply"
                  onClick={(e) =>
                    updateAddOns(selectedCategory?._id, {
                      ...selectedCategory?.pricing?.AddOns,
                    })
                  }
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
          <div>
            <div className="pricing_heading">
              <button
                className={"open" + (viewExtras ? " active" : "")}
                onClick={(e) => setViewExtras(!viewExtras)}
              >
                <KeyboardArrowDownIcon />
              </button>
              <h1>Extras</h1>
              <div className="details">
                <div className="package_overview">
                  <p className="name">Youtube</p>
                  <p className="price">
                    ${selectedCategory?.pricing?.Extras?.youtube?.price}
                  </p>
                </div>
                <hr />
                <div className="package_overview">
                  <p className="name">Website</p>
                  <p className="price">
                    ${selectedCategory?.pricing?.Extras?.website?.price}
                  </p>
                </div>
                <hr />
                <div className="package_overview">
                  <p className="name">Business</p>
                  <p className="price">
                    ${selectedCategory?.pricing?.Extras?.business?.price}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={
                "packages_controller_cont" + (viewExtras ? " active" : "")
              }
            >
              <div className="Extras_content">
                <div className="extra">
                  Youtube:{" "}
                  <span>
                    $
                    <input
                      type="number"
                      value={selectedCategory?.pricing?.Extras?.youtube?.price}
                      onChange={(e) =>
                        setSelectedCategory({
                          ...selectedCategory,
                          pricing: {
                            ...selectedCategory.pricing,
                            Extras: {
                              ...selectedCategory.pricing.Extras,
                              youtube: { price: e.target.value },
                            },
                          },
                        })
                      }
                    ></input>
                  </span>
                </div>
                <hr />
                <div className="extra">
                  Website:
                  <span>
                    $
                    <input
                      type="number"
                      value={selectedCategory?.pricing?.Extras?.website?.price}
                      onChange={(e) =>
                        setSelectedCategory({
                          ...selectedCategory,
                          pricing: {
                            ...selectedCategory.pricing,
                            Extras: {
                              ...selectedCategory.pricing.Extras,
                              website: { price: e.target.value },
                            },
                          },
                        })
                      }
                    ></input>
                  </span>
                </div>
                <hr />
                <div className="extra">
                  Business:
                  <span>
                    $
                    <input
                      type="number"
                      value={selectedCategory?.pricing?.Extras?.business?.price}
                      onChange={(e) =>
                        setSelectedCategory({
                          ...selectedCategory,
                          pricing: {
                            ...selectedCategory.pricing,
                            Extras: {
                              ...selectedCategory.pricing.Extras,
                              business: { price: e.target.value },
                            },
                          },
                        })
                      }
                    ></input>
                  </span>
                </div>
              </div>
              <div className="actions">
                <button
                  className="revert"
                  onClick={(e) => {
                    const target = data.filter(
                      (c) => c._id == selectedCategory._id
                    )[0];
                    setSelectedCategory({
                      ...selectedCategory,
                      pricing: {
                        ...selectedCategory.pricing,
                        Extras: target.pricing.Extras,
                      },
                    });
                  }}
                >
                  Revert / Discard
                </button>
                <button
                  className="apply"
                  onClick={(e) =>
                    updateExtras(selectedCategory?._id, {
                      ...selectedCategory?.pricing?.Extras,
                    })
                  }
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Package({ plan, setPlan }) {
  if (!plan) return <></>;
  return (
    <div className="package_options">
      <div className="package_option">
        Number of Images:{" "}
        <div>
          (up to 30)
          <input
            value={plan.images}
            type="number"
            onChange={(e) => setPlan({ ...plan, images: e.target.value })}
          />
        </div>
      </div>
      <div className="package_option">
        Free Ads:{" "}
        <div>
          {" "}
          <input
            value={plan.freeAds}
            type="number"
            onChange={(e) => setPlan({ ...plan, freeAds: e.target.value })}
          />
        </div>
      </div>

      <div className="package_option">
        Featured:{" "}
        <div>
          (for){" "}
          <input
            value={plan.featured}
            type="number"
            onChange={(e) => setPlan({ ...plan, featured: e.target.value })}
          />
          <span>days</span>
        </div>
      </div>
      <div className="package_option">
        Highlighted:{" "}
        <div>
          (for){" "}
          <input
            value={plan.highlighted}
            type="number"
            onChange={(e) => setPlan({ ...plan, highlighted: e.target.value })}
          />
          <span>days</span>
        </div>
      </div>
      <div className="package_option">
        Show in Homepage Gallery:{" "}
        <div>
          (for){" "}
          <input
            value={plan.homepageGallery}
            type="number"
            onChange={(e) =>
              setPlan({ ...plan, homepageGallery: e.target.value })
            }
          />
          <span>days</span>
        </div>
      </div>
    </div>
  );
}

function AddOns({ addOn, remove, setAddOn }) {
  if (!addOn) return <> </>;
  return (
    <div className="package_options">
      {addOn?.map((el) => (
        <div className="package_option">
          <p>
            {" "}
            {el.frequency && "Every "}
            {el.days || el.frequency} Days for{" "}
            <button className="remove" onClick={() => remove(el._id)}>
              <CloseIcon />
            </button>
          </p>
          <div>
            $
            <input
              value={el.price}
              onChange={(e) => setAddOn({ ...el, price: e.target.value })}
              type="Number"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
export default CategoryManagement;
