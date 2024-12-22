import { useTable } from "react-table";
import "./CustomTable.css";

function CustomTable({ columns, data, onClick }) {
  const { headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const onTdClicked = (row, e) => {
    if (e.target.tagName !== "BUTTON") {
      onClick(row.values.id);
    }
  };

  return (
    <div>
      {/* Отображение заголовков */}
      <div className="table__header">
        {headerGroups.map((headerGroup) => (
          <div
            className="table__header-row"
            {...headerGroup.getHeaderGroupProps()}
            key={headerGroup.getHeaderGroupProps().key}
          >
            {headerGroup.headers.map((column) => (
              <div
                className="table__header-cell"
                {...column.getHeaderProps()}
                key={column.getHeaderProps().key}
              >
                {column.render("Header")}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Карточки */}
      <div className="table__cards">
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <div
              className="table__row"
              {...row.getRowProps()}
              key={row.getRowProps().key}
              onClick={(e) => onTdClicked(row, e)}
              style={{ cursor: "pointer" }}
            >
              {/* Визуальная структура карточки */}
              {row.cells.map((cell) => (
                <div
                  className="table__card-cell"
                  {...cell.getCellProps()}
                  key={cell.getCellProps().key}
                >
                  {/* Если это колонка ID, показываем индекс, иначе контент */}
                  {cell.column.id === "id" ? i + 1 : cell.render("Cell")}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CustomTable;
