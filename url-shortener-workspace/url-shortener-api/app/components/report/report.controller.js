const ReportService = require("./report.service");

class ReportController {
  constructor() {
    this.reportService = new ReportService();
  }

  async generatePdf(req, res, next) {
    try {
      const pdfStream = await this.reportService.generatePdfReport(req.user.id, req.query);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=url-history-${Date.now()}.pdf`);

      pdfStream.pipe(res);
    } catch (error) {
      next(error);
    }
  }

  async generateCsv(req, res, next) {
    try {
      const csvData = await this.reportService.generateCsvReport(req.user.id, req.query);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=url-history-${Date.now()}.csv`);

      return res.status(200).send(csvData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReportController;