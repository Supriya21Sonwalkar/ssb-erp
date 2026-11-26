import api from "./api";

const BASE_URL = "/fees/payments";

const feePaymentApi = {

    /*
    |--------------------------------------------------------------------------
    | Search Students
    |--------------------------------------------------------------------------
    | Supports:
    | - First name
    | - Middle name
    | - Last name
    | - Full name
    | - Admission number
    | - Academic year
    */

    searchStudents: (params = {}) =>
        api.get(`${BASE_URL}/students`, {
            params,
        }),


    /*
    |--------------------------------------------------------------------------
    | Get Student Fee Details
    |--------------------------------------------------------------------------
    |
    | Returns:
    | - Student profile
    | - Course
    | - Fee structure
    | - Total fee
    | - Waiver
    | - Total paid
    | - Due
    | - All transactions
    |
    */

    getStudentDetails: (studentId) =>
        api.get(
            `${BASE_URL}/students/${studentId}`
        ),


    /*
    |--------------------------------------------------------------------------
    | Collect Fee Payment
    |--------------------------------------------------------------------------
    */

    collectPayment: (data) =>
        api.post(
            BASE_URL,
            data
        ),


    /*
    |--------------------------------------------------------------------------
    | Get All Payments
    |--------------------------------------------------------------------------
    */

    getAll: (params = {}) =>
        api.get(BASE_URL, {
            params,
        }),


    /*
    |--------------------------------------------------------------------------
    | Get Single Payment
    |--------------------------------------------------------------------------
    */

    getById: (paymentId) =>
        api.get(
            `${BASE_URL}/${paymentId}`
        ),

};

export default feePaymentApi;