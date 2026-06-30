import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { arialBase64 } from "./fonts/Arial";

const FONT_NAME = "Arial";
const MARGIN = 12;

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

export const exportTechnicalReportPdf = (report) => {
    const doc = new jsPDF("p", "mm", "a4");
    registerFont(doc);

    const pageWidth = doc.internal.pageSize.getWidth();
    const tableWidth = pageWidth - MARGIN * 2;
    let y = 16;

    let content = {};
    try {
        content = report?.content ? JSON.parse(report.content) : {};
    } catch {
        content = {};
    }
    const equipmentReports = content.equipmentReports || [];

    // ===== HEADER =====
    doc.setFontSize(13);
    doc.setFont(FONT_NAME, "bold");
    doc.text("NHÀ MÁY NHIỆT ĐIỆN", pageWidth / 2, y, { align: "center" });
    y += 6;
    doc.setFontSize(11);
    doc.text("BIÊN BẢN ĐÁNH GIÁ KỸ THUẬT", pageWidth / 2, y, { align: "center" });
    y += 5;
    doc.setDrawColor(33, 37, 41);
    doc.setLineWidth(0.6);
    doc.line(MARGIN, y, pageWidth - MARGIN, y);
    y += 6;

    // ===== INFO =====
    autoTable(doc, {
        startY: y,
        body: [
            ["Mã biên bản", report?.id || "-", "Work Order", report?.workOrder?.id || "-"],
            ["Thời gian", report?.createdAt ? new Date(report.createdAt).toLocaleString("vi-VN") : "-", "", ""]
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
    y = doc.lastAutoTable.finalY + 6;

    // ===== 1. KẾT LUẬN =====
    sectionTitle(doc, "1. KẾT LUẬN", y, pageWidth);
    y += 6;
    doc.setFont(FONT_NAME, "normal");
    doc.setFontSize(9);
    const conclusionLines = doc.splitTextToSize(content.conclusion || "-", tableWidth);
    doc.text(conclusionLines, MARGIN, y);
    y += conclusionLines.length * 4.5 + 6;

    // ===== 2. DANH SÁCH THIẾT BỊ =====
    sectionTitle(doc, "2. DANH SÁCH THIẾT BỊ", y, pageWidth);
    y += 5;

    equipmentReports.forEach((eq, index) => {
        doc.setFont(FONT_NAME, "bold");
        doc.setFontSize(9.5);
        doc.text(`2.${index + 1}. ${eq.equipmentName || "Thiết bị"}`, MARGIN, y);
        y += 4;

        autoTable(doc, {
            startY: y,
            head: [["HẠNG MỤC", "NỘI DUNG"]],
            body: [
                ["ID Thiết bị", eq.equipmentId || "-"],
                ["Tên thiết bị", eq.equipmentName || "-"],
                ["Mô tả hư hỏng", eq.damageDescription || "-"],
                ["Đánh giá kỹ thuật", eq.assessment || "-"],
                ["Phương án xử lý", eq.proposedSolution || "-"]
            ],
            theme: "grid",
            styles: { font: FONT_NAME, fontStyle: "normal", fontSize: 8.5, cellPadding: 1.8, overflow: "linebreak" },
            headStyles: { font: FONT_NAME, fontStyle: "bold", fillColor: [220, 220, 220], textColor: 0, fontSize: 8.5 },
            columnStyles: { 0: { cellWidth: 42, fontStyle: "bold" } },
            margin: { left: MARGIN, right: MARGIN }
        });

        y = doc.lastAutoTable.finalY + 7;

        const pageHeight = doc.internal.pageSize.getHeight();
        if (y > pageHeight - 30 && index < equipmentReports.length - 1) {
            doc.addPage();
            y = 18;
        }
    });

    addFooter(doc);

    doc.save(`technical-report-${report?.id || "file"}.pdf`);
};