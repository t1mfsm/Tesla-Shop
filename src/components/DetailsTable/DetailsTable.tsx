import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { T_Detail } from "../../utils/types";
import TableDetails from "../TableDetails";




interface DetailsTableProps {
  details: T_Detail[];
}

const DetailsTable: React.FC<DetailsTableProps> = ({ details }) => {
  const navigate = useNavigate();

  const handleClick = (detail_id: number): void => {
    navigate(`/edit-detail/${detail_id}`);
  };

  const statuses: Record<string, string> = {
    active: "Активна",
    deleted: "Удалена",
  };

  const columns = useMemo(
    () => [
      {
        Header: "№",
        accessor: "id", // используем id как уникальный идентификатор
      },
      {
        Header: "Заголовок",
        accessor: "name", 
        Cell: ({ value }: { value: string }) => value ? value : "--", 
      },
      {
        Header: "Описание",
        accessor: "model_info", 
        Cell: ({ value }: { value: string }) => value ? value : "--",
      },
      {
        Header: "Изображение",
        accessor: "image", 
        Cell: ({ value }: { value: string }) => value ? value : "--",
      },
      // {
      //   Header: "Бренд",
      //   accessor: "brand",
      //   Cell: ({ value }: { value: string }) => value ? value : "--",
      // },
      {
        Header: "Цена",
        accessor: "price",
        Cell: ({ value }: { value: string }) => value ? value : "--",
      },
      // {
      //   Header: "Статус",
      //   accessor: "status", 
      //   Cell: ({ value }: { value: string }) => statuses[value] || value,
      // }
    ],
    []
  );

  return <TableDetails columns={columns} data={details} onClick={handleClick} />;
};

export default DetailsTable;
