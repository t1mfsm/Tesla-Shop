import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import CustomTable from "../CustomTable";
import { T_CarOrder } from "../../utils/types";
import { formatDate } from "../../utils/utils";


interface CarOrdersTableProps {
  car_orders: T_CarOrder[];
}

const Table: React.FC<CarOrdersTableProps> = ({ car_orders }) => {
  const navigate = useNavigate();


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
        Header: "Статус",
        accessor: "status", // статус
        Cell: ({ value }: { value: string }) => statuses[value] || value, // преобразование статуса
      },
      {
        Header: "Дата создания",
        accessor: "creation_date", // поле для даты создания
        Cell: ({ value }: { value: string }) => formatDate(value), // форматируем дату
      },
      {
        Header: "Дата завершения",
        accessor: "ship_date", // поле для даты завершения
        Cell: ({ value }: { value: string }) => value ? formatDate(value) : "--",
      },
    ],
    []
  );

  return <CustomTable columns={columns} data={car_orders} onClick={handleClick} />;
};

export default Table;
