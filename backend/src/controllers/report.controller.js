import { getAuthUserId } from '../utils/auth.js';
import * as reportService from '../services/report.service.js';

export const exportRevenueWordController = async (req, res, next) => {
  try {
    const result = await reportService.exportRevenueWord({
      userId: getAuthUserId(req),
      businessId: req.query.businessId,
      periodType: req.query.periodType,
      value: req.query.value,
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${result.fileName}"`,
    );

    return res.status(200).send(result.buffer);
  } catch (error) {
    next(error);
  }
};
