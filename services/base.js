const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { SERVICE_ACCOUNT_PATH } = require("../config");

class BaseService {
    ///
    constructor(){
        //
        this.serviceAccount = SERVICE_ACCOUNT_PATH;

        initializeApp({
          credential: cert(serviceAccount)
        });

        this.db = getFirestore();
    };
};


module.exports = BaseService;