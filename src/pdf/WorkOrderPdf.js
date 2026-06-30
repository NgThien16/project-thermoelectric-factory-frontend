import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { arialBase64 } from "./fonts/Arial";
import { getRoleLabel } from "../utils/workOrderRoles";

const FONT_NAME = "Arial";
const MARGIN = 12;

const formatDate = (d) => (d ? new Date(d).toLocaleString("vi-VN") : "—");

const registerFont = (doc) => {
    doc.addFileToVFS("Arial.ttf", arialBase64);
    doc.addFont("Arial.ttf", FONT_NAME, "normal");
    doc.addFont("Arial.ttf", FONT_NAME, "bold");
    doc.setFont(FONT_NAME, "normal");
};

const sectionTitle = (doc, text, y, pageWidth) => {
    doc.setFillColor(33, 37, 41);
    doc.rect(MARGIN, y - 4.5, pageWidth - MARGIN * 2, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont(FONT_NAME, "bold");
    doc.setFontSize(10.5);
    doc.text(text, MARGIN + 2, y);
    doc.setTextColor(0, 0, 0);
};

const addFooter = (doc) => {
    const pageCount = doc.internal.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont(FONT_NAME, "normal");
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.line(MARGIN, pageHeight - 12, pageWidth - MARGIN, pageHeight - 12);
        doc.text("Nội bộ - Nhà máy nhiệt điện", MARGIN, pageHeight - 7);
        doc.text(`Trang ${i}/${pageCount}`, pageWidth - MARGIN - 18, pageHeight - 7);
        doc.setTextColor(0, 0, 0);
    }
};

export const exportWorkOrderPdf = (detail, workOrderId) => {
    if (!detail) return;

    const doc = new jsPDF("p", "mm", "a4");
    registerFont(doc);

    const pageWidth = doc.internal.pageSize.getWidth();
    const tableWidth = pageWidth - MARGIN * 2;
    let y = 16;

    // ===== HEADER =====
    doc.setFontSize(15);
    doc.setFont(FONT_NAME, "bold");
    doc.text("PHIẾU CÔNG TÁC", pageWidth / 2, y, { align: "center" });
    y += 7;
    doc.setDrawColor(33, 37, 41);
    doc.setLineWidth(0.6);
    doc.line(MARGIN, y, pageWidth - MARGIN, y);
    y += 6;

    // ===== INFO BAR (bảng gọn 2 cột) =====
    autoTable(doc, {
        startY: y,
        body: [
            ["Mã phiếu", detail.code || "", "Trạng thái", detail.status || ""],
            ["Trạng thái VT", detail.materialStatus || "", "Bắt đầu", formatDate(detail.startDate)],
            ["Kết thúc", formatDate(detail.endDate), "", ""]
        ],
        theme: "plain",
        styles: { font: FONT_NAME, fontSize: 9, cellPadding: 1 },
        columnStyles: {
            0: { fontStyle: "bold", cellWidth: 30 },
            1: { cellWidth: tableWidth / 2 - 30 },
            2: { fontStyle: "bold", cellWidth: 30 },
            3: { cellWidth: tableWidth / 2 - 30 }
        },
        margin: { left: MARGIN, right: MARGIN }
    });
    y = doc.lastAutoTable.finalY + 5;

    // ===== I. NGƯỜI LẬP + III. THIẾT BỊ (2 cột song song để tiết kiệm không gian) =====
    sectionTitle(doc, "I. THÔNG TIN NGƯỜI LẬP", y, pageWidth);
    y += 6;
    autoTable(doc, {
        startY: y,
        body: [
            ["Người lập", detail.createdBy || ""],
            ["Phòng ban", detail.createdDepartment || ""],
            ["Chức vụ", detail.createdPosition || ""]
        ],
        theme: "plain",
        styles: { font: FONT_NAME, fontSize: 9, cellPadding: 1 },
        columnStyles: { 0: { fontStyle: "bold", cellWidth: 30 } },
        margin: { left: MARGIN, right: MARGIN }
    });
    y = doc.lastAutoTable.finalY + 5;

    // ===== II. YÊU CẦU SỬA CHỮA =====
    sectionTitle(doc, "II. YÊU CẦU SỬA CHỮA", y, pageWidth);
    y += 6;
    doc.setFont(FONT_NAME, "bold");
    doc.setFontSize(9);
    doc.text("Tiêu đề:", MARGIN, y);
    doc.setFont(FONT_NAME, "normal");
    doc.text(detail.repairTitle || "", MARGIN + 18, y);
    y += 5;

    doc.setFont(FONT_NAME, "bold");
    doc.text("Mô tả:", MARGIN, y);
    doc.setFont(FONT_NAME, "normal");
    const descLines = doc.splitTextToSize(detail.repairDescription || "", tableWidth - 18);
    doc.text(descLines, MARGIN + 18, y);
    y += descLines.length * 4.5 + 4;

    // ===== III. THÔNG TIN THIẾT BỊ =====
    sectionTitle(doc, "III. THÔNG TIN THIẾT BỊ", y, pageWidth);
    y += 6;
    autoTable(doc, {
        startY: y,
        body: [
            ["Tên thiết bị", detail.equipmentName || "", "Mã thiết bị", detail.equipmentCode || ""],
            ["Hệ thống", detail.systemName || "", "", ""]
        ],
        theme: "plain",
        styles: { font: FONT_NAME, fontSize: 9, cellPadding: 1 },
        columnStyles: {
            0: { fontStyle: "bold", cellWidth: 30 },
            1: { cellWidth: tableWidth / 2 - 30 },
            2: { fontStyle: "bold", cellWidth: 30 },
            3: { cellWidth: tableWidth / 2 - 30 }
        },
        margin: { left: MARGIN, right: MARGIN }
    });
    y = doc.lastAutoTable.finalY + 5;

    // ===== IV. PHÂN CÔNG NHÂN SỰ =====
    sectionTitle(doc, "IV. PHÂN CÔNG NHÂN SỰ", y, pageWidth);
    y += 5;
    autoTable(doc, {
        startY: y,
        head: [["STT", "Họ tên", "Vai trò"]],
        body: (detail.assignments || []).map((a, i) => [i + 1, a.employeeName || "", getRoleLabel(a.role)]),
        theme: "grid",
        styles: { font: FONT_NAME, fontStyle: "normal", fontSize: 8.5, cellPadding: 1.5 },
        headStyles: { font: FONT_NAME, fontStyle: "bold", fillColor: [220, 220, 220], textColor: 0, fontSize: 8.5 },
        columnStyles: { 0: { cellWidth: 12, halign: "center" } },
        margin: { left: MARGIN, right: MARGIN }
    });
    y = doc.lastAutoTable.finalY + 5;

    // ===== V. VẬT TƯ TIÊU HAO + VI. PHỤ TÙNG (gộp gần nhau, bảng nhỏ hơn) =====
    sectionTitle(doc, "V. VẬT TƯ TIÊU HAO", y, pageWidth);
    y += 5;
    autoTable(doc, {
        startY: y,
        head: [["STT", "Mã VT", "Tên vật tư", "ĐVT", "SL"]],
        body: (detail.consumables || []).map((c, i) => [i + 1, c.code || "", c.name || "", c.unit || "", c.quantity ?? ""]),
        theme: "grid",
        styles: { font: FONT_NAME, fontStyle: "normal", fontSize: 8.5, cellPadding: 1.5 },
        headStyles: { font: FONT_NAME, fontStyle: "bold", fillColor: [220, 220, 220], textColor: 0, fontSize: 8.5 },
        columnStyles: { 0: { cellWidth: 12, halign: "center" }, 3: { cellWidth: 18, halign: "center" }, 4: { cellWidth: 16, halign: "center" } },
        margin: { left: MARGIN, right: MARGIN }
    });
    y = doc.lastAutoTable.finalY + 5;

    sectionTitle(doc, "VI. PHỤ TÙNG THAY THẾ", y, pageWidth);
    y += 5;
    autoTable(doc, {
        startY: y,
        head: [["STT", "Mã PT", "Tên phụ tùng", "ĐVT", "SL"]],
        body: (detail.replacements || []).map((r, i) => [i + 1, r.code || "", r.name || "", r.unit || "", r.quantity ?? ""]),
        theme: "grid",
        styles: { font: FONT_NAME, fontStyle: "normal", fontSize: 8.5, cellPadding: 1.5 },
        headStyles: { font: FONT_NAME, fontStyle: "bold", fillColor: [220, 220, 220], textColor: 0, fontSize: 8.5 },
        columnStyles: { 0: { cellWidth: 12, halign: "center" }, 3: { cellWidth: 18, halign: "center" }, 4: { cellWidth: 16, halign: "center" } },
        margin: { left: MARGIN, right: MARGIN }
    });
    y = doc.lastAutoTable.finalY + 10;

    // ===== KÝ TÊN =====
    const pageHeight = doc.internal.pageSize.getHeight();
    if (y > pageHeight - 35) {
        doc.addPage();
        y = 20;
    }
    doc.setFont(FONT_NAME, "normal");
    doc.setFontSize(9);
    doc.text("Người lập phiếu", pageWidth - 55, y, { align: "center" });
    doc.text("(Ký và ghi rõ họ tên)", pageWidth - 55, y + 5, { align: "center" });
    doc.setFont(FONT_NAME, "bold");
    doc.text(detail.createdBy || "", pageWidth - 55, y + 16, { align: "center" });

    addFooter(doc);

    doc.save(`PhieuCongTac_${detail.code || workOrderId}.pdf`);
};