import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUpload, FaTrash, FaGripVertical } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './TeamGalleryManager.css';

const TeamGalleryManager = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchImages = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/team-gallery');
      setImages(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setMessage('Please select an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setMessage('Image must be less than 2MB');
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      try {
        await axios.post('http://localhost:5000/api/team-gallery', { imageUrl: base64 });
        fetchImages();
        setMessage('Image added!');
        setTimeout(() => setMessage(''), 2000);
      } catch (err) {
        setMessage('Upload failed');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this image?')) {
      try {
        await axios.delete(`http://localhost:5000/api/team-gallery/${id}`);
        fetchImages();
      } catch (err) {
        setMessage('Delete failed');
      }
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const reordered = Array.from(images);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setImages(reordered);
    // send new order to backend
    const imageIds = reordered.map(img => img._id);
    try {
      await axios.put('http://localhost:5000/api/team-gallery/order', { imageIds });
    } catch (err) {
      console.error('Order save failed');
      fetchImages(); // revert
    }
  };

  if (loading) return <div className="tg-loader">Loading team gallery...</div>;

  return (
    <div className="team-gallery-manager">
      <div className="tg-header">
        <h2> Team Gallery – Our People</h2>
        <div className="tg-upload">
          <label className="tg-upload-btn">
            <FaUpload /> {uploading ? 'Uploading...' : 'Add Picture'}
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} hidden />
          </label>
        </div>
      </div>
      {message && <div className="tg-message">{message}</div>}
      {images.length === 0 ? (
        <div className="tg-empty">No team pictures yet. Click "Add Picture" to upload.</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="team-gallery" direction="horizontal">
            {(provided) => (
              <div className="tg-grid" ref={provided.innerRef} {...provided.droppableProps}>
                {images.map((img, index) => (
                  <Draggable key={img._id} draggableId={img._id} index={index}>
                    {(provided) => (
                      <div
                        className="tg-card"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <div className="tg-drag-handle" {...provided.dragHandleProps}>
                          <FaGripVertical />
                        </div>
                        <img src={img.imageUrl} alt="team member" />
                        <button className="tg-delete" onClick={() => handleDelete(img._id)}>
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default TeamGalleryManager;