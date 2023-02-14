import {AbilityScores, Leader} from '../actions-and-skills';
import {boolean} from 'joi';

const allActorTypes = [
    'pc',
    'npc',
    'companion',
] as const;

export type ActorTypes = typeof allActorTypes[number];

export const allCompanions = [
    'Amiri',
    'Ekundayo',
    'Harrim',
    'Jaethal',
    'Jubilost',
    'Kalikke',
    'Kanerah',
    'Linzi',
    'Nok-Nok',
    'Octavia',
    'Regongar',
    'Tristian',
    'Valerie',
];

export interface KingdomSizeData {
    type: 'territory' | 'province' | 'state' | 'country' | 'dominion';
    resourceDieSize: 'd4' | 'd6' | 'd8' | 'd10' | 'd12';
    controlDCModifier: number;
    commodityStorage: number;
}

export type Leaders = Record<Leader, LeaderValues>;

export interface LeaderValues {
    name: string;
    invested: boolean;
    type: ActorTypes;
    vacant: boolean;
}

export interface RuinValues {
    value: number;
    penalty: number;
    threshold: number;
}

export interface Ruin {
    corruption: RuinValues;
    crime: RuinValues;
    decay: RuinValues;
    strife: RuinValues;
}


interface WorkSite {
    quantity: number;
    resources: number;
}

export interface WorkSites {
    farmlands: WorkSite;
    lumberCamps: WorkSite;
    mines: WorkSite;
    quarries: WorkSite;
}

export interface Resources {
    bonusResourceDice: number;
    resourcePoints: number;
}

export interface Commodities {
    food: number;
    lumber: number;
    luxuries: number;
    ore: number;
    stone: number;
}

interface TradeAgreement {
    group: string;
    negotiationDC: number;
    atWar: boolean;
    relations: 'none' | 'diplomatic-relations' | 'trade-agreement';
}

export interface SkillRanks {
    agriculture: number;
    arts: number;
    boating: number;
    defense: number;
    engineering: number;
    exploration: number;
    folklore: number;
    industry: number;
    intrigue: number;
    magic: number;
    politics: number;
    scholarship: number;
    statecraft: number;
    trade: number;
    warfare: number;
    wilderness: number;
}

export type Terrain = 'swamp' | 'hills' | 'plains' | 'mountains' | 'forest';

export const allFameTypes = ['famous', 'infamous'] as const;

export type FameType = typeof allFameTypes[number];

export interface Feat {
    id: string;
    level: number;
}

export interface BonusFeat {
    id: string;
}

export interface Kingdom {
    name: string;
    atWar: boolean;
    charter: string;
    government: string;
    fame: number;
    fameType: FameType;
    level: number;
    xpThreshold: number;
    xp: number;
    size: number;
    unrest: number;
    resourcesNextRound: Resources;
    resources: Resources;
    workSites: WorkSites;
    heartland: Terrain;
    armyConsumption: number;
    leaders: Leaders;
    commodities: Commodities;
    commoditiesNextRound: Commodities;

    tradeAgreements: TradeAgreement[];
    feats: Feat[];
    bonusFeats: BonusFeat[];
    skillRanks: SkillRanks;
    abilityScores: AbilityScores;
    ruin: Ruin;
    activeSettlement: string;
}


interface KingdomLevelData {
    claimHexAttempts: number;
    claimHexCircumstanceBonus: number;
    investedLeadershipBonus: number;
    resourceDice: number;
}

export function getLevelData(kingdomLevel: number): KingdomLevelData {
    const claimHexAttempts = kingdomLevel < 4 ? 1 : (kingdomLevel < 9 ? 2 : 3);
    const claimHexCircumstanceBonus = kingdomLevel < 4 ? 0 : 2;
    const investedLeadershipBonus = kingdomLevel < 8 ? 1 : (kingdomLevel < 16 ? 2 : 3);
    return {
        claimHexAttempts,
        claimHexCircumstanceBonus,
        investedLeadershipBonus,
        resourceDice: kingdomLevel + 4,
    };
}

export function getSizeData(kingdomSize: number): KingdomSizeData {
    if (kingdomSize < 10) {
        return {
            type: 'territory',
            resourceDieSize: 'd4',
            controlDCModifier: 0,
            commodityStorage: 4,
        };
    } else if (kingdomSize < 25) {
        return {
            type: 'province',
            resourceDieSize: 'd6',
            controlDCModifier: 1,
            commodityStorage: 8,
        };
    } else if (kingdomSize < 50) {
        return {
            type: 'state',
            resourceDieSize: 'd8',
            controlDCModifier: 2,
            commodityStorage: 12,
        };
    } else if (kingdomSize < 100) {
        return {
            type: 'country',
            resourceDieSize: 'd10',
            controlDCModifier: 3,
            commodityStorage: 16,
        };
    } else {
        return {
            type: 'dominion',
            resourceDieSize: 'd12',
            controlDCModifier: 4,
            commodityStorage: 20,
        };
    }
}

export function getControlDC(level: number, size: number): number {
    const sizeModifier = getSizeData(size).controlDCModifier;
    const adjustedLevel = level < 5 ? level - 1 : level;
    return 14 + adjustedLevel + Math.floor(adjustedLevel / 3) + sizeModifier;
}

export function getDefaultKingdomData(): Kingdom {
    return {
        name: '',
        atWar: false,
        charter: '',
        government: '',
        activeSettlement: '',
        fame: 0,
        fameType: 'famous',
        level: 11,
        xpThreshold: 1000,
        xp: 0,
        size: 0,
        unrest: 0,
        feats: [{
            level: 2,
            id: 'Crush Dissent',
        }],
        bonusFeats: [{
            id: 'Crush Dissent',
        }],
        workSites: {
            farmlands: {
                quantity: 0,
                resources: 0,
            },
            quarries: {
                quantity: 0,
                resources: 0,
            },
            lumberCamps: {
                quantity: 0,
                resources: 0,
            },
            mines: {
                quantity: 0,
                resources: 0,
            },
        },
        commodities: {
            food: 0,
            ore: 0,
            lumber: 0,
            stone: 0,
            luxuries: 0,
        },
        resources: {
            bonusResourceDice: 0,
            resourcePoints: 0,
        },
        commoditiesNextRound: {
            food: 0,
            ore: 0,
            lumber: 0,
            stone: 0,
            luxuries: 0,
        },
        resourcesNextRound: {
            bonusResourceDice: 0,
            resourcePoints: 0,
        },
        heartland: 'plains',
        armyConsumption: 0,
        leaders: {
            ruler: {
                invested: false,
                type: 'pc',
                vacant: false,
                name: '',
            },
            counselor: {
                invested: false,
                type: 'pc',
                vacant: false,
                name: '',
            },
            general: {
                invested: false,
                type: 'pc',
                vacant: false,
                name: '',
            },
            emissary: {
                invested: false,
                type: 'pc',
                vacant: false,
                name: '',
            },
            magister: {
                invested: false,
                type: 'pc',
                vacant: false,
                name: '',
            },
            treasurer: {
                invested: false,
                type: 'pc',
                vacant: false,
                name: '',
            },
            viceroy: {
                invested: false,
                type: 'pc',
                vacant: false,
                name: '',
            },
            warden: {
                invested: false,
                type: 'pc',
                vacant: false,
                name: '',
            },
        },
        tradeAgreements: [{
            atWar: true,
            relations: 'diplomatic-relations',
            negotiationDC: 34,
            group: 'Chess',
        }],
        skillRanks: {
            agriculture: 0,
            arts: 0,
            boating: 0,
            defense: 0,
            engineering: 0,
            exploration: 0,
            folklore: 0,
            industry: 0,
            intrigue: 0,
            magic: 0,
            politics: 0,
            scholarship: 0,
            statecraft: 0,
            trade: 0,
            warfare: 0,
            wilderness: 0,
        },
        abilityScores: {
            culture: 10,
            economy: 10,
            loyalty: 10,
            stability: 10,
        },
        ruin: {
            corruption: {
                penalty: 0,
                threshold: 0,
                value: 0,
            },
            crime: {
                penalty: 0,
                threshold: 0,
                value: 0,
            },
            decay: {
                penalty: 0,
                threshold: 0,
                value: 0,
            },
            strife: {
                penalty: 0,
                threshold: 0,
                value: 0,
            },
        },
    };
}