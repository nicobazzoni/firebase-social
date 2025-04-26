import React from "react";
import FontAwesome from "react-fontawesome";
import { Link } from "react-router-dom";
import { excerpt } from "../utility";

const BlogSection = ({
  id,
  title,
  description,
  category,
  imgUrl,
  userId,
  author,
  timestamp,
  user,
  handleDelete,
}) => {
  console.log("BlogSection imgUrl:", imgUrl);
  return (
    <div className="row pb-4 bg border rounded-md my-2 p-2" key={id}>
      
      <div className="col-md-5">
        <div className="hover-blogs-img">
          <div className="blogs-img">
            {imgUrl ? (
              <img 
                src={imgUrl} 
                alt={title} 
                className="w-100 h-100 object-cover rounded" 
                style={{ maxHeight: "200px" }}
              />
            ) : (
              <div className="w-100 h-100 bg-secondary d-flex align-items-center justify-content-center" style={{ height: "200px" }}>
                <span className="text-white">No Image</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-md-7">
        <div className="text-start">
          <h6 className="category catg-color">{category}</h6>
          <span className="title py-2">{title}</span>
          <span className="meta-info d-block">
            <p className="author d-inline">{author}</p> -&nbsp;
            {timestamp && timestamp.toDate().toDateString()}
          </span>
        </div>

        <div className="short-description text-start">
          <div dangerouslySetInnerHTML={{ __html: excerpt(description, 120) }} />
        </div>

        <Link to={`/detail/${id}`}>
          <button className="btn btn-read mt-2">Read More</button>
        </Link>

        {userId && user?.uid === userId && (
          <div className="float-end">
            <FontAwesome
              name="trash"
              style={{ margin: "15px", cursor: "pointer" }}
              size="2x"
              onClick={() => handleDelete(id)}
            />
            <Link to={`/update/${id}`}>
              <FontAwesome
                name="edit"
                style={{ cursor: "pointer" }}
                size="2x"
              />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogSection;