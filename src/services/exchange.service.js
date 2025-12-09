import axios from 'axios';
import config from '../config/config.js';
import ApiError from '../utils/ApiError.js';
import httpStatus from 'http-status';

class ExchangeService {
    constructor(exchange) {
        this.exchange = exchange;
        this.baseUrl = exchange === 'NSE' ? config.nseApi.baseUrl : config.bseApi.baseUrl;
        this.apiKey = exchange === 'NSE' ? config.nseApi.apiKey : config.bseApi.apiKey;
    }

    async setupAxiosInstance() {
        return axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': this.apiKey,
            },
        });
    }

    async validateScheme(schemeCode) {
        try {
            const api = await this.setupAxiosInstance();
            const endpoint = this.exchange === 'NSE'
                ? `/mutual-funds/schemes/${schemeCode}`
                : `/mutualfunds/schemes/${schemeCode}`;

            const response = await api.get(endpoint);
            return response.data;
        } catch (error) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                `Invalid scheme code for ${this.exchange}: ${schemeCode}`
            );
        }
    }

    async createSIPOrder(orderData) {
        try {
            const api = await this.setupAxiosInstance();
            const endpoint = this.exchange === 'NSE'
                ? '/mutual-funds/sip/create'
                : '/mutualfunds/sip/register';

            const exchangeSpecificPayload = this.formatSIPPayload(orderData);
            const response = await api.post(endpoint, exchangeSpecificPayload);

            return {
                exchangeOrderId: response.data.orderId,
                status: response.data.status,
                message: response.data.message,
            };
        } catch (error) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                `Failed to create SIP order on ${this.exchange}: ${error.message}`
            );
        }
    }

    async modifySIPOrder(orderId, modificationData) {
        try {
            const api = await this.setupAxiosInstance();
            const endpoint = this.exchange === 'NSE'
                ? `/mutual-funds/sip/${orderId}/modify`
                : `/mutualfunds/sip/${orderId}/modify`;

            const exchangeSpecificPayload = this.formatSIPPayload(modificationData);
            const response = await api.put(endpoint, exchangeSpecificPayload);

            return {
                status: response.data.status,
                message: response.data.message,
            };
        } catch (error) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                `Failed to modify SIP order on ${this.exchange}: ${error.message}`
            );
        }
    }

    async cancelSIPOrder(orderId) {
        try {
            const api = await this.setupAxiosInstance();
            const endpoint = this.exchange === 'NSE'
                ? `/mutual-funds/sip/${orderId}/cancel`
                : `/mutualfunds/sip/${orderId}/cancel`;

            const response = await api.post(endpoint);

            return {
                status: response.data.status,
                message: response.data.message,
            };
        } catch (error) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                `Failed to cancel SIP order on ${this.exchange}: ${error.message}`
            );
        }
    }

    async getSIPStatus(orderId) {
        try {
            const api = await this.setupAxiosInstance();
            const endpoint = this.exchange === 'NSE'
                ? `/mutual-funds/sip/${orderId}/status`
                : `/mutualfunds/sip/${orderId}/status`;

            const response = await api.get(endpoint);

            return {
                status: response.data.status,
                lastExecutionDate: response.data.lastExecutionDate,
                nextExecutionDate: response.data.nextExecutionDate,
                totalInstallments: response.data.totalInstallments,
                completedInstallments: response.data.completedInstallments,
            };
        } catch (error) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                `Failed to fetch SIP status from ${this.exchange}: ${error.message}`
            );
        }
    }

    formatSIPPayload(data) {
        if (this.exchange === 'NSE') {
            return {
                schemeCode: data.schemeCode,
                investmentAmount: data.amount,
                frequency: data.frequency,
                installmentDay: data.sipDate,
                startDate: data.startDate,
                endDate: data.endDate,
                mandateId: data.mandateId,
                clientCode: data.userId,
            };
        } else {
            // BSE specific payload format
            return {
                SchemeCode: data.schemeCode,
                Amount: data.amount,
                FrequencyType: this.mapFrequencyForBSE(data.frequency),
                InstallmentDate: data.sipDate,
                StartDate: data.startDate,
                EndDate: data.endDate,
                MandateID: data.mandateId,
                ClientCode: data.userId,
                TransMode: 'D', // Direct mode
                DPTxn: 'P', // Physical mode
            };
        }
    }

    mapFrequencyForBSE(frequency) {
        const frequencyMap = {
            'MONTHLY': 'MONTHLY',
            'QUARTERLY': 'QUARTERLY',
            'WEEKLY': 'WEEKLY',
        };
        return frequencyMap[frequency] || 'MONTHLY';
    }
}

export default ExchangeService;