import { useEffect, FormEvent, useState } from 'react'; 
import './DetailsPage.css';
import { DetailsMocks } from '../../modules/mocks';
import { T_Detail } from '../../modules/types';
import DetailCard from '../../components/DetailCard/DetailCard';
import { fetchDetails, setTitle, useDetails, useTitle } from '../../slices/detailsSlice';
import { useDispatch } from 'react-redux';
import { useAppDispatch } from '../../store';
import { useCarOrderID, useDetailCount } from '../../slices/carOrder';
import { Link } from 'react-router-dom';


const DetailsPage = () => {
    
    const [isMock, setIsMock] = useState(false);

    const [selectedTitle, setSelectedTitle] = useState<string>(useTitle() || ''); 


    const dispatch = useAppDispatch()
    const details= useDetails()

    const car_order_id = useCarOrderID()

    const quantity = useDetailCount()
    console.log('count', quantity)

    const name= useTitle() || '';

    

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // console.log('change',name )
        dispatch(setTitle(selectedTitle));
    };

  
    useEffect(() => {
        dispatch(fetchDetails())
    }, [name]);

    return (
        <div className="product-list-page">
            <div className="container-fluid">
                <div className="row-container">
                        <div className="product-list">
                            {details.length ? (
                                details.map((detail) => (
                                    <DetailCard key={detail.id} detail={detail} />
                                ))
                            ) : (
                                <p>Товары не найдены.</p>
                            )}
                        </div>


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
                                {quantity > 0 ? (
                                    <Link to={`/car_order/${car_order_id}`}>
                                        <img src="shopping-cart.svg" alt="Cart" />
                                    </Link>
                                ) : (
                                    <img src="shopping-cart.svg" alt="Cart" className="disabled" />
                                )}
                                <span className="cart-badge position-absolute top-10 start-40 translate-right">
                                    {quantity > 0 ? quantity : 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsPage;