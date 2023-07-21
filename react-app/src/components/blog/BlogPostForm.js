// BlogPostForm.js
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBlogPost, editBlogPost } from '../../store/blog';
import './blog.css';

function BlogPostForm({ post, setEditing }) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState(post ? post.title : '');
    const [content, setContent] = useState(post ? post.content : '');

    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setContent(post.content);
        } else {
            setTitle('');
            setContent('');
        }
    }, [post]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const postData = {
            title,
            content,
        };

        if (post) {
            postData.id = post.id;
            dispatch(editBlogPost(postData));
        } else {
            dispatch(createBlogPost(postData));
        }

        setTitle('');
        setContent('');
        setEditing(null);
    }

    return (
        <form className="blog-form" onSubmit={handleSubmit}>
            <label className="blog-label">
                Title
                <input
                    type="text"
                    className="blog-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </label>
            <label className="blog-label">
                Content
                <textarea
                    className="blog-textarea"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
            </label>
            <button className="button2" type="submit">{post ? 'Update' : 'Create'}</button>

        </form>
    );
}

export default BlogPostForm;
