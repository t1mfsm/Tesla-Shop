import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { T_Detail } from '../../modules/types';
import { RootState, useAppDispatch, useAppSelector } from '../../store';
import { AddToCarOrder, fetchDetails } from '../../slices/detailsSlice';


type DetailCardProps = {
    detail: T_Detail;
};

const DetailCard: React.FC<DetailCardProps> = ({ detail }) => {

    const dispatch = useAppDispatch()

    const isAuthenticated = useAppSelector((state: RootState) => state.user.is_authenticated); // получаем состояние авторизации
    const navigate = useNavigate();

    const handleAddToCarOrder = async () => {
        // if (!isAuthenticated) {
        //     navigate('/403');
        //     return;
        // }

        await dispatch(AddToCarOrder(String(detail.id)));
        await dispatch(fetchDetails());
    };

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
                <button className="add-to-cart-button" onClick={handleAddToCarOrder}>
                        В корзину
                    </button>

            </div>
        </div>
    );
};

export default DetailCard;
