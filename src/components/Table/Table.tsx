import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import CustomTable from "../CustomTable";
import { T_CarOrder } from "../../utils/types";
import { formatDate } from "../../utils/utils";
import './Table.css'

interface CarOrdersTableProps {
  car_orders: T_CarOrder[];
}

const Table: React.FC<CarOrdersTableProps> = ({ car_orders }) => {
  const navigate = useNavigate();

  console.log('cccc', car_orders)


  const handleClick = (car_order_id: number): void => {
    navigate(`/car_order/${car_order_id}`);
  };

  const statuses: Record<string, string> = {
    draft: "Черновик",
    pending: 'В работе',
    shipped: 'Сформирован',
    delivered: 'Доставлен',
    cancelled: 'Отклонён',
  };
  

  const columns = useMemo(
    () => [
      {
        Header: "№",
        accessor: "id", // используем id как уникальный идентификатор
      },
      {
        Header: "Пользователь",
        accessor: "creator", // используем id как уникальный идентификатор
      },
      {
        Header: "Статус",
        accessor: "status", // статус
        Cell: ({ value }: { value: string }) => statuses[value] || value, // преобразование статуса
      },
      {
        Header: "Дата завершения",
        accessor: "ship_date", // поле для даты завершения
        Cell: ({ value }: { value: string }) => value ? formatDate(value) : "--",
      },
      {
        Header: "Стоимость",
        accessor: "total_cost", // поле для даты завершения
        Cell: ({ value }: { value: string }) => value ? value :"--",
      },
    ],
    []
  );

  return (
    <div className="table-container">
      <CustomTable
        columns={columns}
        data={car_orders}
        onClick={handleClick} // Передача функции клика
        className="custom-table"
      />
    </div>
  );
};

export default Table;
