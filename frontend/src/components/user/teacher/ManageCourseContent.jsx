import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AxiosInstance, { API_URL } from '../../common/AxiosInstance';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import UploadIcon from '@mui/icons-material/Upload';
import CircularProgress from '@mui/material/CircularProgress';

const ManageCourseContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [editingSectionIndex, setEditingSectionIndex] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [newSection, setNewSection] = useState({
    title: '',
    description: '',
    duration: 0,
    videoFile: null,
  });

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await AxiosInstance.get(`/users/courses/${courseId}`);
      setCourse(response.data);
    } catch (error) {
      toast.error('Failed to fetch course');
      navigate('/teacher');
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'videoFile') {
      setNewSection((prev) => ({ ...prev, videoFile: files[0] }));
    } else {
      setNewSection((prev) => ({
        ...prev,
        [name]: name === 'duration' ? parseInt(value) || 0 : value,
      }));
    }
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    
    if (!newSection.title.trim()) {
      toast.error('Section title is required');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', newSection.title);
      formData.append('description', newSection.description);
      formData.append('duration', newSection.duration);
      
      if (newSection.videoFile) {
        formData.append('video', newSection.videoFile);
      }

      await AxiosInstance.post(`/users/courses/${courseId}/sections`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      toast.success('Section added successfully');
      fetchCourse();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add section');
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  const handleUpdateSection = async (sectionId, updates) => {
    try {
      await AxiosInstance.put(`/users/courses/${courseId}/sections/${sectionId}`, updates);
      toast.success('Section updated');
      fetchCourse();
      setEditingSectionIndex(null);
    } catch (error) {
      toast.error('Failed to update section');
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return;

    try {
      await AxiosInstance.delete(`/users/courses/${courseId}/sections/${sectionId}`);
      toast.success('Section deleted');
      fetchCourse();
    } catch (error) {
      toast.error('Failed to delete section');
    }
  };

  const resetForm = () => {
    setNewSection({
      title: '',
      description: '',
      duration: 0,
      videoFile: null,
    });
    setShowAddSection(false);
  };

  if (loading) {
    return (
      <div className="loader" style={{ minHeight: '80vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-5 text-center">
        <h4>Course not found</h4>
        <Link to="/teacher" className="btn btn-primary mt-3">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-page-container">
        <Link to="/teacher" className="form-back-link">
          <ArrowBackIcon fontSize="small" />
          Back to Dashboard
        </Link>

        {/* Course Header */}
        <div className="content-card mb-4">
          <div style={{ padding: 'var(--space-5) var(--space-6)' }}>
            <div className="row align-items-center">
              <div className="col-md-2">
                <img
                  src={
                    course.C_image
                      ? `${API_URL}${course.C_image}`
                      : 'https://placehold.co/200x120?text=Course'
                  }
                  className="img-fluid rounded"
                  alt={course.C_title}
                />
              </div>
              <div className="col-md-8">
                <span className="badge bg-primary mb-2">{course.C_categories}</span>
                <h4 style={{ fontWeight: 600, color: 'var(--gray-900)', marginBottom: 'var(--space-1)' }}>{course.C_title}</h4>
                <p style={{ color: 'var(--gray-500)', fontSize: 'var(--text-sm)', margin: 0 }}>
                  {course.sections?.length || 0} sections • {course.enrolled} students enrolled
                </p>
              </div>
              <div className="col-md-2 text-end">
                <Link
                  to={`/add-course?edit=${courseId}`}
                  className="btn btn-outline-primary btn-sm"
                >
                  <EditIcon fontSize="small" className="me-1" />
                  Edit Course
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Add Section Button */}
        {!showAddSection && (
          <button
            className="btn btn-primary mb-4"
            onClick={() => setShowAddSection(true)}
          >
            <AddIcon className="me-1" />
            Add New Section
          </button>
        )}

        {/* Add Section Form */}
        {showAddSection && (
          <div className="form-card mb-4">
            <div className="form-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 'var(--text-lg)' }}>Add New Section</h2>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={resetForm}
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>
            <div className="form-card-body">
              <form onSubmit={handleAddSection}>
                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="form-label">Section Title *</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      placeholder="Enter section title"
                      value={newSection.title}
                      onChange={handleSectionChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Duration (minutes)</label>
                    <input
                      type="number"
                      name="duration"
                      className="form-control"
                      placeholder="0"
                      min="0"
                      value={newSection.duration}
                      onChange={handleSectionChange}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows="3"
                      placeholder="Enter section description (optional)"
                      value={newSection.description}
                      onChange={handleSectionChange}
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <label className="form-label">
                      <VideoLibraryIcon fontSize="small" className="me-1" />
                      Video Content
                    </label>
                    <input
                      type="file"
                      name="videoFile"
                      className="form-control"
                      accept="video/*"
                      onChange={handleSectionChange}
                    />
                    <small className="form-text">
                      Supported formats: MP4, WebM, OGG. Max size: 100MB
                    </small>
                  </div>

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="col-12">
                      <div className="learning-progress-bar" style={{ height: 8 }}>
                        <div
                          className="learning-progress-fill"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <small style={{ color: 'var(--gray-500)' }}>{uploadProgress}%</small>
                    </div>
                  )}

                  <div className="col-12 form-actions" style={{ marginTop: 'var(--space-3)' }}>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <CircularProgress size={20} color="inherit" className="me-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <SaveIcon className="me-1" />
                          Save Section
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sections List */}
        <div className="content-card">
          <div className="content-card-header">
            <h3>
              <VideoLibraryIcon />
              Course Sections ({course.sections?.length || 0})
            </h3>
          </div>
          {course.sections?.length > 0 ? (
            <div>
              {course.sections.map((section, index) => (
                <div
                  key={section._id}
                  className="section-list-item"
                  style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 'var(--space-3)' }}
                >
                  <div className="d-flex align-items-start w-100">
                    <div className="section-number">
                      {section.videoUrl ? (
                        <PlayCircleIcon style={{ color: 'var(--primary-600)', fontSize: 20 }} />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>

                    <div className="section-list-info" style={{ flex: 1 }}>
                      {editingSectionIndex === index ? (
                        <EditSectionForm
                          section={section}
                          onSave={(updates) => handleUpdateSection(section._id, updates)}
                          onCancel={() => setEditingSectionIndex(null)}
                        />
                      ) : (
                        <>
                          <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 600 }}>{section.title}</h4>
                          {section.description && (
                            <p style={{ marginBottom: 'var(--space-2)' }}>{section.description}</p>
                          )}
                          <div className="d-flex gap-3" style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>
                            {section.duration > 0 && (
                              <span>Duration: {section.duration} min</span>
                            )}
                            {section.videoUrl && (
                              <span style={{ color: 'var(--success-600)' }}>
                                <PlayCircleIcon fontSize="small" className="me-1" />
                                Video uploaded
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {editingSectionIndex !== index && (
                      <div className="d-flex gap-2" style={{ marginLeft: 'var(--space-4)' }}>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => setEditingSectionIndex(index)}
                        >
                          <EditIcon fontSize="small" />
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteSection(section._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Video Preview */}
                  {section.videoUrl && editingSectionIndex !== index && (
                    <div style={{ marginLeft: 56, paddingLeft: 'var(--space-3)' }}>
                      <video
                        controls
                        className="rounded"
                        style={{ maxWidth: '100%', maxHeight: 200 }}
                        src={`${API_URL}${section.videoUrl}`}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <VideoLibraryIcon style={{ fontSize: 60, color: 'var(--gray-300)' }} />
              <h5 className="mt-3" style={{ color: 'var(--gray-700)' }}>No sections yet</h5>
              <p style={{ color: 'var(--gray-500)' }}>
                Add sections to your course to start sharing content
              </p>
              <button
                className="btn btn-primary"
                onClick={() => setShowAddSection(true)}
              >
                <AddIcon className="me-1" />
                Add First Section
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Edit Section Form Component
const EditSectionForm = ({ section, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: section.title || '',
    description: section.description || '',
    duration: section.duration || 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-2">
        <div className="col-md-6">
          <input
            type="text"
            name="title"
            className="form-control form-control-sm"
            placeholder="Section title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            name="duration"
            className="form-control form-control-sm"
            placeholder="Duration (min)"
            min="0"
            value={formData.duration}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3">
          <div className="btn-group btn-group-sm w-100">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
        <div className="col-12">
          <textarea
            name="description"
            className="form-control form-control-sm"
            rows="2"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>
    </form>
  );
};

export default ManageCourseContent;
