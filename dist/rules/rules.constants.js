"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionOptions = exports.EActions = exports.TriggerOptions = exports.Trigger = void 0;
var Trigger;
(function (Trigger) {
    Trigger["dispositionChange"] = "dispositionChange";
    Trigger["numberOfAttempts"] = "numberOfAttempts";
    Trigger["overdueFollowups"] = "overdueFollowups";
    Trigger["repeatedDisposition"] = "repeatedDisposition";
    Trigger["changeHandler"] = "changeHandler";
})(Trigger = exports.Trigger || (exports.Trigger = {}));
exports.TriggerOptions = [
    { label: "Disposition Change", value: Trigger.dispositionChange },
    { label: "Number Of Attempts", value: Trigger.numberOfAttempts },
    { label: "Overdue Followups", value: Trigger.overdueFollowups },
    { label: "Repeated Disposition", value: Trigger.repeatedDisposition },
    { label: "Change Handler", value: Trigger.changeHandler },
];
var EActions;
(function (EActions) {
    EActions["changeDisposition"] = "changeDisposition";
    EActions["callApi"] = "callApi";
    EActions["changeProspectHandler"] = "changeProspectHandler";
})(EActions = exports.EActions || (exports.EActions = {}));
exports.ActionOptions = [
    { label: "Change Disposition", value: EActions.changeDisposition },
    { label: "Call Api", value: EActions.callApi },
    { label: "Change Prospect Handler", value: EActions.changeProspectHandler },
];
//# sourceMappingURL=rules.constants.js.map