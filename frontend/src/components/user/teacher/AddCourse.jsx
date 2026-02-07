import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AxiosInstance from '../../common/AxiosInstance';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CircularProgress from '@mui/material/CircularProgress';

const AddCourse = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [formData, setFormData] = useState({
    C_title: '',
    C_description: '',
    C_categories: 'Web Development',
    C_price: 0,
  });
  const [sections, setSections] = useState([]);
  const [newSection, setNewSection] = useState({
    title: '',
    description: '',
    duration: 0,
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingCourse, setFetchingCourse] = useState(false);

  const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Cloud Computing',
    'DevOps',
    'Cybersecurity',
    'UI/UX Design',
    'Digital Marketing',
    'Business',
    'Other',
  ];

  useEffect(() => {
    if (editId) {
      fetchCourse();
    }
  }, [editId]);

  const fetchCourse = async () => {
    setFetchingCourse(true);
    try {
      const response = await AxiosInstance.get(`/users/courses/${editId}`);
      const course = response.data;
      setFormData({
        C_title: course.C_title,
        C_description: course.C_description,
        C_categories: course.C_categories,
        C_price: course.C_price,
      });
      setSections(course.sections || []);
    } catch (error) {
      toast.error('Failed to fetch course details');
      navigate('/teacher');
    } finally {
      setFetchingCourse(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'C_price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSectionChange = (e) => {
    const { name, value } = e.target;
    setNewSection((prev) => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) || 0 : value,
    }));
  };

  const handleAddSection = () => {
    if (!newSection.title.trim()) {
      toast.error('Section title is required');
      return;
    }

    setSections((prev) => [
      ...prev,
      {
        ...newSection,
        order: prev.length + 1,
        _id: `temp-${Date.now()}`,
      },
    ]);
    setNewSection({ title: '', description: '', duration: 0 });
    toast.success('Section added');
  };

  const handleRemoveSection = (index) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.C_title.trim() || !formData.C_description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('C_title', formData.C_title);
      submitData.append('C_description', formData.C_description);
      submitData.append('C_categories', formData.C_categories);
      submitData.append('C_price', formData.C_price);
      submitData.append('sections', JSON.stringify(sections));

      if (image) {
        submitData.append('image', image);
      }

      if (editId) {
        await AxiosInstance.put(`/users/courses/${editId}`, {
          ...formData,
          sections,
        });
        toast.success('Course updated successfully');
      } else {
        await AxiosInstance.post('/users/courses', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Course created successfully');
      }

      navigate('/teacher');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save course');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingCourse) {
    return (
      <div className="loader" style={{ minHeight: '80vh' }}>
        <CircularProgress />
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

        <div className="row">
          <div className="col-lg-8">
            <div className="form-card">
              <div className="form-card-header">
                <h2>{editId ? 'Edit Course' : 'Create New Course'}</h2>
              </div>
              <div className="form-card-body">
                <form onSubmit={handleSubmit}>
                  {/* Course Details */}
                  <div className="mb-4">
                    <h6 className="form-section-title">Course Details</h6>

                    <div className="mb-3">
                      <label className="form-label">Course Title *</label>
                      <input
                        type="text"
                        name="C_title"
                        className="form-control"
                        placeholder="Enter course title"
                        value={formData.C_title}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Description *</label>
                      <textarea
                        name="C_description"
                        className="form-control"
                        rows="4"
                        placeholder="Enter course description"
                        value={formData.C_description}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Category *</label>
                        <select
                          name="C_categories"
                          className="form-select"
                          value={formData.C_categories}
                          onChange={handleChange}
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Price ($)</label>
                        <input
                          type="number"
                          name="C_price"
                          className="form-control"
                          min="0"
                          step="0.01"
                          value={formData.C_price}
                          onChange={handleChange}
                        />
                        <small className="form-text">
                          Set to 0 for free course
                        </small>
                      </div>
                    </div>

                    {!editId && (
                      <div className="mb-3">
                        <label className="form-label">Course Image</label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => setImage(e.target.files[0])}
                        />
                      </div>
                    )}
                  </div>

                  {/* Sections */}
                  <div className="mb-4">
                    <h6 className="form-section-title">Course Sections</h6>

                    {sections.length > 0 && (
                      <div className="mb-3">
                        {sections.map((section, index) => (
                          <div key={section._id} className="section-entry">
                            <div className="section-entry-info">
                              <strong>
                                {index + 1}. {section.title}
                              </strong>
                              {section.description && (
                                <p>{section.description}</p>
                              )}
                              {section.duration > 0 && (
                                <small>Duration: {section.duration} min</small>
                              )}
                            </div>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleRemoveSection(index)}
                            >
                              <DeleteIcon fontSize="small" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Section Form */}
                    <div className="add-section-form">
                      <h4>Add New Section</h4>
                      <div className="row g-2">
                        <div className="col-md-6">
                          <input
                            type="text"
                            name="title"
                            className="form-control"
                            placeholder="Section title"
                            value={newSection.title}
                            onChange={handleSectionChange}
                          />
                        </div>
                        <div className="col-md-4">
                          <input
                            type="number"
                            name="duration"
                            className="form-control"
                            placeholder="Duration (min)"
                            min="0"
                            value={newSection.duration}
                            onChange={handleSectionChange}
                          />
                        </div>
                        <div className="col-md-2">
                          <button
                            type="button"
                            className="btn btn-outline-primary w-100"
                            onClick={handleAddSection}
                          >
                            <AddIcon />
                          </button>
                        </div>
                        <div className="col-12">
                          <textarea
                            name="description"
                            className="form-control"
                            placeholder="Section description (optional)"
                            rows="2"
                            value={newSection.description}
                            onChange={handleSectionChange}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="form-actions">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <>
                          <SaveIcon className="me-1" />
                          {editId ? 'Update Course' : 'Create Course'}
                        </>
                      )}
                    </button>
                    <Link to="/teacher" className="btn btn-outline-secondary">
                      Cancel
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="col-lg-4 mt-4 mt-lg-0">
            <div className="preview-card">
              <div className="preview-card-header">Preview</div>
              <div className="preview-card-body">
                <img
                  src={
                    image
                      ? URL.createObjectURL(image)
                      : 'https://placehold.co/400x200?text=Course+Image'
                  }
                  alt="Preview"
                />
                <span className="badge bg-primary mb-2">
                  {formData.C_categories}
                </span>
                <h3>{formData.C_title || 'Course Title'}</h3>
                <p>
                  {formData.C_description?.substring(0, 100) ||
                    'Course description will appear here...'}
                </p>
                <div className="d-flex justify-content-between">
                  <span style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
                    {formData.C_price === 0
                      ? 'Free'
                      : `$${formData.C_price}`}
                  </span>
                  <span style={{ color: 'var(--gray-500)', fontSize: 'var(--text-sm)' }}>
                    {sections.length} sections
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
