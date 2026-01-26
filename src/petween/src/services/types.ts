export interface User {
    id: number
    name: string
    profile_image?: string
}

export interface Pet {
    id: number
    name: string
    species: string
    size: number
    chunky: number
    owners: User[]
}

export interface PetCreate {
    name: string
    species: string
    size: number
    chunky: number
}
