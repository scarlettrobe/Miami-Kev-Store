// BlogPostForm.js
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBlogPost, editBlogPost } from '../../store/blog';

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
        <form onSubmit={handleSubmit}>
            <label>
                Title
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </label>
            <label>
                Content
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
            </label>
            <button type="submit">{post ? 'Update' : 'Create'}</button>
        </form>
    );
}

export default BlogPostForm;
