
export interface LeadsModel {
    readonly data: LeadsModelData[]
}

export interface LeadsModelData {
    readonly activityIds: string[],
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
    readonly industry: string
    readonly linkedinLink: string
}

