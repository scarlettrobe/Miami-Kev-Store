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
        <div className="blog-container">
        <div>
            {blogPosts.map(post => (
                <div key={post.id}>
                    <h2 className="blog-post-title">{post.title}</h2>
                    <p className="blog-post-content">{post.content}</p>
                    <button className='button' onClick={() => handleDelete(post.id)}>Delete</button>
                    <button className='button' onClick={() => handleEdit(post.id)}>Edit</button>

                    {editing === post.id && <BlogPostForm post={post} setEditing={setEditing} />}
                </div>
            ))}
            <h2 className="blog-h2">Create New Blog Post</h2>
            <BlogPostForm setEditing={setEditing} />
        </div>
        </div>
    );

}

export default BlogPosts;
