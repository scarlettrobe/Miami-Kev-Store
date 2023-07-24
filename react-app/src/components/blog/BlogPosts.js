import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getBlogPosts, deleteBlogPost } from '../../store/blog';
import BlogPostForm from './BlogPostForm';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import './blog.css';

function BlogPosts() {
  const dispatch = useDispatch();
  const blogPosts = useSelector((state) => Object.values(state.blog));
  const [editing, setEditing] = useState(null); // for tracking currently edited post
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);

  useEffect(() => {
    dispatch(getBlogPosts());
  }, [dispatch]);

  const handleDelete = (id) => {
    setPostIdToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (postIdToDelete) {
      dispatch(deleteBlogPost(postIdToDelete));
    }
    setPostIdToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleCancelDelete = () => {
    setPostIdToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleEdit = (id) => {
    setEditing(id);
  };

  return (
    <div className="blog-container">
      <div>
        {blogPosts.map((post) => (
          <div key={post.id}>
            <h2 className="blog-post-title">{post.title}</h2>
            <p className="blog-post-content">{post.content}</p>
            <button className="button" onClick={() => handleDelete(post.id)}>
              Delete
            </button>
            <button className="button" onClick={() => handleEdit(post.id)}>
              Edit
            </button>

            {editing === post.id && <BlogPostForm post={post} setEditing={setEditing} />}
          </div>
        ))}
        <h2 className="blog-h2">Create New Blog Post</h2>
        <BlogPostForm setEditing={setEditing} />
      </div>
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default BlogPosts;
