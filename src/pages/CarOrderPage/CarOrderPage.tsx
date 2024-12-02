import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchCarOrder } from '../../slices/carOrder';
import './CarOrderPage.css'

const CarOrderPage = () => {



    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
  
    const car_order = useAppSelector((state) => state.carOrder.car_order);
  
    const [fio, setFio] = useState('');
    const [isDeleted, setIsDeleted] = useState(false);
    const [isForm, setIsForm] = useState(false);
    const [isdeleteM, setDeleteM] = useState(false);
  
    // const status = car_order?.self_employed?.status;
  
    useEffect(() => {
      dispatch(fetchCarOrder(String(id)));
      console.log('red', car_order);
    }, [dispatch, id, isDeleted, isForm, isdeleteM]);
  
    // useEffect(() => {
    //   if (self_employed?.self_employed?.fio) {
    //     setFio(self_employed.self_employed.fio);
    //   }
    // }, [self_employed]);
  
    // const saveFields = async (e) => {
    //   e.preventDefault();
  
    //   const data = {
    //     fio: fio,
    //   };
  
    //   console.log('id', id);
    //   await dispatch(updateSelfEmployed({ id: id, fio: data.fio }));
    // };
  
    // const deleteSelfEmployedHandler = async () => {
    //   if (id) {
    //     await dispatch(deleteSelfEmployed(id));
    //     setIsDeleted(true);
    //     navigate('/activities');
    //   } else {
    //     console.error('ID не найден для удаления');
    //   }
    // };
  
    // const formSelfEmployedHandler = async () => {
    //   if (id) {
    //     await dispatch(formSelfEmployed(id));
    //     setIsForm(true);
    //     navigate('/activities');
    //   } else {
    //     console.error('ID не найден для удаления');
    //   }
    // };
  
    // const deleteActivityFromSelfEmployedHandler = async (activity_id) => {
    //   if (id) {
    //     console.log('Deleting activity with ID:', activity_id);
        
    //     // Удаление активности
    //     await dispatch(deleteActivityFromSelfEmployed({ self_employed_id: id, activity_id }));
    
    //     // Обновление состояния (например, isdeleteM) после выполнения действия
    //     setDeleteM(true);  // Это состояние может быть в useState
    
    //     // Обновление данных
    //     await dispatch(fetchSelfEmployed(String(id)));
    
      
    //   }
    // };
  
    // const handleCheckboxChange = async (activityId, importance) => {
    //   // Обновляем важность через asyncThunk
    //   await dispatch(updateImportance({ 
    //     self_employed_id: id, 
    //     activity_id: activityId, 
    //     importance: importance 
    //   }));
  
    //   await dispatch(fetchSelfEmployed(String(id)));
    // };
    
  
    if (!car_order || id === 'null') {
      return (
        <div className='home'>
          Корзина пуста
        </div>
      );
    }
  
    const { order_products } = car_order;
  
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3"></div>

        <div className="col-md-6">
          <div className="cart-label">
            <h2>Корзина для заказа № {car_order.id}</h2>
          </div>
          <div className="container-order">
            <div className="row-order">
              <div className="label">Завод</div>
              <div className="value">{car_order.factory}</div>
            </div>
            <div className="row-order">
              <div className="label">Дата заказа</div>
              <div className="value">{car_order.order_date}</div>
            </div>
            <div className="row-order">
              <div className="label">Дата доставки</div>
              <div className="value">{car_order.ship_date}</div>
            </div>
          </div>
  
            <div className="product-container">
              {order_products.map((product) => (
                <div className="product-card-order" key={product.product.id}>
                  <img className="image" src={product.product.image} alt={product.product.name} />
                  <div className="product-info">
                    <div className="product-name">
                      <Link to={`/product/${product.product.id}`} style={{ color: 'black', textDecoration: 'none' }}>
                        {product.product.name}
                      </Link>
                    </div>
                    <div className="product-price">{product.product.price} ₽</div>
                  </div>
                  <div className="quantity-controls">
                    <input type="text" id={`quantity-${product.product.id}`} className="quantity-input" value={product.quantity} readOnly />
                  </div>
                </div>
              ))}
    

            {/* <div className="total-sum">
              Итоговая сумма: {totalSum} ₽
            </div> */}
          </div>
        </div>

        <div className="col-md-1"></div>
        <div className="col-md-2">
          <button onClick={() => deleteOrder()} className="delete-order-btn">
            Удалить заказ
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarOrderPage;
