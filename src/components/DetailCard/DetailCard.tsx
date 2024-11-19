import React from 'react';
import { Link } from 'react-router-dom';
import { T_Detail } from '../../modules/types';

type DetailCardProps = {
    detail: T_Detail;
};

const DetailCard: React.FC<DetailCardProps> = ({ detail }) => {
    return (
        <div className="product-card">
            <div className="image">
                <img
                    src={detail.image || 'default.jpg'}
                    alt={detail.name}
                    className="image"
                />
            </div>
            <div className="mt-0 mb-0 product-info">
                <div className="product-name">
                    <Link to={`/detail/${detail.id}`} style={{ color: 'black', textDecoration: 'none' }}>
                        {detail.name}
                    </Link>
                </div>
                <div className="product-part-number">Номер запчасти: {detail.part_number}</div>
                <div className="product-model">{detail.model_info}</div>
                <div className="product-price">{detail.price} ₽</div>
            </div>
        </div>
    );
};

export default DetailCard;
