import { useEffect, FormEvent, useState } from 'react'; 
import './DetailsPage.css';
import { DetailsMocks } from '../../modules/mocks';
import { T_Detail } from '../../modules/types';
import DetailCard from '../../components/DetailCard/DetailCard';
import { setTitle, useTitle } from '../../slices/detailsSlice';
import { useDispatch } from 'react-redux';

const DetailsPage = () => {
    const [details, setDetails] = useState<T_Detail[]>([]);
    const [isMock, setIsMock] = useState(false);
    const [quantity, setQuantity] = useState(0);
    const [selectedTitle, setSelectedTitle] = useState<string>(useTitle() || ''); 

    const dispatch = useDispatch();
    const name= useTitle() || '';

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        dispatch(setTitle(selectedTitle));
    };

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/details/?name=${name.toLowerCase()}`, { signal: AbortSignal.timeout(1000) });
           
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setDetails(result.details);
            setQuantity( result.quantity || 0 );
            setIsMock(false);
        } catch (error) {
            createMocks();
        }
    };
    
    
    const createMocks = () => {
        setIsMock(true);
        setDetails(DetailsMocks.filter(detail => detail.name.toLowerCase().includes(name.toLowerCase())));
    }


    useEffect(() => {
        fetchData();
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
                                    <a href={`/car_order/${quantity}`}>
                                        <img src="shopping-cart.svg" alt="Cart" />
                                    </a>
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