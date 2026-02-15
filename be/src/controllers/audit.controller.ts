import { catchAsync } from "../utils/catchAsync.js";
import * as auditService from "../services/auditlog.service.js";

export const getAudits = catchAsync(async (req, res, next) => {
  const { workspaceId } = req.params as { workspaceId: string };
  const audits = await auditService.getAudits({
    workspaceId,
    userId: req.user.id,
  });
  res.status(200).json({ status: "success", data: audits });
});
