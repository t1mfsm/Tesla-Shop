import { useEffect, FormEvent, useState } from 'react'; 
import './DetailsPage.css';
import { DetailsMocks } from '../../modules/mocks';
import { T_Detail } from '../../modules/types';
import DetailCard from '../../components/DetailCard/DetailCard';
import { fetchDetails, setTitle, useDetails, useTitle, setPagination, setFilterByIndex } from '../../slices/detailsSlice';
import { useDispatch } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../store';
import { useCarOrderID, useDetailCount } from '../../slices/carOrder';
import { Link } from 'react-router-dom';
import { usePagination } from '../../slices/detailsSlice';

const DetailsPage = () => {
    const [selectedTitle, setSelectedTitle] = useState<string>(useTitle() || '');
    const dispatch = useAppDispatch();
    const details = useDetails();  // Safe fetch of details
    const car_order_id = useCarOrderID();
    const quantity = useDetailCount() ?? 0;  // Ensure quantity is defined, default to 0 if undefined
    const pagination = usePagination();
    const filterByIndex = useAppSelector((state) => state.details.filterByIndex);
    const name= useTitle() || '';
    const isAuthenticated = useAppSelector((state) => state.user.is_authenticated);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        dispatch(setTitle(selectedTitle));
    };

    const handleFilterToggle = () => {
        // Переключаем состояние фильтрации по индексу
        dispatch(setFilterByIndex(!filterByIndex));
        
    };

    const handlePageChange = (direction: 'next' | 'prev') => {
        if (direction === 'next' && pagination.nextPage) {
            dispatch(setPagination({
                currentPage: pagination.currentPage + 1,
                totalPages: pagination.totalPages,
                nextPage: pagination.nextPage,
                prevPage: pagination.prevPage,
            }));

        } else if (direction === 'prev' && pagination.prevPage) {
            dispatch(setPagination({
                currentPage: pagination.currentPage - 1,
                totalPages: pagination.totalPages,
                nextPage: pagination.nextPage,
                prevPage: pagination.prevPage,
            }));
         
        }
    };
    // Добавим useEffect д   dispatch(fetchDetails());ля скроллинга в начало страницы при изменении пагинации
    useEffect(() => {
        // Скроллим страницу в верх
        window.scrollTo(0, 0);  // Это прокрутит страницу в начало
    }, [pagination.currentPage]);  // Этот эффект сработает каждый раз, когда меняется текущая страница

    useEffect(() => {
        dispatch(fetchDetails());
    }, [ filterByIndex, pagination.currentPage,name]);

    return (
       <div className='page'>
         <div className="product-list-page">
            <div className="container-fluid">
                <div className="row-container">
                    <div className="product-list">
                        {details && details.length > 0 ? (
                            details.map((detail) => (
                                <DetailCard key={detail.id} detail={detail} />
                            ))
                        ) : (
                            <p>Товары не найдены.</p>
                        )}
                    </div>
                      {/* Фильтр по индексу */}
                      {/* <div className="filter-container">
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={filterByIndex} 
                                    onChange={handleFilterToggle} 
                                />
                                Фильтровать по индексу
                            </label>
                        </div> */}

                   

                    <div className="search">
                        <div className="search-cart-container">
                            {/* Search Bar */}
                            <form onSubmit={handleSubmit}>
                                <div className="search-bar">
                                    <input
                                        type="text"
                                        name="search_product"
                                        className="search-input"
                                        placeholder="Введите название"
                                        value={selectedTitle}
                                        onChange={(e) => setSelectedTitle(e.target.value)}
                                    />
                                    <button type="submit" className="search-icon">
                                        <img src="search.svg" alt="Search" />
                                    </button>
                                </div>
                            </form>

                            {/* Cart Icon and Count */}
                            <div className="cart">
                                {quantity > 0 && isAuthenticated ? (
                                    <Link to={`/car_order/${car_order_id}`}>
                                        <img src="shopping-cart.svg" alt="Cart" />
                                    </Link>
                                ) : (
                                    <img src="shopping-cart.svg" alt="Cart" className="disabled" />
                                )}
                               {isAuthenticated ? (
                                 <span className="cart-badge position-absolute top-10 start-40 translate-right">
                                 {quantity}
                             </span>
                               ):(
                                <span className="cart-badge position-absolute top-10 start-40 translate-right">
                                 0
                             </span>
                               )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>

        
             {/* Pagination Controls */}
             <div className="pagination">
                        <button className='pagination-button'
                            disabled={!pagination.prevPage}
                            onClick={() => handlePageChange('prev')}
                        >
                            { '<<' }
                        </button>
                        <span>
                            {pagination.currentPage} из {pagination.totalPages}
                        </span>
                        <button className='pagination-button'
                            disabled={!pagination.nextPage}
                            onClick={() => handlePageChange('next')}
                        >
                            { '>>' }
                        </button>
                    </div>
       </div>
    );
};

export default DetailsPage;
