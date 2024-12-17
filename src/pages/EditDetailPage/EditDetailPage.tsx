import React, { useEffect, useRef, useState } from 'react';
import './EditDetailPage.css';

import { useNavigate, useParams } from 'react-router-dom';

import defaultimg from '../../../public/default.jpg'
import { AddDetail, clearNewDetail, deleteDetail, EditDetail, fetchDetail, useDetail } from '../../slices/detailsSlice';
import { useAppDispatch, useAppSelector } from '../../store';
import { Col, Row } from 'reactstrap';

const EditDetailPage: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const dispatch = useAppDispatch();



  const detail = useDetail()
  console.log('price', detail?.price)



  const [editableName, setEditableName] = useState(detail?.name || '');
  const [editableArticle, setEditableArticle] = useState(detail?.article_number || '');
  const [editableBrand, setEditableBrand] = useState(detail?.brand || '');
  const [editableModel, setEditableModel] = useState(detail?.model || '');
  const [editableModelInfo, setEditableModelInfo] = useState(detail?.model_info || '');
  const [editableYear, setEditableYear] = useState(detail?.year || '');
  const [editableNote, setEditableNote] = useState(detail?.note || '');
  const [editablePrice, setEditablePrice] = useState(detail?.price || '');
  const [editablePartNumber, setEditablePartNumber] = useState(detail?.part_number || '');
  const [editableImage, setEditableImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(detail?.image|| '');
  const new_detail= useAppSelector((state) => state.details.new_detail);
  const isStaff = useAppSelector((state) => state.user.is_staff);
  const navigate = useNavigate();
  
  const inputFileRef = useRef<HTMLInputElement>(null);



  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditableImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleImageClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };


  const handleSaveClick = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const data = {
      name: editableName,
      article_number: editableArticle,
      brand: editableBrand,
      model: editableModel,
      year: editableYear,
      part_number: editablePartNumber,
      note: editableNote,
      image: editableImage,
      price: editablePrice,
      model_info: editableModelInfo,
      
    };

    if (new_detail) {
      dispatch(AddDetail({ id: String(id), data })).then(() => {
        dispatch(clearNewDetail())

        navigate('/edit-details/');
      });
    } else {
      // Edit existing activity
      dispatch(EditDetail({ id: String(id), data })).then(() => {
        navigate('/edit-details/');
      });
    }
  };
  
  const handleDeleteActivity = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

   
    dispatch(deleteDetail(String(id))).then(() => {
      // Redirect or show success message
      navigate('/edit-details/');
    });
  };
  




  useEffect(() => {

      dispatch(fetchDetail(String(id)));
   
  }, [id,  dispatch]);
  useEffect(() => {

     console.log('detail', detail)
     if (detail) {
      setEditableName(detail?.name || '');
      setEditableArticle(detail?.article_number || '');
      setEditableBrand(detail?.brand || '');
      setEditableModel(detail?.model || '');
      setEditableYear(detail?.year || '');
      setEditablePartNumber(detail?.part_number || '');
      setImagePreview(detail?.image|| '');
      setEditableNote(detail?.note || '');
      setEditablePrice(detail?.price || '');
      setEditableModelInfo(detail?.model_info || '');
       
      }
   
  }, [detail]);


  useEffect(() => {
    if (!isStaff) {
      navigate('/404')
    }
  }, []);

    return (
      <div className="container-fluid product-container">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="product-detail-container">
              <h1 className="product-Name">
                <input
                  type="text"
                  value={editableName}
                  onChange={(e) => setEditableName(e.target.value)}
                  placeholder="Name"
                  className="form-control"
                />
              </h1>
  
              <div className="product-details">
                <div className="image-container">
                  <img
                    src={imagePreview || defaultimg}
                    alt={editableName}
                    onError={(e) => { e.currentTarget.src = defaultimg; }}
                    className="product-image"
                    onClick={handleImageClick}
                  />
                  <input
                    type="file"
                    ref={inputFileRef}
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </div>
  
                <div className="info">
                <div className="form-group">
                    <label htmlFor="article_number">Цена:</label>
                    <input
                      type="text"
                      id="article_number"
                      value={editablePrice}
                      onChange={(e) => setEditablePrice(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="article_number">Артикул:</label>
                    <input
                      type="text"
                      id="article_number"
                      value={editableArticle}
                      onChange={(e) => setEditableArticle(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="article_number">Описание:</label>
                    <input
                      type="text"
                      id="article_number"
                      value={editableModelInfo}
                      onChange={(e) => setEditableModelInfo(e.target.value)}
                      className="form-control"
                    />
                  </div>
  
                  <div className="form-group">
                    <label htmlFor="brand">Марка:</label>
                    <input
                      type="text"
                      id="brand"
                      value={editableBrand}
                      onChange={(e) => setEditableBrand(e.target.value)}
                      className="form-control"
                    />
                  </div>
  
                  <div className="form-group">
                    <label htmlFor="model">Модель:</label>
                    <input
                      type="text"
                      id="model"
                      value={editableModel}
                      onChange={(e) => setEditableModel(e.target.value)}
                      className="form-control"
                    />
                  </div>
  
                  <div className="form-group">
                    <label htmlFor="year">Год:</label>
                    <input
                      type="number"
                      id="year"
                      value={editableYear}
                      onChange={(e) => setEditableYear(e.target.value)}
                      className="form-control"
                    />
                  </div>
  
                  <div className="form-group">
                    <label htmlFor="part_number">Номер запчасти:</label>
                    <input
                      type="text"
                      id="part_number"
                      value={editablePartNumber}
                      onChange={(e) => setEditablePartNumber(e.target.value)}
                      className="form-control"
                    />
                  </div>
  
                  <div className="form-group">
                    <label htmlFor="note">Примечание:</label>
                    <textarea
                      id="note"
                      value={editableNote}
                      onChange={(e) => setEditableNote(e.target.value)}
                      className="form-control"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
  
              <Row className="mt-5">
                <Col className="d-flex gap-5 justify-content-center">
                  <button className="add-detail-order-btn" onClick={handleSaveClick}> {new_detail ? 'Добавить' : 'Сохранить'}</button>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    );


};

export default EditDetailPage;
