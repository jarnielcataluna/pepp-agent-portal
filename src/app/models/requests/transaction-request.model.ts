
import { JsonProperty } from 'json-typescript-mapper';
export class TransactionRequestModel {
    @JsonProperty('type')
    private _type: number;

    @JsonProperty('startDate')
    private _startDate: string;

    @JsonProperty('endDate')
    private _endDate: string;

    @JsonProperty('agent')
    private _agentId: string;

    @JsonProperty('page')
    private _page: number;

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    get startDate() {
        return this._startDate;
    }

    set startDate(value) {
        this._startDate = value;
    }

    get endDate() {
        return this._endDate;
    }

    set endDate(value) {
        this._endDate = value;
    }

    get agent() {
        return this._agentId;
    }

    set agent(value) {
        this._agentId = value;
    }

    get page() {
        return this._agentId;
    }

    set page(value) {
        this._agentId = value;
    }

}
