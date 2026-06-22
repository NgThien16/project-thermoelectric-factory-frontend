import { Card, Col, Row } from "react-bootstrap";

export default function ListSummaryCards({
    total = 0,
    currentPage = 1,
    totalPages = 1,
    totalLabel = "Tổng danh mục"
}) {
    return (
        <Row className="list-summary-row g-3 mb-4">
            <Col md={4}>
                <Card className="list-summary-card">
                    <Card.Body>
                        <small>{totalLabel}</small>
                        <h3 className="text-primary">{total}</h3>
                    </Card.Body>
                </Card>
            </Col>

            <Col md={4}>
                <Card className="list-summary-card">
                    <Card.Body>
                        <small>Trang hiện tại</small>
                        <h3 className="text-success">{currentPage}</h3>
                    </Card.Body>
                </Card>
            </Col>

            <Col md={4}>
                <Card className="list-summary-card">
                    <Card.Body>
                        <small>Tổng số trang</small>
                        <h3 className="text-warning">{totalPages}</h3>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}
