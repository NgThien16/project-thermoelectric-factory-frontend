import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { arialBase64 } from "./fonts/Arial";

const FONT_NAME = "Arial";

export const exportTechnicalReportPdf = (report) => {
    const doc = new jsPDF();

    // ======================
    // FONT REGISTER (IMPORTANT)
    // ======================
    doc.addFileToVFS("Arial.ttf", arialBase64);
    doc.addFont("Arial.ttf", FONT_NAME, "normal");
    doc.addFont("Arial.ttf", FONT_NAME, "bold"); // FIX: thêm bold giả lập

    doc.setFont(FONT_NAME);

    // ======================
    // PARSE DATA
    // ======================
    let content = {};
    try {
        content = report?.content ? JSON.parse(report.content) : {};
    } catch {
        content = {};
    }

    const equipmentReports = content.equipmentReports || [];

    // ======================
    // HEADER
    // ======================
    doc.setFontSize(14);
    doc.setFont(FONT_NAME, "normal");
    doc.text("NHÀ MÁY NHIỆT ĐIỆN", 14, 15);

    doc.setFontSize(12);
    doc.text("BIÊN BẢN ĐÁNH GIÁ KỸ THUẬT", 14, 22);
    doc.line(14, 25, 196, 25);

    // ======================
    // INFO
    // ======================
    doc.setFontSize(10);
    doc.setFont(FONT_NAME, "normal");

    doc.text(`Mã biên bản: ${report?.id || "-"}`, 14, 35);
    doc.text(`Work Order: ${report?.workOrder?.id || "-"}`, 14, 41);

    doc.text(
        `Thời gian: ${
            report?.createdAt
                ? new Date(report.createdAt).toLocaleString()
                : "-"
        }`,
        14,
        47
    );

    // ======================
    // CONCLUSION
    // ======================
    doc.setFontSize(12);
    doc.text("1. KẾT LUẬN", 14, 60);

    doc.setFontSize(10);
    const conclusion = content.conclusion || "-";

    doc.text(conclusion, 14, 68, { maxWidth: 180 });

    // ======================
    // EQUIPMENT SECTION
    // ======================
    let y = 90;

    doc.setFontSize(12);
    doc.text("2. DANH SÁCH THIẾT BỊ", 14, y);
    y += 6;

    equipmentReports.forEach((eq, index) => {
        doc.setFontSize(11);
        doc.text(`2.${index + 1} Thiết bị`, 14, y);
        y += 4;

        autoTable(doc, {
            startY: y,

            head: [["HẠNG MỤC", "NỘI DUNG"]],
            body: [
                ["ID Thiết bị", eq.equipmentId || "-"],
                ["Tên thiết bị", eq.equipmentName || "-"],
                ["Mô tả hư hỏng", eq.damageDescription || "-"],
                ["Đánh giá kỹ thuật", eq.assessment || "-"],
                ["Phương án xử lý", eq.proposedSolution || "-"],
            ],

            styles: {
                font: FONT_NAME,
                fontStyle: "normal",
                fontSize: 10,
                cellPadding: 2,
                overflow: "linebreak",
            },

            headStyles: {
                font: FONT_NAME,
                fontStyle: "normal", // FIX quan trọng
                fillColor: [230, 230, 230],
                textColor: 0,
            },

            bodyStyles: {
                font: FONT_NAME,
                fontStyle: "normal",
            },

            didParseCell: (data) => {
                data.cell.styles.font = FONT_NAME;
                data.cell.styles.fontStyle = "normal";
            },
        });

        y = doc.lastAutoTable.finalY + 8;

        if (y > 260) {
            doc.addPage();
            y = 20;
        }
    });

    // ======================
    // FOOTER
    // ======================
    const pageCount = doc.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setFont(FONT_NAME);

        doc.line(14, 275, 196, 275);
        doc.text("Nội bộ - Nhà máy nhiệt điện", 14, 282);
        doc.text(`Trang ${i} / ${pageCount}`, 170, 282);
    }

    doc.save(`technical-report-${report?.id || "file"}.pdf`);
};