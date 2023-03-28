import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { BaseService } from "../base.service";
import { ComboBoxTypeConstant, Configuration } from "app/app.constants";
import { EmailModel, ApiResultResponse } from "app/models";
import { Uti } from "app/utilities";
import * as CryptoJS from "crypto-js";

@Injectable()
export class CommonService extends BaseService {
    private comboBoxResultList: any = {};
    private encryptKey = "FPmVdoUfbyXpralX";
    private encryptInitVector = "Xbbmc8eADAe2JQhY";
    private notAllowCachedKeys: Array<string> = [
        "principal",
        "allMandant",
        "serviceProvider",
        "wareHouse",
        "campaignWizardAddress",
        ComboBoxTypeConstant.repAppSystemColumnNameTemplate,
        ComboBoxTypeConstant.widgetType.toString(),
        ComboBoxTypeConstant.moduleItems.toString(),
    ];

    constructor(injector: Injector) {
        super(injector);

        //if (!localStorage.getItem(this.config.localStorageCurrentUser)) return;
    }

    public encrypt(str: string) {
        let key = CryptoJS.enc.Utf8.parse(this.encryptKey);
        let iv = CryptoJS.enc.Utf8.parse(this.encryptInitVector);
        // Encrypt
        let cipherText = CryptoJS.AES.encrypt(str, key, {
            blockSize: 64,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        return cipherText.toString();
    }

    public decrypt(str: string) {
        let key = CryptoJS.enc.Utf8.parse(this.encryptKey);
        let iv = CryptoJS.enc.Utf8.parse(this.encryptInitVector);
        // Decrypt
        let bytes = CryptoJS.AES.decrypt(str, key, {
            blockSize: 64,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    public executeURL(url: string, param?: any): Observable<any> {
        return this.get<any>(url, param, null, null, null, true);
    }

    private getStringKeyList(identityKeys: Array<string>) {
        let keys = Object.keys(ComboBoxTypeConstant);
        var stringKeys: Array<any> = [];
        for (var i = 0; i < identityKeys.length; i++) {
            keys.forEach((key) => {
                if (ComboBoxTypeConstant[key] == identityKeys[i]) {
                    stringKeys.push(key);
                }
            });

            if (
                !this.isExistInObject(identityKeys[i], ComboBoxTypeConstant) &&
                !stringKeys.find((str) => str == identityKeys[i])
            ) {
                stringKeys.push(identityKeys[i]);
            }
        }

        return stringKeys;
    }

    isExistInObject(name, obj) {
        let keys = Object.keys(obj);

        for (let key of keys) {
            if (obj[key] == name) {
                return true;
            }
        }

        return false;
    }

    private getRequestKeyList(stringKeys: Array<any>) {
        var requestKeys: Array<string> = [];
        for (var i = 0; i < stringKeys.length; i++) {
            var stringKey = stringKeys[i];
            if (
                !this.comboBoxResultList ||
                !this.comboBoxResultList[stringKey] ||
                (this.comboBoxResultList[stringKey] &&
                    this.comboBoxResultList[stringKey].length == 0)
            ) {
                requestKeys.push(stringKey);
            }
        }
        return requestKeys;
    }

    private getRequestKeyListFromCache(stringKeys: Array<any>) {
        var requestKeys: Array<string> = [];
        for (var i = 0; i < stringKeys.length; i++) {
            var stringKey = stringKeys[i];
            if (!BaseService.cacheService.has(stringKey.toLowerCase())) {
                requestKeys.push(stringKey);
            }
        }
        return requestKeys;
    }

    private buildListComboboxFromCache(stringKeys: Array<any>) {
        let result: any = {};
        for (var i = 0; i < stringKeys.length; i++) {
            result[stringKeys[i]] = BaseService.cacheService.getValue(
                stringKeys[i].toLowerCase()
            );
        }

        return result;
    }

    public getListComboBox(
        comboBoxList: string,
        extraData?: string,
        noCache?: boolean
    ): Observable<any> {
        let identityKeys: Array<string> = comboBoxList.split(",");
        let stringKeys: Array<any> = this.getStringKeyList(identityKeys);
        let requestKeys: Array<string> =
            this.getRequestKeyListFromCache(stringKeys);

        // if `data` is available just return it as `Observable`
        if (requestKeys.length == 0 && !noCache) {
            return Observable.of(
                new ApiResultResponse({
                    item: this.buildListComboboxFromCache(stringKeys),
                    statusCode: 1,
                })
            );
        } else {
            let paramKeys = requestKeys.join(",");

            let obj: any = {};

            if (extraData) {
                obj["strObject"] = paramKeys;
                obj["mode"] = extraData;
            } else {
                obj["comboBoxList"] = paramKeys;
            }

            let observable = this.get<any>(this.serUrl.getComboxBoxList, obj)
                .map((response: ApiResultResponse) => {
                    let res = response.item;
                    if (res) {
                        var resKeys = Object.keys(res);
                        resKeys.forEach((resKey) => {
                            // Check if this key don't allow cached.
                            const notAllowCachedKey =
                                this.notAllowCachedKeys.find(
                                    (p) =>
                                        Uti.toLowerCase(p) ==
                                        Uti.toLowerCase(resKey)
                                );
                            // Allow cache case
                            if (!notAllowCachedKey && !noCache) {
                                //check array or object must has data
                                //const isArray = Array.isArray(res[resKey]);
                                //if ((isArray && res[resKey].length) || (!isArray && res[resKey]))
                                BaseService.cacheService.set(
                                    resKey.toLowerCase(),
                                    res[resKey]
                                );
                            }
                        });
                    }

                    // Allow cache case
                    if (!noCache) {
                        response.item = Object.assign(
                            this.buildListComboboxFromCache(stringKeys),
                            response.item
                        );
                    }

                    return response;
                })
                .share();

            return observable;
        }
    }

    public getComboBoxDataByFilter(
        key: any,
        filterBy: string,
        keyName?: string,
        noCache?: boolean
    ): Observable<any> {
        let stringKeys: Array<any> = [];
        if (keyName) {
            stringKeys.push(keyName);
        } else {
            stringKeys = this.getStringKeyList([key.toString()]);
        }

        let s = stringKeys.map((p) => {
            return p + "_" + filterBy;
        });
        let requestKeys = s;

        if (!noCache) {
            requestKeys = this.getRequestKeyListFromCache(s);
        }

        // if `data` is available just return it as `Observable`
        if (requestKeys.length == 0) {
            return Observable.of(
                new ApiResultResponse({
                    item: this.buildListComboboxFromCache(s),
                    statusCode: 1,
                })
            );
        } else {
            requestKeys = requestKeys.map((p) => {
                return p.split("_")[0];
            });
            var observable = this.get<any>(this.serUrl.getComboxBoxList, {
                strObject: requestKeys[0],
                mode: filterBy,
            })
                .map((response: ApiResultResponse) => {
                    let res = response.item;
                    if (res) {
                        var resKeys = Object.keys(res);
                        resKeys.forEach((resKey) => {
                            if (!noCache) {
                                BaseService.cacheService.set(
                                    (resKey + "_" + filterBy).toLowerCase(),
                                    res[resKey]
                                );
                            }
                        });
                    }

                    if (!noCache) {
                        response.item = this.buildListComboboxFromCache(s);
                    }
                    return response;
                })
                .share();
            return observable;
        }
    }

    public getComboBoxDataByCondition(
        comboboxName: string,
        condition: string
    ): Observable<any> {
        let cacheKey =
            this.serUrl.getComboxBoxList + ":" + comboboxName + "-" + condition;
        return BaseService.cacheService.get(
            cacheKey,
            this.get<any>(this.serUrl.getComboxBoxList, {
                strObject: comboboxName,
                mode: condition,
            })
        );
    }

    public getModuleToPersonType() {
        return BaseService.cacheService.get(
            this.serUrl.getModuleToPersonType,
            this.get<any>(this.serUrl.getModuleToPersonType)
        );
    }

    public createContact(contact: any): Observable<any> {
        contact = Uti.convertDataEmptyToNull(contact);
        return this.post<any>(
            this.serUrl.createContact,
            JSON.stringify(contact)
        );
    }

    public updateContact(contact: any): Observable<any> {
        contact = Uti.convertDataEmptyToNull(contact);
        return this.post<any>(
            this.serUrl.updateContact,
            JSON.stringify(contact)
        );
    }

    public checkFileExisted(fileName: string): Observable<any> {
        return this.get<any>(this.serUrl.checkFileExisted, {
            fileName: fileName,
        });
    }

    public downloadTemplates(data: any): Observable<any> {
        return this.post<any>(
            this.serUrl.downloadTemplates,
            JSON.stringify(data)
        ); //param, token, dontParseJson
    }

    public donwloadReportNote(idPerson): Observable<any> {
        const options = {};
        options["Content-Type"] = "application/json";
        options["Accept"] = "application/json";
        options["Cache-Control"] = "no-cache";
        options["Pragma"] = "no-cache";
        options["responseType"] = "blob";

        return this.getV2<any>(
            `${this.serUrl.donwloadReportNote}?fieldname=IdPerson&Value=${idPerson}`,
            options
        );
    }

    //PublicSettings will be gotten before app_load, so this method will not be used.
    //Please use Configuration.PublicSettings instead
    public getPublicSetting(): Observable<any> {
        if (Configuration.PublicSettings)
            return Observable.of(Configuration.PublicSettings);

        return BaseService.cacheService
            .get(
                this.serUrl.getPublicSetting,
                this.get<any>(this.serUrl.getPublicSetting)
            )
            .map((result: any) => {
                Configuration.PublicSettings = result.item;

                return result.item;
            });
    }

    public sendEmail(email: EmailModel): Observable<any> {
        return this.post<any>(this.serUrl.sendEmail, JSON.stringify(email));
    }

    public SendEmailWithImageAttached(email: EmailModel): Observable<any> {
        return this.post<any>(
            this.serUrl.createNotificationWithSendEmail,
            JSON.stringify(email)
        );
    }

    public getMainLanguages(): Observable<any> {
        return BaseService.cacheService.get(
            this.serUrl.getMainLanguages,
            this.get<any>(this.serUrl.getMainLanguages)
        );
    }

    public getCustomerColumnsSetting(objectName: string): Observable<any> {
        return this.get<any>(this.serUrl.getCustomerColumnsSetting, {
            objectName: objectName,
        });
    }

    public matchingCustomerData(customerModel: any): Observable<any> {
        return this.post<any>(
            this.serUrl.matchingCustomerData,
            JSON.stringify(customerModel)
        );
    }

    public getWidgetAppById(idRepWidgetApp: string): Observable<any> {
        return this.get<any>(this.serUrl.getWidgetAppById, {
            idRepWidgetApp: idRepWidgetApp,
        });
    }

    public updateWidgetApp(model: any): Observable<any> {
        return this.post<any>(
            this.serUrl.updateWidgetApp,
            JSON.stringify(model)
        );
    }

    public createQueue(model: any): Observable<any> {
        return this.post<any>(this.serUrl.createQueue, JSON.stringify(model));
    }

    public deleteQueues(model: any): Observable<any> {
        return this.post<any>(this.serUrl.deleteQueues, JSON.stringify(model));
    }

    public getImageGalleryFolder(): Observable<any> {
        return this.get<any>(this.serUrl.getImageGalleryFolder);
    }

    public getImagesByFolderId(folderId: any): Observable<any> {
        return this.get<any>(this.serUrl.getImagesByFolderId, {
            folderId: folderId,
        });
    }

    public savingSharingTreeGroups(model: any): Observable<any> {
        return this.post<any>(
            this.serUrl.savingSharingTreeGroups,
            JSON.stringify(model)
        );
    }

    public editImagesGallery(model: any): Observable<any> {
        return this.post<any>(
            this.serUrl.editImagesGallery,
            JSON.stringify(model)
        );
    }

    public SHA256(str: string) {
        function rightRotate(value, amount) {
            return (value >>> amount) | (value << (32 - amount));
        }

        let mathPow = Math.pow;
        let maxWord = mathPow(2, 32);
        let lengthProperty = "length";
        let i, j; // Used as a counter across the whole file
        let result = "";

        let words = [];
        let asciiBitLength = str[lengthProperty] * 8;

        //* caching results is optional - remove/add slash from front of this line to toggle
        // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
        // (we actually calculate the first 64, but extra values are just ignored)
        let hash = ((<any>this.SHA256).h = (<any>this.SHA256).h || []);
        // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
        let k = ((<any>this.SHA256).k = (<any>this.SHA256).k || []);
        let primeCounter = k[lengthProperty];
        /*/
        let hash = [], k = [];
        let primeCounter = 0;
        //*/

        let isComposite = {};
        for (let candidate = 2; primeCounter < 64; candidate++) {
            if (!isComposite[candidate]) {
                for (i = 0; i < 313; i += candidate) {
                    isComposite[i] = candidate;
                }
                hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
                k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
            }
        }

        str += "\x80"; // Append Ƈ' bit (plus zero padding)
        while ((str[lengthProperty] % 64) - 56) str += "\x00"; // More zero padding
        for (i = 0; i < str[lengthProperty]; i++) {
            j = str.charCodeAt(i);
            if (j >> 8) return; // ASCII check: only accept characters in range 0-255
            words[i >> 2] |= j << (((3 - i) % 4) * 8);
        }
        words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
        words[words[lengthProperty]] = asciiBitLength;

        // process each chunk
        for (j = 0; j < words[lengthProperty]; ) {
            let w = words.slice(j, (j += 16)); // The message is expanded into 64 words as part of the iteration
            let oldHash = hash;
            // This is now the undefinedworking hash", often labelled as variables a...g
            // (we have to truncate as well, otherwise extra entries at the end accumulate
            hash = hash.slice(0, 8);

            for (i = 0; i < 64; i++) {
                let i2 = i + j;
                // Expand the message into 64 words
                // Used below if
                let w15 = w[i - 15],
                    w2 = w[i - 2];

                // Iterate
                let a = hash[0],
                    e = hash[4];
                let temp1 =
                    hash[7] +
                    (rightRotate(e, 6) ^
                        rightRotate(e, 11) ^
                        rightRotate(e, 25)) + // S1
                    ((e & hash[5]) ^ (~e & hash[6])) + // ch
                    k[i] +
                    // Expand the message schedule if needed
                    (w[i] =
                        i < 16
                            ? w[i]
                            : (w[i - 16] +
                                  (rightRotate(w15, 7) ^
                                      rightRotate(w15, 18) ^
                                      (w15 >>> 3)) + // s0
                                  w[i - 7] +
                                  (rightRotate(w2, 17) ^
                                      rightRotate(w2, 19) ^
                                      (w2 >>> 10))) | // s1
                              0);
                // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
                let temp2 =
                    (rightRotate(a, 2) ^
                        rightRotate(a, 13) ^
                        rightRotate(a, 22)) + // S0
                    ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])); // maj

                hash = [(temp1 + temp2) | 0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
                hash[4] = (hash[4] + temp1) | 0;
            }

            for (i = 0; i < 8; i++) {
                hash[i] = (hash[i] + oldHash[i]) | 0;
            }
        }

        for (i = 0; i < 8; i++) {
            for (j = 3; j + 1; j--) {
                let b = (hash[i] >> (j * 8)) & 255;
                result += (b < 16 ? 0 : "") + b.toString(16);
            }
        }
        return result;
    }
}
