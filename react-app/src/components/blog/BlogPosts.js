// BlogPosts.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getBlogPosts, deleteBlogPost } from '../../store/blog';
import BlogPostForm from './BlogPostForm';

function BlogPosts() {
    const dispatch = useDispatch();
    const blogPosts = useSelector(state => Object.values(state.blog));
    const [editing, setEditing] = useState(null);  // for tracking currently edited post

    useEffect(() => {
        dispatch(getBlogPosts());
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(deleteBlogPost(id));
    }

    const handleEdit = (id) => {
        setEditing(id);
    }

    return (
        <div>
            {blogPosts.map(post => (
                <div key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                    <button onClick={() => handleDelete(post.id)}>Delete</button>
                    <button onClick={() => handleEdit(post.id)}>Edit</button>
                    {editing === post.id && <BlogPostForm post={post} setEditing={setEditing} />}
                </div>
            ))}
            <h2>Create New Blog Post</h2>
            <BlogPostForm setEditing={setEditing} />
        </div>
    );
}

export default BlogPosts;
