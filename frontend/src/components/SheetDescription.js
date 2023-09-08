import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";

function SheetDescription({ title, content }) {
    const [description, setDescription] = useState(()=>content);
    useEffect(() => {
        setDescription(content);
    }, [content]);
    return (
        <Form>
            <Form.Group className="mb-3" controlId="textArea">
                <Form.Label>{title}</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Form.Group>
        </Form>
    );
}

export default SheetDescription;
