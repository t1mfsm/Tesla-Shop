import React, { useEffect, useState } from 'react';
import './DetailPage.css';
import { DetailsMocks } from '../../modules/mocks';
import { T_Detail } from '../../modules/types';
import { useParams } from 'react-router-dom';

import defaultimg from '../../../public/default.jpg'

const DetailPage: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const [detail, setDetail] = useState<T_Detail | null>(null);
  const [isMock, setIsMock] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/details/${id}`, { signal: AbortSignal.timeout(1000) });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setDetail(data);
    } catch (error) {
      console.error('Fetch error:', error);
      createMock();
    }
  };

  const createMock = () => {
    setIsMock(true);
    setDetail(DetailsMocks.find(detail => detail?.id == parseInt(id as string)) as T_Detail)
  }

  useEffect(() => {
    if (!isMock) {
      fetchData();
    } else {
      createMock();
    }

    return () => {
      setDetail(null);
    };
  }, [id, isMock]);

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
