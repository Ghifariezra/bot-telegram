export type Province = { province: string };

export interface District {
    village_code: string,
    village_name: string,
    district_name: string,
    province_name: string,
    subdistrict_name: string
}

export interface Data {
    province: string,
    villages: District[]
}