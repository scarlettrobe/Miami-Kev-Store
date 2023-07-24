import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBlogPost, editBlogPost } from '../../store/blog';
import './blog.css';

function BlogPostForm({ post, setEditing }) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState(post ? post.title : '');
    const [content, setContent] = useState(post ? post.content : '');
    const [titleError, setTitleError] = useState('');
    const [contentError, setContentError] = useState('');

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

        // Validate title and content before submitting
        if (!title.trim()) {
            setTitleError('Title is required.');
            return;
        }

        if (!content.trim()) {
            setContentError('Content is required.');
            return;
        }

        // Reset error messages
        setTitleError('');
        setContentError('');

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
                    onChange={(e) => {
                        setTitle(e.target.value);
                        setTitleError('');
                    }}
                    required
                />
                {titleError && <p className="error-message">{titleError}</p>}
            </label>
            <label className="blog-label">
                Content
                <textarea
                    className="blog-textarea"
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);
                        setContentError('');
                    }}
                    required
                />
                {contentError && <p className="error-message">{contentError}</p>}
            </label>
            <button className="button2" type="submit">{post ? 'Update' : 'Create'}</button>
        </form>
    );
}

export default BlogPostForm;
