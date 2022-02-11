const Field = ({value, col, row, startField, endField, handleClick}) => {
    const isStartField = startField && startField.col === col && startField.row === row;
    const isEndField = endField && endField.col === col && endField.row === row;
    const classes = `field ${isStartField ? 'field--start' : ''} ${isEndField ? 'field--end' : ''}`;
    return (
        <div className={classes } onClick={() => handleClick(row, col, value)}>
            {value}
        </div>
    )
}

const Row = ({fields, handleClick, row, startField, endField}) => {
    return(
        <div className={'row'}>
            { fields.map((fieldValue, col) => <Field
                key={col}
                row={row}
                col={col}
                startField={startField}
                endField={endField}
                value={fieldValue}
                handleClick={handleClick}
            />)}
        </div>
    )
}

const Grid = ({rows, handleClick, startField, endField}) => {
    return (
        <div className="grid">
            {rows.map((row, key) => <Row
                handleClick={handleClick}
                key={key}
                row={key}
                fields={row}
                startField={startField}
                endField={endField}
            ></Row>)}
        </div>
    );
}

export default Grid;
