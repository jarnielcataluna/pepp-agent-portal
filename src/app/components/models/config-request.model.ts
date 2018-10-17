import { JsonProperty } from 'json-typescript-mapper';
import { CommissionRequestModel } from './commission-request.model';
export class ConfigRequestModel {

    @JsonProperty({ clazz: CommissionRequestModel, name: 'send' })
    private _send: CommissionRequestModel;

    @JsonProperty({ clazz: CommissionRequestModel, name: 'receive' })
    private _receive: CommissionRequestModel;

    constructor() {
        this._send = void 0;
        this._receive = void 0;
    }


    /**
     * Getter send
     * @return {CommissionRequestModel}
     */
    public get send(): CommissionRequestModel {
        return this._send;
    }

    /**
     * Getter receive
     * @return {CommissionRequestModel}
     */
    public get receive(): CommissionRequestModel {
        return this._receive;
    }

    /**
     * Setter send
     * @param {CommissionRequestModel} value
     */
    public set send(value: CommissionRequestModel) {
        this._send = value;
    }

    /**
     * Setter receive
     * @param {CommissionRequestModel} value
     */
    public set receive(value: CommissionRequestModel) {
        this._receive = value;
    }


}
