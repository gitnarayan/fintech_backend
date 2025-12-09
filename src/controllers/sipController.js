import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import ApiError from '../utils/ApiError.js';
import SIP from '../models/sip.model.js';
import ExchangeService from '../services/exchange.service.js';

/**
 * Create a new SIP
 */
const createSIP = catchAsync(async (req, res) => {
  const { exchange, schemeCode } = req.body;

  // Initialize exchange service
  const exchangeService = new ExchangeService(exchange);

  // Validate scheme code with exchange
  await exchangeService.validateScheme(schemeCode);

  // Create SIP order with exchange
  const sipData = {
    ...req.body,
    userId: req.user.id,
    nextExecutionDate: new Date(req.body.startDate)
  };

  const exchangeResponse = await exchangeService.createSIPOrder(sipData);

  // Create local SIP record
  const sip = await SIP.create({
    ...sipData,
    exchangeOrderId: exchangeResponse.exchangeOrderId
  });

  res.status(httpStatus.CREATED).send(sip);
});

/**
 * Get SIP by ID
 */
const getSIP = catchAsync(async (req, res) => {
  const sip = await SIP.findById(req.params.sipId);
  if (!sip) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SIP not found');
  }
  if (sip.userId.toString() !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  // Get latest status from exchange
  const exchangeService = new ExchangeService(sip.exchange);
  const exchangeStatus = await exchangeService.getSIPStatus(sip.exchangeOrderId);

  // Update local record with latest status
  sip.status = exchangeStatus.status;
  sip.lastExecutionDate = exchangeStatus.lastExecutionDate;
  sip.nextExecutionDate = exchangeStatus.nextExecutionDate;
  await sip.save();

  res.send(sip);
});

/**
 * Get all SIPs for a user
 */
const getUserSIPs = catchAsync(async (req, res) => {
  const sips = await SIP.find({ userId: req.user.id });

  // Get latest status for each SIP
  const updatedSips = await Promise.all(
    sips.map(async (sip) => {
      const exchangeService = new ExchangeService(sip.exchange);
      const exchangeStatus = await exchangeService.getSIPStatus(sip.exchangeOrderId);

      sip.status = exchangeStatus.status;
      sip.lastExecutionDate = exchangeStatus.lastExecutionDate;
      sip.nextExecutionDate = exchangeStatus.nextExecutionDate;
      await sip.save();

      return sip;
    })
  );

  res.send(updatedSips);
});

/**
 * Update SIP
 */
const updateSIP = catchAsync(async (req, res) => {
  const sip = await SIP.findById(req.params.sipId);
  if (!sip) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SIP not found');
  }
  if (sip.userId.toString() !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  // Update SIP with exchange
  const exchangeService = new ExchangeService(sip.exchange);
  await exchangeService.modifySIPOrder(sip.exchangeOrderId, {
    ...req.body,
    userId: req.user.id
  });

  // Update local record
  Object.assign(sip, req.body);
  await sip.save();
  res.send(sip);
});

/**
 * Cancel SIP
 */
const cancelSIP = catchAsync(async (req, res) => {
  const sip = await SIP.findById(req.params.sipId);
  if (!sip) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SIP not found');
  }
  if (sip.userId.toString() !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  // Cancel SIP with exchange
  const exchangeService = new ExchangeService(sip.exchange);
  await exchangeService.cancelSIPOrder(sip.exchangeOrderId);

  sip.status = 'CANCELLED';
  await sip.save();
  res.send(sip);
});

/**
 * Pause SIP
 */
const pauseSIP = catchAsync(async (req, res) => {
  const sip = await SIP.findById(req.params.sipId);
  if (!sip) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SIP not found');
  }
  if (sip.userId.toString() !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  // Pause SIP with exchange
  const exchangeService = new ExchangeService(sip.exchange);
  await exchangeService.modifySIPOrder(sip.exchangeOrderId, {
    ...sip.toObject(),
    status: 'PAUSED',
    userId: req.user.id
  });

  sip.status = 'PAUSED';
  await sip.save();
  res.send(sip);
});

/**
 * Resume SIP
 */
const resumeSIP = catchAsync(async (req, res) => {
  const sip = await SIP.findById(req.params.sipId);
  if (!sip) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SIP not found');
  }
  if (sip.userId.toString() !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  // Resume SIP with exchange
  const exchangeService = new ExchangeService(sip.exchange);
  await exchangeService.modifySIPOrder(sip.exchangeOrderId, {
    ...sip.toObject(),
    status: 'ACTIVE',
    userId: req.user.id
  });

  sip.status = 'ACTIVE';
  await sip.save();
  res.send(sip);
});

export default {
  createSIP,
  getSIP,
  getUserSIPs,
  updateSIP,
  cancelSIP,
  pauseSIP,
  resumeSIP,
};