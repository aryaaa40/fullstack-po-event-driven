package com.example.SpringEventDriven.service;

import com.example.SpringEventDriven.entity.ApprovalHistory;
import com.example.SpringEventDriven.entity.PurchaseOrder;
import com.example.SpringEventDriven.entity.PurchaseOrderItem;
import com.example.SpringEventDriven.repository.ApprovalHistoryRepository;
import com.example.SpringEventDriven.repository.PurchaseOrderRepository;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.LineSeparator;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class POPdfService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final ApprovalHistoryRepository approvalHistoryRepository;

    private static final DeviceRgb COLOR_BRAND       = new DeviceRgb(0, 83, 219);
    private static final DeviceRgb COLOR_BRAND_LIGHT = new DeviceRgb(238, 244, 255);
    private static final DeviceRgb COLOR_DARK        = new DeviceRgb(42, 52, 57);
    private static final DeviceRgb COLOR_MUTED       = new DeviceRgb(86, 97, 102);
    private static final DeviceRgb COLOR_BORDER      = new DeviceRgb(224, 232, 237);
    private static final DeviceRgb COLOR_ROW_ALT     = new DeviceRgb(248, 250, 252);
    private static final DeviceRgb COLOR_WHITE       = new DeviceRgb(255, 255, 255);

    @Transactional(readOnly = true)
    public byte[] generate(Long poId) {
        PurchaseOrder po = purchaseOrderRepository.findById(poId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Purchase Order not found"));
        List<ApprovalHistory> history = approvalHistoryRepository
                .findByPurchaseOrder_IdOrderByCreatedAtAsc(poId);

        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfFont regular = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            PdfFont bold    = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

            PdfDocument pdfDoc = new PdfDocument(new PdfWriter(baos));
            Document doc = new Document(pdfDoc, PageSize.A4);
            doc.setMargins(48, 48, 48, 48);

            addHeader(doc, po, regular, bold);
            addSectionTitle(doc, "PURCHASE ORDER DETAILS", bold);
            addDetailsGrid(doc, po, regular, bold);

            boolean hasDesc = po.getDescription() != null || po.getJustification() != null || po.getNotes() != null;
            if (hasDesc) {
                addSectionTitle(doc, "DESCRIPTION & JUSTIFICATION", bold);
                addDescriptionSection(doc, po, regular, bold);
            }

            addSectionTitle(doc, "LINE ITEMS", bold);
            if (po.getItems() != null && !po.getItems().isEmpty()) {
                addItemsTable(doc, po, regular, bold);
            } else {
                doc.add(new Paragraph("Total Amount:  " + formatAmount(po.getAmount(), po.getCurrency()))
                        .setFont(bold).setFontSize(11)
                        .setFontColor(COLOR_BRAND).setMarginBottom(12));
            }

            addSectionTitle(doc, "APPROVAL HISTORY", bold);
            if (history.isEmpty()) {
                doc.add(new Paragraph("No approval history recorded.")
                        .setFont(regular).setFontSize(9)
                        .setFontColor(COLOR_MUTED).setMarginBottom(12));
            } else {
                addHistoryTable(doc, history, regular, bold);
            }

            addFooter(doc, regular);
            doc.close();
            return baos.toByteArray();

        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to generate PDF");
        }
    }

    // ── Header ────────────────────────────────────────────────────────────────

    private void addHeader(Document doc, PurchaseOrder po, PdfFont regular, PdfFont bold) throws IOException {
        Table t = new Table(UnitValue.createPercentArray(new float[]{1, 1}))
                .useAllAvailableWidth();

        // Left: company info
        t.addCell(new Cell()
                .add(new Paragraph("PURCHASE ORDER SYSTEM")
                        .setFont(bold).setFontSize(7).setFontColor(COLOR_BRAND).setMarginBottom(3))
                .add(new Paragraph("PT. Your Company Name")
                        .setFont(bold).setFontSize(14).setFontColor(COLOR_DARK).setMarginBottom(2))
                .add(new Paragraph("Internal Procurement Document")
                        .setFont(regular).setFontSize(8).setFontColor(COLOR_MUTED))
                .setBorder(Border.NO_BORDER).setPadding(0));

        // Right: PO number
        String statusLabel = po.getStatus().name().replace("_", " ");
        t.addCell(new Cell()
                .add(new Paragraph("PO #" + String.format("%05d", po.getId()))
                        .setFont(bold).setFontSize(20).setFontColor(COLOR_DARK)
                        .setTextAlignment(TextAlignment.RIGHT).setMarginBottom(2))
                .add(new Paragraph(statusLabel)
                        .setFont(bold).setFontSize(8).setFontColor(COLOR_BRAND)
                        .setTextAlignment(TextAlignment.RIGHT))
                .setBorder(Border.NO_BORDER).setPadding(0));

        doc.add(t);
        doc.add(new LineSeparator(new SolidLine(1f))
                .setStrokeColor(COLOR_BRAND).setMarginTop(10).setMarginBottom(18));
    }

    // ── Section title bar ─────────────────────────────────────────────────────

    private void addSectionTitle(Document doc, String title, PdfFont bold) throws IOException {
        doc.add(new Table(UnitValue.createPercentArray(new float[]{1})).useAllAvailableWidth()
                .setMarginTop(6).setMarginBottom(8)
                .addCell(new Cell()
                        .add(new Paragraph(title).setFont(bold).setFontSize(8).setFontColor(COLOR_BRAND))
                        .setBackgroundColor(COLOR_BRAND_LIGHT)
                        .setBorder(Border.NO_BORDER)
                        .setPaddingTop(6).setPaddingBottom(6).setPaddingLeft(10).setPaddingRight(10)));
    }

    // ── PO detail grid ────────────────────────────────────────────────────────

    private void addDetailsGrid(Document doc, PurchaseOrder po, PdfFont regular, PdfFont bold) throws IOException {
        Table grid = new Table(UnitValue.createPercentArray(new float[]{1, 1}))
                .useAllAvailableWidth().setMarginBottom(4);

        infoCell(grid, "Title",          po.getTitle(), bold, regular, 2);
        infoCell(grid, "Submitted by",   po.getCreatedBy().getUsername(), bold, regular, 1);
        infoCell(grid, "Vendor",         po.getVendor(), bold, regular, 1);
        infoCell(grid, "Department",     po.getDepartment() != null ? po.getDepartment().getName() : "-", bold, regular, 1);
        infoCell(grid, "Category",       po.getCategory() != null ? po.getCategory().name() : "-", bold, regular, 1);
        infoCell(grid, "Priority",       po.getPriority() != null ? po.getPriority().name() : "-", bold, regular, 1);
        infoCell(grid, "Created Date",   formatDate(po.getCreatedAt().toLocalDate()), bold, regular, 1);

        if (po.getRequiredDate() != null)
            infoCell(grid, "Required Date", formatDate(po.getRequiredDate()), bold, regular, 1);
        if (po.getBudgetCode() != null)
            infoCell(grid, "Budget Code", po.getBudgetCode(), bold, regular, 1);
        if (po.getPaymentTerms() != null)
            infoCell(grid, "Payment Terms", po.getPaymentTerms(), bold, regular, 1);
        if (po.getCurrency() != null)
            infoCell(grid, "Currency", po.getCurrency(), bold, regular, 1);
        if (po.getDeliveryAddress() != null)
            infoCell(grid, "Delivery Address", po.getDeliveryAddress(), bold, regular, 2);

        doc.add(grid);
    }

    private void infoCell(Table table, String label, String value, PdfFont bold, PdfFont regular, int colspan) {
        table.addCell(new Cell(1, colspan)
                .add(new Paragraph(label)
                        .setFont(bold).setFontSize(7).setFontColor(COLOR_MUTED).setMarginBottom(1))
                .add(new Paragraph(value != null ? value : "-")
                        .setFont(regular).setFontSize(9).setFontColor(COLOR_DARK))
                .setBorder(Border.NO_BORDER)
                .setBorderBottom(new SolidBorder(COLOR_BORDER, 0.5f))
                .setPaddingTop(4).setPaddingBottom(8));
    }

    // ── Description section ───────────────────────────────────────────────────

    private void addDescriptionSection(Document doc, PurchaseOrder po, PdfFont regular, PdfFont bold) throws IOException {
        Table grid = new Table(UnitValue.createPercentArray(new float[]{1}))
                .useAllAvailableWidth().setMarginBottom(4);
        if (po.getDescription() != null)
            infoCell(grid, "Description", po.getDescription(), bold, regular, 1);
        if (po.getJustification() != null)
            infoCell(grid, "Business Justification", po.getJustification(), bold, regular, 1);
        if (po.getNotes() != null)
            infoCell(grid, "Notes", po.getNotes(), bold, regular, 1);
        doc.add(grid);
    }

    // ── Line items table ──────────────────────────────────────────────────────

    private void addItemsTable(Document doc, PurchaseOrder po, PdfFont regular, PdfFont bold) throws IOException {
        Table table = new Table(UnitValue.createPercentArray(new float[]{0.4f, 4f, 1f, 2f, 2f}))
                .useAllAvailableWidth().setMarginBottom(4);

        for (String h : new String[]{"#", "Item Name", "Qty", "Unit Price", "Subtotal"}) {
            table.addHeaderCell(new Cell()
                    .add(new Paragraph(h).setFont(bold).setFontSize(8).setFontColor(COLOR_WHITE))
                    .setBackgroundColor(COLOR_BRAND).setBorder(Border.NO_BORDER)
                    .setPaddingTop(6).setPaddingBottom(6).setPaddingLeft(6).setPaddingRight(6));
        }

        int no = 1;
        for (PurchaseOrderItem item : po.getItems()) {
            DeviceRgb bg = (no % 2 == 0) ? COLOR_ROW_ALT : COLOR_WHITE;
            tableCell(table, String.valueOf(no),                                    regular, bg, TextAlignment.CENTER);
            tableCell(table, item.getItemName(),                                    regular, bg, TextAlignment.LEFT);
            tableCell(table, String.valueOf(item.getQuantity()),                    regular, bg, TextAlignment.CENTER);
            tableCell(table, formatAmount(item.getUnitPrice(), po.getCurrency()),   regular, bg, TextAlignment.RIGHT);
            tableCell(table, formatAmount(item.getSubtotal(),  po.getCurrency()),   regular, bg, TextAlignment.RIGHT);
            no++;
        }

        // Total row
        table.addCell(new Cell(1, 4)
                .add(new Paragraph("TOTAL").setFont(bold).setFontSize(9)
                        .setFontColor(COLOR_DARK).setTextAlignment(TextAlignment.RIGHT))
                .setBorder(Border.NO_BORDER).setBorderTop(new SolidBorder(COLOR_BRAND, 1f))
                .setPaddingTop(6).setPaddingBottom(6).setPaddingRight(6));
        table.addCell(new Cell()
                .add(new Paragraph(formatAmount(po.getAmount(), po.getCurrency()))
                        .setFont(bold).setFontSize(9).setFontColor(COLOR_BRAND)
                        .setTextAlignment(TextAlignment.RIGHT))
                .setBorder(Border.NO_BORDER).setBorderTop(new SolidBorder(COLOR_BRAND, 1f))
                .setPaddingTop(6).setPaddingBottom(6).setPaddingRight(6));

        doc.add(table);
    }

    // ── Approval history table ────────────────────────────────────────────────

    private void addHistoryTable(Document doc, List<ApprovalHistory> history, PdfFont regular, PdfFont bold) throws IOException {
        Table table = new Table(UnitValue.createPercentArray(new float[]{2f, 1.5f, 2f, 2f, 3f}))
                .useAllAvailableWidth().setMarginBottom(4);

        for (String h : new String[]{"Date", "Actor", "From", "To", "Notes"}) {
            table.addHeaderCell(new Cell()
                    .add(new Paragraph(h).setFont(bold).setFontSize(8).setFontColor(COLOR_WHITE))
                    .setBackgroundColor(COLOR_BRAND).setBorder(Border.NO_BORDER)
                    .setPaddingTop(6).setPaddingBottom(6).setPaddingLeft(6).setPaddingRight(6));
        }

        int no = 1;
        for (ApprovalHistory h : history) {
            DeviceRgb bg = (no % 2 == 0) ? COLOR_ROW_ALT : COLOR_WHITE;
            String from = h.getFromStatus() != null ? h.getFromStatus().name().replace("_", " ") : "NEW";
            String to   = h.getToStatus()   != null ? h.getToStatus().name().replace("_", " ")   : "-";
            tableCell(table, formatDateTime(h.getCreatedAt()),             regular, bg, TextAlignment.LEFT);
            tableCell(table, h.getActorUsername(),                          regular, bg, TextAlignment.LEFT);
            tableCell(table, from,                                          regular, bg, TextAlignment.LEFT);
            tableCell(table, to,                                            regular, bg, TextAlignment.LEFT);
            tableCell(table, h.getNotes() != null ? h.getNotes() : "-",    regular, bg, TextAlignment.LEFT);
            no++;
        }

        doc.add(table);
    }

    private void tableCell(Table table, String text, PdfFont font, DeviceRgb bg, TextAlignment align) {
        table.addCell(new Cell()
                .add(new Paragraph(text).setFont(font).setFontSize(8)
                        .setFontColor(COLOR_DARK).setTextAlignment(align))
                .setBackgroundColor(bg).setBorder(Border.NO_BORDER)
                .setPaddingTop(5).setPaddingBottom(5).setPaddingLeft(6).setPaddingRight(6));
    }

    // ── Footer ────────────────────────────────────────────────────────────────

    private void addFooter(Document doc, PdfFont regular) throws IOException {
        doc.add(new LineSeparator(new SolidLine(0.5f))
                .setStrokeColor(COLOR_BORDER).setMarginTop(20).setMarginBottom(8));
        String generated = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("dd MMMM yyyy, HH:mm", Locale.ENGLISH));
        doc.add(new Paragraph("Generated on " + generated + "  —  Purchase Order Processing System")
                .setFont(regular).setFontSize(7).setFontColor(COLOR_MUTED)
                .setTextAlignment(TextAlignment.CENTER));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private String formatDate(LocalDate date) {
        return date.format(DateTimeFormatter.ofPattern("dd MMMM yyyy", Locale.ENGLISH));
    }

    private String formatDateTime(LocalDateTime dt) {
        return dt.format(DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm", Locale.ENGLISH));
    }

    private String formatAmount(BigDecimal amount, String currency) {
        if (amount == null) return "-";
        String curr = (currency != null) ? currency : "IDR";
        return curr + " " + String.format(Locale.US, "%,.0f", amount);
    }
}
