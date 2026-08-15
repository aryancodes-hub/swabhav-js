const UrlService = require("./url.service.js");

class UrlController {
    constructor() {
        this.urlService = new UrlService();
    }

    async redirect(req, res, next) {
        try {
            const destination = await this.urlService.redirect(req.params.shortCode);
            console.log(destination)

            return res.redirect(destination);
        } catch (error) {
            next(error);
        }
    }

    async createUrl(req, res, next) {
        try {
            const newUrl = await this.urlService.createUrl(req.user.id, req.body);
            return res.status(201).json({
                success: true,
                data: newUrl
            });
        } catch (error) {
            next(error);
        }
    }

    async listUrls(req, res, next) {
        try {
            const result = await this.urlService.getUserUrl(req.user.id, req.query, req.pagination);
            return res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }
    async getUrlById(req, res, next) {
        try {
            const urlRecord = await this.urlService.getUrlById(req.user.id, req.params.urlId);
            return res.status(200).json({
                success: true,
                data: urlRecord
            });
        } catch (error) {
            next(error);
        }
    }

    async updateUrl(req, res, next) {
        try {
            const updatedUrl = await this.urlService.updateUrl(
                req.user.id,
                req.params.urlId,
                req.body
            );
            return res.status(200).json({
                success: true,
                data: updatedUrl
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteUrl(req, res, next) {
        try {
            await this.urlService.deleteUrl(req.user.id, req.params.urlId);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async renewUrl(req, res, next) {
        try {
            const result = await this.urlService.renewUrl(req.user.id, req.params.urlId);
            return res.status(201).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UrlController;
