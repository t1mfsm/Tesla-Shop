import React, { useEffect, useState } from 'react';
import './DetailPage.css';

import { useParams } from 'react-router-dom';

import defaultimg from '../../../public/default.jpg'
import { fetchDetail, useDetail } from '../../slices/detailsSlice';
import { useAppDispatch } from '../../store';

const DetailPage: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const dispatch = useAppDispatch();



  const detail = useDetail()

  
  useEffect(() => {
   dispatch(fetchDetail(String(id)))
  }, [id]);

  if (!detail) {
    return <div>Деталь не найдена</div>;
  }

  return (
    <div className="container-fluid product-container">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="product-detail-container">
            <h1 className="product-title">
              {detail.name}
            </h1>
            <div className="product-details">
              <img
                src={detail.image || defaultimg}
                alt={detail.name}
                onError={(e) => { e.currentTarget.src = defaultimg; }}
                className="product-image"
              />
              <div className="info">
                <p className="price">{detail.price} ₽</p>
                <p><strong>Артикул:</strong> {detail.article_number}</p>
                <p><strong>Марка:</strong> {detail.brand}</p>
                <p><strong>Модель:</strong> {detail.model}</p>
                <p><strong>Год:</strong> {detail.year}</p>
                <p><strong>Номер запчасти:</strong> {detail.part_number}</p>
                <p className="note"><strong>Примечание:</strong> {detail.note}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
