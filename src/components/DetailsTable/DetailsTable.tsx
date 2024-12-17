import { useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { T_Detail } from "../../utils/types";
import TableDetails from "../TableDetails";
import { useAppDispatch, useAppSelector } from "../../store";
import { deleteDetail, fetchDetails } from "../../slices/detailsSlice"; // Ваш экшен для удаления
import "./DetailsTable.css"

interface DetailsTableProps {
  details: T_Detail[];
}

const DetailsTable: React.FC<DetailsTableProps> = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Получаем данные из Redux
  const details = useAppSelector(state => state.details.details); // Убедитесь, что путь правильный
  const [localDetails, setLocalDetails] = useState(details);

  // Обновляем локальное состояние при изменении данных из Redux
  useEffect(() => {
    setLocalDetails(details);
  }, [details]);

  const handleClick = (detail_id: number): void => {
    navigate(`/edit-detail/${detail_id}`);
  };

  const handleDelete = (id: number): void => {
    const detailExists = localDetails.some(detail => detail.id === id);

    if (!detailExists) {
      return;
    }

    // Вызовите экшен для удаления
    dispatch(deleteDetail(id)).then(() => {
      // После успешного удаления перезапрашиваем детали
      dispatch(fetchDetails());
    }).catch((error) => {
      console.error('Ошибка при удалении:', error);
    });
  };

  const columns = useMemo(
    () => [
      {
        Header: "№",
        accessor: "id", 
      },
      {
        Header: "Название",
        accessor: "name", 
        Cell: ({ value }: { value: string }) => value ? value : "--", 
      },
      {
        Header: "Описание модели",
        accessor: "model_info", 
        Cell: ({ value }: { value: string }) => value ? value : "--",
      },
      {
        Header: "Изображение",
        accessor: "image", 
        Cell: ({ value }: { value: string }) => value ? value : "--",
      },
      {
        Header: "Цена",
        accessor: "price",
        Cell: ({ value }: { value: string }) => value ? value : "--",
      },
      {
        Header: "Действия",
        Cell: ({ row }: { row: any }) => {
          const { id } = row.original; 
          return (
            <div className="action-buttons">
              <button 
                onClick={() => navigate(`/edit-detail/${id}`)} 
                className="edit-detail-btn"
              >
                Изменить
              </button>
              <button 
                onClick={() => handleDelete(id)} 
                className="delete-detail-btn"
              >
                Удалить
              </button>
            </div>
          );
        }
      },
    ],
    [localDetails]
  );

  return <TableDetails columns={columns} data={localDetails} onClick={handleClick} />;
};

export default DetailsTable;
