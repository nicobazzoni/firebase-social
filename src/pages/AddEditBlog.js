import React, { useState, useEffect } from "react";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { db } from "../firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";
import { addDoc, collection, getDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import zIndex from "@mui/material/styles/zIndex";

const initialState = {
  title: "",
  tags: [],
  trending: "no",
  category: "",
};

const categoryOption = [
  "Studio",
  "Technology",
  "Projects",
  "LookSee",
  "Show",
  "Lights",
  "Chair",
  "Rug",
  "Curtain",
  "Desk",
  "Stretch Shapes"

];

const AddEditBlog = ({ user, setActive }) => {
  const [form, setForm] = useState(initialState);
  const [description, setDescription] = useState('');
  const [imgUrl, setImageUrl] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  const { title, tags, category, trending } = form;

  useEffect(() => {
    if (id) {
      getBlogDetail();
    }
  }, [id]);

  const getBlogDetail = async () => {
    const docRef = doc(db, "blogs", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      setForm({ ...snapshot.data() });
      setDescription(snapshot.data().description);
      setImageUrl(snapshot.data().imgUrl || '');
    }
    setActive(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTags = (tags) => {
    setForm({ ...form, tags });
  };

  const handleTrending = (e) => {
    setForm({ ...form, trending: e.target.value });
  };

  const onCategoryChange = (e) => {
    setForm({ ...form, category: e.target.value });
  };

  const handleImageUpload = (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, `blogImages/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      null,
      (error) => {
        console.error("Image upload error:", error);
        toast.error("Image upload failed");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          toast.success("Image uploaded successfully!");
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (category && tags.length > 0 && title && description && trending && imgUrl) {
      const blogData = {
        ...form,
        description,
        imgUrl,
        timestamp: serverTimestamp(),
        author: user.displayName,
        userId: user.uid,
      };

      try {
        if (!id) {
          await addDoc(collection(db, "blogs"), blogData);
          toast.success("Blog created successfully");
        } else {
          await updateDoc(doc(db, "blogs", id), blogData);
          toast.success("Blog updated successfully");
        }
        navigate("/");
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong!");
      }
    } else {
      toast.error("All fields including image are mandatory");
    }
  };

  return (
    <div className="container-fluid mb-4">
      <div className="container">
        <div className="col-12 text-center heading py-2">
          {id ? "Update Blog" : "Create Blog"}
        </div>
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-10 col-md-8 col-lg-6">
            <form className="row blog-form" onSubmit={handleSubmit}>
              <div className="col-12 py-3">
                <input
                  type="text"
                  className="form-control input-text-box"
                  placeholder="Title"
                  name="title"
                  value={title}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 py-3">
                <ReactTagInput
                  tags={tags}
                  placeholder="Tags"
                  onChange={handleTags}
                />
              </div>
              <div className="col-12 py-3">
                <p className="trending">Is it trending?</p>
                <div className="form-check-inline mx-2">
                  <input
                    type="radio"
                    className="form-check-input"
                    value="yes"
                    name="radioOption"
                    checked={trending === "yes"}
                    onChange={handleTrending}
                  />
                  <label className="form-check-label mx-1">Yes</label>
                  <input
                    type="radio"
                    className="form-check-input"
                    value="no"
                    name="radioOption"
                    checked={trending === "no"}
                    onChange={handleTrending}
                  />
                  <label className="form-check-label mx-1">No</label>
                </div>
              </div>
              <div className="col-12 py-3">
                <select
                  value={category}
                  onChange={onCategoryChange}
                  className="form-control"
                >
                  <option value="">Please select category</option>
                  {categoryOption.map((option, index) => (
                    <option value={option} key={index}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 py-3">
  <label>Upload New Image (Optional)</label>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => handleImageUpload(e.target.files[0])}
  />
</div>
              {imgUrl && (
                <div className="col-12 py-3">
                  <img src={imgUrl} alt="Preview" style={{ maxWidth: "100%" }} />
                </div>
              )}
              <div className="col-12 py-3">
                <ReactQuill value={description} onChange={setDescription} placeholder="Write something..." />
              </div>
              <div className="col-12 py-3 text-center">
                <button className="btn btn-add" type="submit">
                  {id ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditBlog;