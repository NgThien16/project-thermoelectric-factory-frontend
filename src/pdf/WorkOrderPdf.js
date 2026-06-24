import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { arialBase64 } from "./fonts/Arial";
import { getRoleLabel } from "../utils/workOrderRoles";

const FONT_NAME = "Arial";

const formatDate = (d) => (d ? new Date(d).toLocaleString("vi-VN") : "—");

export const exportWorkOrderPdf = (detail, workOrderId) => {
    if (!detail) return;

    const doc = new jsPDF("p", "mm", "a4");

    // ======================
    // FONT REGISTER (IMPORTANT)
    // ======================
    doc.addFileToVFS("Arial.ttf", arialBase64);
    doc.addFont("Arial.ttf", FONT_NAME, "normal");
    doc.addFont("Arial.ttf", FONT_NAME, "bold");

    doc.setFont(FONT_NAME, "normal");

    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 15;

    // ======================
    // HEADER
    // ======================
    doc.setFontSize(16);
    doc.setFont(FONT_NAME, "bold");
    doc.text("PHIẾU CÔNG TÁC", pageWidth / 2, y, { align: "center" });
    y += 10;

    doc.setFontSize(10);
    doc.setFont(FONT_NAME, "normal");

    const infoLines = [
        [`Mã phiếu: ${detail.code || ""}`, `Trạng thái: ${detail.status || ""}`],
        [`Trạng thái VT: ${detail.materialStatus || ""}`, `Bắt đầu: ${formatDate(detail.startDate)}`],
        [`Kết thúc: ${formatDate(detail.endDate)}`, ""]
    ];
    infoLines.forEach(row => {
        doc.text(row[0], 14, y);
        doc.text(row[1], pageWidth / 2 + 5, y);
        y += 6;
    });

    // ======================
    // I. THÔNG TIN NGƯỜI LẬP
    // ======================
    y += 4;
    doc.setFont(FONT_NAME, "bold");
    doc.text("I. THÔNG TIN NGƯỜI LẬP", 14, y);
    doc.setFont(FONT_NAME, "normal");
    y += 6;
    doc.text(`Người lập: ${detail.createdBy || ""}`, 14, y); y += 6;
    doc.text(`Phòng ban: ${detail.createdDepartment || ""}`, 14, y); y += 6;
    doc.text(`Chức vụ: ${detail.createdPosition || ""}`, 14, y); y += 8;

    // ======================
    // II. YÊU CẦU SỬA CHỮA
    // ======================
    doc.setFont(FONT_NAME, "bold");
    doc.text("II. YÊU CẦU SỬA CHỮA", 14, y);
    doc.setFont(FONT_NAME, "normal");
    y += 6;
    doc.text(`Tiêu đề: ${detail.repairTitle || ""}`, 14, y); y += 6;

    const descLines = doc.splitTextToSize(`Mô tả: ${detail.repairDescription || ""}`, pageWidth - 28);
    doc.text(descLines, 14, y);
    y += descLines.length * 6 + 4;

    // ======================
    // III. THÔNG TIN THIẾT BỊ
    // ======================
    doc.setFont(FONT_NAME, "bold");
    doc.text("III. THÔNG TIN THIẾT BỊ", 14, y);
    doc.setFont(FONT_NAME, "normal");
    y += 6;
    doc.text(`Tên thiết bị: ${detail.equipmentName || ""}`, 14, y); y += 6;
    doc.text(`Mã thiết bị: ${detail.equipmentCode || ""}`, 14, y); y += 6;
    doc.text(`Hệ thống: ${detail.systemName || ""}`, 14, y); y += 8;

    // ======================
    // IV. PHÂN CÔNG NHÂN SỰ
    // ======================
    doc.setFont(FONT_NAME, "bold");
    doc.text("IV. PHÂN CÔNG NHÂN SỰ", 14, y);
    y += 4;

    autoTable(doc, {
        startY: y,
        head: [["STT", "Họ tên", "Vai trò"]],
        body: (detail.assignments || []).map((a, i) => [
            i + 1,
            a.employeeName || "",
            getRoleLabel(a.role)
        ]),
        theme: "grid",
        styles: { font: FONT_NAME, fontStyle: "normal", fontSize: 9 },
        headStyles: { font: FONT_NAME, fontStyle: "bold", fillColor: [230, 230, 230], textColor: 0 },
        bodyStyles: { font: FONT_NAME, fontStyle: "normal" },
        didParseCell: (data) => {
            data.cell.styles.font = FONT_NAME;
        },
        margin: { left: 14, right: 14 }
    });
    y = doc.lastAutoTable.finalY + 8;

    // ======================
    // V. VẬT TƯ TIÊU HAO
    // ======================
    doc.setFont(FONT_NAME, "bold");
    doc.text("V. VẬT TƯ TIÊU HAO", 14, y);
    y += 4;

    autoTable(doc, {
        startY: y,
        head: [["STT", "Mã VT", "Tên vật tư", "ĐVT", "SL"]],
        body: (detail.consumables || []).map((c, i) => [
            i + 1, c.code || "", c.name || "", c.unit || "", c.quantity ?? ""
        ]),
        theme: "grid",
        styles: { font: FONT_NAME, fontStyle: "normal", fontSize: 9 },
        headStyles: { font: FONT_NAME, fontStyle: "bold", fillColor: [230, 230, 230], textColor: 0 },
        bodyStyles: { font: FONT_NAME, fontStyle: "normal" },
        didParseCell: (data) => {
            data.cell.styles.font = FONT_NAME;
        },
        margin: { left: 14, right: 14 }
    });
    y = doc.lastAutoTable.finalY + 8;

    // ======================
    // VI. PHỤ TÙNG THAY THẾ
    // ======================
    doc.setFont(FONT_NAME, "bold");
    doc.text("VI. PHỤ TÙNG THAY THẾ", 14, y);
    y += 4;

    autoTable(doc, {
        startY: y,
        head: [["STT", "Mã PT", "Tên phụ tùng", "ĐVT", "SL"]],
        body: (detail.replacements || []).map((r, i) => [
            i + 1, r.code || "", r.name || "", r.unit || "", r.quantity ?? ""
        ]),
        theme: "grid",
        styles: { font: FONT_NAME, fontStyle: "normal", fontSize: 9 },
        headStyles: { font: FONT_NAME, fontStyle: "bold", fillColor: [230, 230, 230], textColor: 0 },
        bodyStyles: { font: FONT_NAME, fontStyle: "normal" },
        didParseCell: (data) => {
            data.cell.styles.font = FONT_NAME;
        },
        margin: { left: 14, right: 14 }
    });
    y = doc.lastAutoTable.finalY + 20;

    // ======================
    // FOOTER - KÝ TÊN
    // ======================
    if (y > doc.internal.pageSize.getHeight() - 30) {
        doc.addPage();
        y = 20;
    }

    doc.setFont(FONT_NAME, "normal");
    doc.text("Người lập phiếu", pageWidth - 60, y);
    y += 6;
    doc.text("(Ký và ghi rõ họ tên)", pageWidth - 60, y);
    y += 14;
    doc.setFont(FONT_NAME, "bold");
    doc.text(detail.createdBy || "", pageWidth - 60, y);

    doc.save(`PhieuCongTac_${detail.code || workOrderId}.pdf`);
};