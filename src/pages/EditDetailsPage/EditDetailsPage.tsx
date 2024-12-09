import { useEffect, useState } from "react";
import { Col, Container, Form, Input, Row } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { T_CarOrderFilters } from "../../utils/types";
import { clearDetail, fetchDetails, setNewDetail } from "../../slices/detailsSlice";
import { fetchCarOrders, updateFilters } from "../../slices/carOrder";
import DetailsTable from "../../components/DetailsTable";






const EditDetailsPage = () => {
  const dispatch = useAppDispatch();

  const details = useAppSelector((state) => state.details.details);
  const isAuthenticated = useAppSelector((state) => state.user?.is_authenticated);
  const isStaff = useAppSelector((state) => state.user.is_staff);

  const navigate = useNavigate();

  const [status, setStatus] = useState( ""); // По умолчанию пустой статус
  const [dateFormationStart, setDateFormationStart] = useState(""); 
  const [dateFormationEnd, setDateFormationEnd] = useState( ""); 


  const handleAddClick = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(setNewDetail(true))


      navigate('/edit-detail/null');
  };

  const statusOptions = {
    "": "Любой", 
    active: "Активна",
    deleted: "Удалена",
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/403/");
    }
  }, [isAuthenticated, navigate]);


useEffect(()=>{
  if (!isStaff) {
    navigate('/404')
  }
  dispatch(fetchDetails())
  dispatch(clearDetail())
},[])



  // Эффект для загрузки данных самозанятых при изменении фильтров
  useEffect(() => {
    // Обновляем фильтры в хранилище
    const updatedFilters: T_CarOrderFilters = {
      status: status || "", 
      start_date: dateFormationStart || "", 
      end_date: dateFormationEnd || "", 
    };
    
    dispatch(updateFilters(updatedFilters)); // Обновляем фильтры в состоянии
    dispatch(fetchCarOrders()); // Загружаем данные с примененными фильтрами
  }, [status, dateFormationStart, dateFormationEnd, dispatch]);

  return (
    <main id="main" className="page">
      <div className="page__services _container">
        <Container>
  
          {details.length ? (
            <DetailsTable details={details} />
          ) : (
            <h3 className="text-center mt-5">Самозанятые не найдены</h3>
          )}

<Row className="mt-5">
            <Col className="d-flex gap-5 justify-content-center">
              <button  className="button-page grey" onClick={handleAddClick}>Добавить</button>
            </Col>
          </Row>
        </Container>
      </div>
    </main>
  );
};

export default EditDetailsPage;