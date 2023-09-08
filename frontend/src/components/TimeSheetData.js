import React, { useState, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";

function TimeSheetData({ data }) {
    const [description, setDescription] = useState(() => data.description);
    const [rate, setRate] = useState(() => Number(data.rate));
    const [totalTime, setTotalTime] = useState(() => data.totalTime);
    useEffect(() => {
        setDescription(data.description);
        setRate(Number(data.rate));
        setTotalTime(data.totalTime);
    }, [data]);
    return (
        <Form>
            <Form.Group className="mb-3" controlId="textArea">
                <Form.Label>Description:</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Form.Group>
            <Form.Label>Rate:</Form.Label>
            <InputGroup className="mb-3">
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                    aria-label="Rate (to the nearest dollar)"
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    min={0}
                    max={10000}
                />
                <InputGroup.Text>.00</InputGroup.Text>
            </InputGroup>
            <Form.Group className="mb-3" controlId="totalHours">
                <Form.Label>Total Hours:</Form.Label>
                <Form.Control type="number" value={totalTime} readOnly />
            </Form.Group>
            <Form.Group className="mb-3" controlId="totalHours">
                <Form.Label>Total Cost:</Form.Label>
                <Form.Control type="number" value={totalTime * rate} readOnly />
            </Form.Group>
        </Form>
    );
}

export default TimeSheetData;
