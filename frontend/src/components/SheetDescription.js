import React from 'react'
import Form from "react-bootstrap/Form";

function SheetDescription({title}) {
    return (
        <Form>
            <Form.Group className="mb-3" controlId="textArea">
                <Form.Label>{title}</Form.Label>
                <Form.Control as="textarea" rows={3} />
            </Form.Group>
        </Form>
    );
}

export default SheetDescription