const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { SERVICE_ACCOUNT_PATH } = require("../config");

class BaseService {
    ///
    constructor(){
        //
        this.serviceAccount = SERVICE_ACCOUNT_PATH;

        initializeApp({
          credential: cert(this.serviceAccount)
        });

        this.db = getFirestore();
    };

    async database(){
      return this.db;
    }
};


module.exports = BaseService;