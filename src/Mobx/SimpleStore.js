import { observable, action, makeObservable, enforceActions, configure } from "mobx"
configure({
    enforceActions: "never",
})
class CounterStore {
    @observable kgValue = '';
    @observable meterValue = '';
    @observable feetValue = '';
    @observable inchesValue = '';

    constructor() {
        makeObservable(this);
    }

}
export default new CounterStore()