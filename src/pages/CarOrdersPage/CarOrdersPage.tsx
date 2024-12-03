import { useEffect, useState } from "react";
import { Col, Container, Form, Input, Row } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import CustomDropdown from "../../components/CustomDropdown/CustomDropdown";
import { T_CarOrderFilters } from "../../utils/types";
import Table from "../../components/Table";
import { fetchCarOrders, updateFilters } from "../../slices/carOrder";


// Объект с возможными статусами
const statuses: Record<string, string> = {
  draft: "Черновик",
  deleted: "Удалена",
  formed: "Сформирована",
  completed: "Завершена",
  rejected: "Отклонена",
};

const SelfEmployedPage = () => {
  const dispatch = useAppDispatch();

  const car_orders = useAppSelector((state) => state.carOrder.car_orders);
  const isAuthenticated = useAppSelector((state) => state.user?.is_authenticated);
  const filters = useAppSelector<T_CarOrderFilters>((state) => state.carOrder.filters);

  const navigate = useNavigate();

  const [status, setStatus] = useState( ""); // По умолчанию пустой статус
  const [dateFormationStart, setDateFormationStart] = useState(""); 
  const [dateFormationEnd, setDateFormationEnd] = useState( ""); 

  const statusOptions = {
    "": "Любой", 
    formed: "Сформирована",
    completed: "Завершена",
    rejected: "Отклонена",
  };

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate("/403/");
//     }
//   }, [isAuthenticated, navigate]);

  // Эффект для загрузки данных самозанятых при изменении фильтров
  useEffect(() => {
    // Обновляем фильтры в хранилище
    const updatedFilters: T_CarOrderFilters = {
      status: status || "", 
      date_from: dateFormationStart || "", 
      date_to: dateFormationEnd || "", 
    };
    
    dispatch(updateFilters(updatedFilters)); // Обновляем фильтры в состоянии
    dispatch(fetchCarOrders()); // Загружаем данные с примененными фильтрами
  }, [status, dateFormationStart, dateFormationEnd, dispatch]);

  return (
    <main id="main" className="page">
      <div className="page__services _container">
        <Container>
          <Form>
            <Row className="mb-4 d-flex align-items-center">
              <Col md="2" className="d-flex flex-row gap-3 align-items-center">
                <label>От</label>
                <Input
                  type="date"
                  value={dateFormationStart}
                  onChange={(e) => setDateFormationStart(e.target.value)} // Обновляем дату начала
                />
              </Col>
              <Col md="2" className="d-flex flex-row gap-3 align-items-center">
                <label>До</label>
                <Input
                  type="date"
                  value={dateFormationEnd}
                  onChange={(e) => setDateFormationEnd(e.target.value)} // Обновляем дату окончания
                />
              </Col>
              <Col md="3">
                <CustomDropdown
                  label="Статус"
                  selectedItem={status}
                  setSelectedItem={setStatus} // Обновляем статус
                  options={statusOptions}
                />
              </Col>
            </Row>
          </Form>

          {car_orders.length ? (
            <Table car_orders={car_orders} />
          ) : (
            <h3 className="text-center mt-5">Самозанятые не найдены</h3>
          )}
        </Container>
      </div>
    </main>
  );
};

export default SelfEmployedPage;
