import {  ActivitiesModelData } from "../models/activities.model"

export interface LeadsQueryModel {
    readonly activityIds: ActivitiesModelData[],
    readonly annualRevenue: number,
    readonly companySize: {
        readonly dev: number,
        readonly fe: number,
        readonly total: number
    },
    readonly hiring: {
        readonly active: boolean,
        readonly junior: boolean,
        readonly talentProgram: boolean
    },
    readonly location: string,
    readonly name: string,
    readonly websiteLink: string
}
