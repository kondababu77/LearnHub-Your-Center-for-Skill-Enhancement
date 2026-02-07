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
    <div className="container py-4">
      <Link to="/teacher" className="btn btn-outline-secondary mb-3">
        <ArrowBackIcon fontSize="small" className="me-1" />
        Back to Dashboard
      </Link>

      <div className="row">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h4 className="mb-0">
                {editId ? 'Edit Course' : 'Create New Course'}
              </h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Course Details */}
                <div className="mb-4">
                  <h6 className="text-muted mb-3">Course Details</h6>

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
                      <small className="text-muted">
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
                  <h6 className="text-muted mb-3">Course Sections</h6>

                  {sections.length > 0 && (
                    <div className="mb-3">
                      {sections.map((section, index) => (
                        <div
                          key={section._id}
                          className="d-flex align-items-center justify-content-between p-3 bg-light rounded mb-2"
                        >
                          <div>
                            <strong>
                              {index + 1}. {section.title}
                            </strong>
                            {section.description && (
                              <p className="mb-0 text-muted small">
                                {section.description}
                              </p>
                            )}
                            {section.duration > 0 && (
                              <small className="text-muted">
                                Duration: {section.duration} min
                              </small>
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
                  <div className="border rounded p-3">
                    <h6>Add New Section</h6>
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
                <div className="d-flex gap-2">
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
          <div className="card border-0 shadow-sm sticky-top" style={{ top: 90 }}>
            <div className="card-header bg-white">
              <h6 className="mb-0">Preview</h6>
            </div>
            <div className="card-body">
              <img
                src={
                  image
                    ? URL.createObjectURL(image)
                    : 'https://placehold.co/400x200?text=Course+Image'
                }
                className="img-fluid rounded mb-3"
                alt="Preview"
              />
              <span className="badge bg-primary mb-2">
                {formData.C_categories}
              </span>
              <h5>{formData.C_title || 'Course Title'}</h5>
              <p className="text-muted small">
                {formData.C_description?.substring(0, 100) ||
                  'Course description will appear here...'}
              </p>
              <div className="d-flex justify-content-between">
                <span className="text-primary fw-bold">
                  {formData.C_price === 0
                    ? 'Free'
                    : `$${formData.C_price}`}
                </span>
                <span className="text-muted small">
                  {sections.length} sections
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
