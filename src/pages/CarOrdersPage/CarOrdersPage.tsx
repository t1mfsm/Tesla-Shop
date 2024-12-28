import { useEffect, useState } from "react";
import { Col, Container, Form, Input, Row, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import CustomDropdown from "../../components/CustomDropdown/CustomDropdown";
import { T_CarOrderFilters } from "../../utils/types";
import Table from "../../components/Table";
import { fetchCarOrders, updateFilters, updateByModeratorHandler } from "../../slices/carOrder";
import "./CarOrdersPage.css"

const statuses: Record<string, string> = {
  draft: "Черновик",
  pending: 'В работе',
  shipped: 'Сформирован',
  delivered: 'Доставлен',
  cancelled: 'Отклонён',
};

const CarOrdersPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const userEmail = useAppSelector((state) => state.user?.email);

  const car_orders = useAppSelector((state) => state.carOrder.car_orders);
  const filters = useAppSelector<T_CarOrderFilters>((state) => state.carOrder.filters);

  const [status, setStatus] = useState("");
  const [dateFormationStart, setDateFormationStart] = useState(""); 
  const [dateFormationEnd, setDateFormationEnd] = useState(""); 
  const [email, setEmail] = useState(""); 

  const statusOptions = {
    "": "Любой", 
    shipped: "Сформирован",
    delivered: "Доставлен",
    cancelled: "Отклонён",
  };

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchCarOrders());
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    const updatedFilters: T_CarOrderFilters = {
      status: status || "", 
      date_from: dateFormationStart || "", 
      date_to: dateFormationEnd || "", 
    };
    
    dispatch(updateFilters(updatedFilters));
    dispatch(fetchCarOrders());
  }, [status, dateFormationStart, dateFormationEnd, dispatch]);

  const filteredCarOrders = car_orders.filter((item) =>
    item.creator.toLowerCase().includes(email.toLowerCase())
  );

  const handleModeratorAction = async (orderId: string, action: string) => {
    await dispatch(updateByModeratorHandler({ id: orderId, status: action }));
    dispatch(fetchCarOrders());
  };

  return (
    <main id="main" className="page">
      <div className="page__services _container">
        <Container>
          <Form>
            <Row className="mb-2 d-flex align-items-center justify-content-center" style={{ paddingTop: "10px" }}>
              <Col md="3" className="d-flex flex-row gap-3 align-items-center">
                <label>От</label>
                <Input
                  type="date"
                  value={dateFormationStart}
                  onChange={(e) => setDateFormationStart(e.target.value)} // Обновляем дату начала
                />
              </Col>
              <Col md="3" className="d-flex flex-row gap-3 align-items-center">
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
              {userEmail === "tim@mail.ru" && (
                <Col md="3">
                  <Input
                    type="text"
                    placeholder="Имя пользователя"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </Col>
              )}
            </Row>
          </Form>

          <div className="table-actions-wrapper">
            <Row className="d-flex align-items-start">
              <Col md="9">
                {filteredCarOrders.length ? (
                  <Table car_orders={filteredCarOrders} />
                ) : (
                  <h3 className="text-center mt-5">Заказы не найдены</h3>
                )}
              </Col>
              {userEmail === "tim@mail.ru" && (
                <Col md="3">
                  <div className="order-actions">
                    {filteredCarOrders.map((order) => (
                      <Row key={order.id}>
                        <Col md="6">
                          <Button
                            className="complete-order-btn"
                            onClick={() => handleModeratorAction(order.id, "delivered")}
                            disabled={order.status === 'delivered' || order.status === 'cancelled'}
                          >
                            Завершить
                          </Button>
                        </Col>
                        <Col md="6">
                          <Button
                            className="cancel-order-btn"
                            onClick={() => handleModeratorAction(order.id, "cancelled")}
                            disabled={order.status === 'delivered' || order.status === 'cancelled'}
                          >
                            Отклонить
                          </Button>
                        </Col>
                      </Row>
                    ))}
                  </div>
                </Col>
              )}
            </Row>
          </div>
        </Container>
      </div>
    </main>
  );
};

export default CarOrdersPage;
