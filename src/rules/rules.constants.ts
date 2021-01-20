export enum Trigger {
    dispositionChange = "dispositionChange",
    numberOfAttempts = "numberOfAttempts",
    overdueFollowups = "overdueFollowups",
    repeatedDisposition = "repeatedDisposition",
    changeHandler = "changeHandler",
  }
  
  export const TriggerOptions = [
    { label: "Disposition Change", value: Trigger.dispositionChange },
    { label: "Number Of Attempts", value: Trigger.numberOfAttempts },
    { label: "Overdue Followups", value: Trigger.overdueFollowups },
    { label: "Repeated Disposition", value: Trigger.repeatedDisposition },
    { label: "Change Handler", value: Trigger.changeHandler },
  ];
  
  
  export enum EActions {
      changeDisposition = "changeDisposition",
      callApi = "callApi",
      changeProspectHandler = 'changeProspectHandler'
  }
  
  
  export const ActionOptions = [
      {label: "Change Disposition", value: EActions.changeDisposition},
      {label: "Call Api", value: EActions.callApi},
      {label: "Change Prospect Handler", value: EActions.changeProspectHandler},
      
  ]