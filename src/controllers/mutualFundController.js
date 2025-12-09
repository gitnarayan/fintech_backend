

import httpStatus from 'http-status'
import catchAsync from '../utils/catchAsync.js'; // Assuming you have a utility for async error handling
import pick from '../utils/pick.js'
import ApiError from '../utils/ApiError.js';
import axios from 'axios';

const getMutualFundByQuery = catchAsync(async (req, res) => {
    const options = pick(req.query, ['limit', 'page', 'search', 'sortBy']);
    const filter = pick(req.query, ['debt', 'equity', 'hybrid', 'liquid', 'other', 'mutualFundType']);

    const page = parseInt(options.page, 10) || 1;
    const limit = parseInt(options.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const formData = new URLSearchParams();
    const selectedSchemes = [];

    switch (filter.mutualFundType) {
        case 'debt':
            selectedSchemes.push('21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
                '31', '32', '33', '34', '35', '36', '45');
            break;
        case 'equity':
            selectedSchemes.push('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15',
                '16', '17', '18', '19', '20', '44');
            break;
        case 'hybrid':
            selectedSchemes.push('36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46');
            break;
        case 'gold':
            selectedSchemes.push('46', '47');
            break;
        case 'fofs':
            selectedSchemes.push('48', '49');
            break;
        default:
            selectedSchemes.push(
                ...Array.from({ length: 50 }, (_, i) => String(i + 1))
            );
    }

    const selectedRatings = ['1', '2', '3', '4', '5', 'Unrated'];
    selectedSchemes.forEach(value => formData.append('selected_schemes[]', value));
    selectedRatings.forEach(value => formData.append('selected_rating[]', value));

    formData.append('selected_amc[]', 'all');
    formData.append('selected_manager[]', 'all');
    formData.append('selected_index[]', 'all');
    formData.append('selected_fund_type[]', '1');
    formData.append('selected_from_date', '0');
    formData.append('selected_to_date', '0');
    formData.append('condn_type', 'asset');

    try {
        const response = await axios.post(
            'https://www.rupeevest.com/functionalities/asset_class_section?',
            formData.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'User-Agent': 'Mozilla/5.0',
                },
                timeout: 5000, // 5 seconds timeout
            }
        );

        const rawData = response.data;
        const paginatedData = rawData.schemedata.slice(startIndex, endIndex);
        const filteredData = paginatedData.map(item => ({
            schemecode: item.schemecode,
            fund_house: item.fund_house,
            classification: item.classification,
            s_name1: item.s_name1,
            fund_house1: item.fund_house1,
            aumtotal: item.aumtotal,
            returns_1month: item.returns_1month,
            returns_3month: item.returns_3month,
            returns_6month: item.returns_6month,
            returns_1year: item.returns_1year,
            returns_3year: item.returns_3year,
            returns_5year: item.returns_5year,
            returns_10year: item.returns_10year,

        }));
        const totalCount = rawData.schemedata.length;

        return res.status(httpStatus.OK).send({
            data: filteredData,
            totalCount,
            page,
            limit
        });

    } catch (error) {
        if (error.response) {
            console.error('API responded with error:', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('No response received:', error.message);
        } else {
            console.error('Axios config error:', error.message);
        }

        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .send({ message: 'Error fetching mutual funds', error: error.message });
    }
});




// const getOccupation = catchAsync(async (req, res) => {
export default { getMutualFundByQuery }