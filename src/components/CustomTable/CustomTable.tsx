import {useTable} from "react-table";
import {Table} from "reactstrap";
import './CustomTable.css'

function CustomTable({ columns, data, onClick }) {
    const {
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data
    })

    const onTdClicked = (row, e) => {
        if (e.target.tagName != "BUTTON") {
            onClick(row.values.id)
        }
    }
    console.log('data', data)

    return (
        <div >
            <div>
            {headerGroups.map(headerGroup => (
                <div className="table__header" {...headerGroup.getHeaderGroupProps()} key={headerGroup.getHeaderGroupProps().key}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()} key={column.getHeaderProps().key}>{column.render('Header')}</th>
                    ))}
                </div>
            ))}
            </div>

            <div className="table__cards">
            {rows.map((row, i) => {
                prepareRow(row)
                return (
                    <div className="table__row" {...row.getRowProps()} key={row.getRowProps().key} onClick={(e) => onTdClicked(row, e)} style={{cursor: "pointer"}}>
                        <div className="table__card item-table">
                        {row.cells.map(cell => {
                            return <div {...cell.getCellProps()} key={cell.getCellProps().key}>
                                {cell.column.id === 'id' ? i + 1 : cell.render('Cell')}
                            </div>
                        })}
                        </div>
                    </div>
                )
            })}
            </div>
        </div>
    )
}

export default CustomTable