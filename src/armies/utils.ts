import {Army, armyStatisticsByLevel} from './data';

export function createDefaultArmy(): Army {
    return {
        level: 1,
        description: '',
        type: 'infantry',
        hp: 0,
        highSave: 'morale',
        name: 'Army Name',
        routeThreshold: 0,
        currentHp: 0,
        alignment: 'N',
        consumption: 0,
        rarity: 'common',
        adjustments: {
            ranged: 0,
            melee: 0,
            maneuver: 0,
            recruitmentDC: 0,
            morale: 0,
            ac: 0,
            scouting: 0,
        },
        gear: [],
        tactics: [],
        conditions: [],
    };
}

export interface CalculatedArmyStats {
    ac: number;
    maneuver: number;
    morale: number;
    scouting: number;
    recruitmentDC: number;
    meleeModifier: number;
    rangedModifier: number;
    maximumTactics: number;
}

export interface CalculatedArmy extends Army, CalculatedArmyStats {
}

function calculateArmyStats(army: Army): CalculatedArmyStats {
    const level = army.level;
    const highSave = army.highSave;
    const data = armyStatisticsByLevel.get(level)!;
    const maneuver = highSave === 'maneuver' ? data.highSave : data.lowSave;
    const morale = highSave === 'morale' ? data.highSave : data.lowSave;
    return {
        ac: data.ac + army.adjustments.ac,
        maneuver: maneuver + army.adjustments.maneuver,
        morale: morale + army.adjustments.morale,
        scouting: data.scouting + army.adjustments.scouting,
        recruitmentDC: data.standardDC + army.adjustments.recruitmentDC,
        meleeModifier: data.attack + army.adjustments.melee,
        rangedModifier: data.attack + army.adjustments.ranged,
        maximumTactics: data.maximumTactics,
    };
}

export function calculateArmyData(army: Army): CalculatedArmy {
    return {
        ...army,
        ...calculateArmyStats(army),
    };
}
