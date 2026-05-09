import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:5000/api/stories"; // Apne backend port ke hisaab se change karein

const HomeSettingManager = () => {
    const [stories, setStories] = useState([]);
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => { fetchStories(); }, []);

    const fetchStories = async () => {
        const res = await axios.get(API_URL);
        setStories(res.data);
    };

    const handleSave = async () => {
        await axios.post(`${API_URL}/save`, { id: editId, content, imageUrl });
        resetForm();
        fetchStories();
    };

    const handleEdit = (story) => {
        setEditId(story._id);
        setContent(story.content);
        setImageUrl(story.imageUrl);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Kya aap ise delete karna chahte hain?")) {
            await axios.delete(`${API_URL}/${id}`);
            fetchStories();
        }
    };

    const resetForm = () => {
        setEditId(null);
        setContent('');
        setImageUrl('');
    };

    return (
        <div style={containerStyle}>
            {/* Form Section - Based on image_b99ee4.png */}
            <div style={cardStyle}>
                <h3 style={{ color: '#2c3e50', marginBottom: '5px' }}>Our Story</h3>
                <p style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '15px' }}>Story Content</p>
                
                <textarea 
                    style={textareaStyle} 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Apni kahani likhein..."
                />

                <div style={imageBoxStyle}>
                    <p style={{ fontSize: '14px', color: '#555' }}>Story Image</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <img src={imageUrl || 'https://via.placeholder.com/80'} style={thumbStyle} alt="preview" />
                        <input 
                            type="text" 
                            placeholder="Image URL paste karein" 
                            value={imageUrl} 
                            onChange={(e) => setImageUrl(e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button onClick={handleSave} style={saveBtnStyle}>{editId ? 'Update Story' : 'Save Story'}</button>
                    {editId && <button onClick={resetForm} style={cancelBtnStyle}>Cancel</button>}
                </div>
            </div>

            {/* List Table Section */}
            <div style={{ marginTop: '40px' }}>
                <h4>Saved Stories</h4>
                <table style={tableStyle}>
                    <thead>
                        <tr style={{ background: '#f8f9fa' }}>
                            <th>Content Preview</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stories.map(s => (
                            <tr key={s._id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px', fontSize: '14px' }}>{s.content.substring(0, 100)}...</td>
                                <td style={{ padding: '10px' }}>
                                    <button onClick={() => handleEdit(s)} style={editBtn}>Edit</button>
                                    <button onClick={() => handleDelete(s._id)} style={delBtn}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Styles (Clean & Professional) ---
const containerStyle = { maxWidth: '900px', margin: 'auto', padding: '20px', fontFamily: 'sans-serif' };
const cardStyle = { background: '#fff', borderRadius: '12px', padding: '25px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', border: '1px solid #eee' };
const textareaStyle = { width: '100%', height: '180px', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' };
const imageBoxStyle = { marginTop: '20px', padding: '15px', border: '1px dashed #ccc', borderRadius: '10px', textAlign: 'center' };
const thumbStyle = { width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' };
const inputStyle = { flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ddd' };
const saveBtnStyle = { background: '#d4a373', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const cancelBtnStyle = { background: '#95a5a6', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '6px', cursor: 'pointer' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '10px', background: '#fff' };
const editBtn = { background: '#f1c40f', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' };
const delBtn = { background: '#e74c3c', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };

export default HomeSettingManager;