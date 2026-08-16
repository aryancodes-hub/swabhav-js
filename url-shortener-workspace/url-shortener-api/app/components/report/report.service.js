const { Op } = require("sequelize");
const { ShortUrl, User } = require("@url/url-shortener-data-model");
const ReportGenerator = require("../../utils/report-generator");

class ReportService {
  async fetchUserUrlHistory(userId, dateRange = {}) {
    const { startDate, endDate } = dateRange;
    const where = { userId };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    return await ShortUrl.findAll({
      where,
      order: [["createdAt", "DESC"]]
    });
  }

  async generatePdfReport(userId, dateRange = {}) {
    const user = await User.findByPk(userId);
    const urls = await this.fetchUserUrlHistory(userId, dateRange);

    // Format rows for table rendering
    const formattedRows = urls.map((u) => {
      const json = u.toJSON();
      return {
        shortCode: json.shortCode,
        originalUrl: json.originalUrl,
        status: json.status,
        totalVisits: json.totalVisits,
        remainingVisits: json.remainingVisits,
        createdAt: new Date(json.createdAt).toLocaleDateString()
      };
    });

    // Table Column Schema
    const headers = [
      { label: "SHORT CODE", key: "shortCode", widthPercent: 16 },
      { label: "ORIGINAL URL", key: "originalUrl", widthPercent: 32 },
      { label: "STATUS", key: "status", widthPercent: 12 },
      { label: "TOTAL VISITS", key: "totalVisits", widthPercent: 13, align: "center" },
      { label: "REMAINING", key: "remainingVisits", widthPercent: 14, align: "center" },
      { label: "CREATED", key: "createdAt", widthPercent: 13, align: "center" }
    ];

    let rangeString = null;
    if (dateRange.startDate || dateRange.endDate) {
      rangeString = `${dateRange.startDate || "Beginning"} to ${dateRange.endDate || "Today"}`;
    }

    return ReportGenerator.buildStyledPdfStream({
      title: "URL History Analytics Report",
      userInfo: {
        name: user ? user.name : "User",
        email: user ? user.email : "N/A",
        dateRange: rangeString
      },
      headers,
      rows: formattedRows
    });
  }

  async generateCsvReport(userId, dateRange) {
    const urls = await this.fetchUserUrlHistory(userId, dateRange);

    const fields = [
      { label: "Short Code", value: "shortCode" },
      { label: "Original URL", value: "originalUrl" },
      { label: "Status", value: "status" },
      { label: "Total Visits", value: "totalVisits" },
      { label: "Remaining Visits", value: "remainingVisits" },
      { label: "Created Date", value: (row) => new Date(row.createdAt).toISOString() },
      { label: "Last Accessed", value: (row) => (row.lastAccessedAt ? new Date(row.lastAccessedAt).toISOString() : "Never") }
    ];

    return ReportGenerator.buildCsvString({
      fields,
      data: urls.map((u) => u.toJSON())
    });
  }
}

module.exports = ReportService;