import {DegreeOfSuccess} from '../degree-of-success';
import {roll} from '../utils';
import {basicIngredientUuid, DcType, specialIngredientUuid} from './data';
import {getRegionInfo} from './regions';

export const allCampingActivityNames = [
    'Prepare Campsite',
    'Camouflage Campsite',
    'Cook Basic Meal',
    'Cook Special Meal',
    'Discover Special Meal',
    'Hunt and Gather',
    'Learn from a Companion',
    'Organize Watch',
    'Relax',
    'Tell Campfire Story',
    'Blend Into The Night',
    'Bolster Confidence',
    'Camp Management',
    'Dawnflower\'s Blessing',
    'Enhance Campfire',
    'Enhance Weapons',
    'Intimidating Posture',
    'Maintain Armor',
    'Set Alarms',
    'Set Traps',
    'Undead Guardians',
    'Water Hazards',
    'Wilderness Survival',
    'Influence Amiri',
    'Discover Amiri',
    'Influence Ekundayo',
    'Discover Ekundayo',
    'Influence Jubilost',
    'Discover Jubilost',
    'Influence Linzi',
    'Discover Linzi',
    'Influence Nok-Nok',
    'Discover Nok-Nok',
    'Influence Tristian',
    'Discover Tristian',
    'Influence Valerie',
    'Discover Valerie',
    'Influence Harrim',
    'Discover Harrim',
    'Influence Jaethal',
    'Discover Jaethal',
    'Influence Kalikke',
    'Discover Kalikke',
    'Influence Kanerah',
    'Discover Kanerah',
    'Influence Octavia',
    'Discover Octavia',
    'Influence Regongar',
    'Discover Regongar',
] as const;

export type CampingActivityName = typeof allCampingActivityNames[number];

export const allCompanionNames = [
    'Amiri',
    'Ekundayo',
    'Jubilost',
    'Linzi',
    'Nok-Nok',
    'Tristian',
    'Valerie',
    'Harrim',
    'Jaethal',
    'Kalikke',
    'Kanerah',
    'Octavia',
    'Regongar',
] as const;

export type CompanionNames = typeof allCompanionNames[number];

interface ActivityOutcome {
    message: string;
    effectUuid?: string;
    modifyRandomEncounterDc?: {
        camping: number;
        watch: number;
    }
    checkRandomEncounter?: boolean;
}

interface SkillRequirement {
    skill: string;
    proficiency: 'trained' | 'expert' | 'master' | 'legendary';
}

export interface CampingActivityData {
    name: CampingActivityName;
    criticalSuccess?: ActivityOutcome;
    success?: ActivityOutcome;
    failure?: ActivityOutcome;
    criticalFailure?: ActivityOutcome;
    journalUuid: string;
    skillRequirements: SkillRequirement[];
    dc?: DcType;
    skills: string[];
    isSecret: boolean;
    isLocked: boolean;
    effectUuid?: string;
    isCustomAction?: boolean;
    modifyRandomEncounterDc?: {
        camping: number;
        watch: number;
    },
    isHomebrew?: boolean;
}

function influenceCompanions(): CampingActivityData[] {
    return allCompanionNames.flatMap(c => {
        const influence: CampingActivityData = {
            name: `Influence ${c}` as CampingActivityName,
            journalUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-journals.JournalEntry.uSTTCqRYCWj7a38F.JournalEntryPage.D83mNy8bYqKULEnu',
            isLocked: true,
            isSecret: false,
            skillRequirements: [],
            skills: [],
            criticalSuccess: {message: `You gain 2 Influence Points with ${c}`},
            success: {message: `You gain 1 Influence Points with ${c}`},
            failure: {message: `You gain no Influence Points with ${c}`},
            criticalFailure: {message: `You lose 1 Influence Points with ${c}`},
        };
        const discover: CampingActivityData = {
            name: `Discover ${c}` as CampingActivityName,
            journalUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-journals.JournalEntry.uSTTCqRYCWj7a38F.JournalEntryPage.nCwES51tV7FmrfCN',
            isLocked: true,
            isSecret: true,
            skillRequirements: [],
            skills: [],
            criticalSuccess: {message: `Choose two of the following: You learn which skill that can Influence ${c} has the lowest DC (skipping any skills that you already know), one of ${c}’s personal biases, one of ${c}’s resistances, or one of ${c}’s weaknesses. you can choose the same option twice to learn two pieces of information from the same category.`},
            success: {message: `Choose one of the following: You learn which skill that can Influence ${c} has the lowest DC (skipping any skills that you already know), one of ${c}’s personal biases, one of ${c}’s resistances, or one of ${c}’s weaknesses.`},
            failure: {message: 'You learn no information.'},
            criticalFailure: {message: `Choose a piece of information to learn about, as success, but the information is incorrect. For instance, you might think ${c} is susceptible to flattery when actually ${c} is resistant to flattery.`},
        };
        return [influence, discover];
    });
}

const allCampingActivities: CampingActivityData[] = [{
    name: 'Camouflage Campsite',
    journalUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-journals.JournalEntry.uSTTCqRYCWj7a38F.JournalEntryPage.mlLCjokti3RXAlUP',
    isLocked: false,
    isSecret: true,
    dc: 'zone',
    skillRequirements: [{skill: 'stealth', proficiency: 'trained'}],
    skills: ['stealth'],
    criticalSuccess: {
        message: 'Your camouflage attempt exceeds expectation. Increase the Encounter DC for your camp by 2. The first time a flat check would result in an encounter during this camping session, instead treat that result as a failure with no encounter.',
        modifyRandomEncounterDc: {
            camping: 2,
            watch: 2,
        },
    },
    success: {
        message: 'Your work helps hide your camp from detection. Increase the Encounter DC for your camp by 1.',
        modifyRandomEncounterDc: {
            camping: 1,
            watch: 1,
        },
    },
    criticalFailure: {
        message: 'You believe you’ve done well at your camouflage attempt but have actually forgotten something important or accidentally did something to make the campsite more noticeable. Decrease the Encounter DC for your camp by 2, and flat checks made to determine encounters result in a critical success on a roll of 19 or 20.',
        modifyRandomEncounterDc: {
            camping: -2,
            watch: -2,
        },
    },
}, {
    name: 'Cook Basic Meal',
    journalUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-journals.JournalEntry.uSTTCqRYCWj7a38F.JournalEntryPage.vsE5Uv19lx9cQpwr',
    isLocked: false,
    isSecret: false,
    skillRequirements: [],
    skills: [],
}, {
    name: 'Cook Special Meal',
    journalUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-journals.JournalEntry.uSTTCqRYCWj7a38F.JournalEntryPage.S72BNBTfKfkCjriU',
    isLocked: false,
    isSecret: false,
    skillRequirements: [],
    skills: [],
}, {
    name: 'Discover Special Meal',
    journalUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-journals.JournalEntry.uSTTCqRYCWj7a38F.JournalEntryPage.5I8jnFjirbbIUkGy',
    isLocked: false,
    isSecret: false,
    dc: 'zone',
    skillRequirements: [{skill: 'cooking', proficiency: 'trained'}],
    skills: ['cooking'],
    criticalSuccess: {
        message: 'You discover the special meal and add it to the list of recipes the party knows. In addition, your research was efficient, and you recover half of the ingredients you had to expend to attempt this activity.',
    },
    success: {
        message: 'As critical success, but you do not recover any ingredients.',
    },
    failure: {
        message: 'You fail to discover the special meal and do not recover any ingredients.',
    },
    criticalFailure: {
        message: 'As failure, but you also expose yourself to the special meal’s critical failure effect while performing an unwise taste test.',
    },
    isCustomAction: true,
}, {
    name: 'Hunt and Gather',
    journalUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-journals.JournalEntry.uSTTCqRYCWj7a38F.JournalEntryPage.RujdVNvLpoQBBdVV',
    isLocked: false,
    isSecret: false,
    dc: 'zone',
    skillRequirements: [{skill: 'survival', proficiency: 'trained'}],
    skills: ['survival', 'hunting'],
    criticalSuccess: {
        message: 'You find a number of Basic Ingredients equal to twice the zone’s DC, plus 4 Special Ingredients. If you’re Hunting and Gathering in a zone that’s at least level 7, increase the number of special ingredients found to 8; if you’re doing so in a zone that’s at least level 14, increase it to 12.',
    },
    success: {
        message: 'You find a number of Basic Ingredients equal to the zone’s DC, plus [[/r 1d4]] Special Ingredients. If you’re Hunting and Gathering in a zone that’s at least level 7, increase the number of special ingredients found to [[/r 2d4]]; if you’re doing so in a zone that’s at least level 14, increase it to [[/r 3d4]].',
    },
    failure: {
        message: 'You find a number of Basic Ingredients equal to the zone’s DC.',
    },
    criticalFailure: {
        message: 'You find [[/r 1d4]] Basic Ingredients (maximum equal to the zone’s DC). In addition, you’ve attracted attention. Make an additional flat check to determine if a random encounter occurs at your campsite following this activity.',
        checkRandomEncounter: true,
    },
}, {
    name: 'Learn from a Companion',
    journalUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-journals.JournalEntry.uSTTCqRYCWj7a38F.JournalEntryPage.MyeB2g0yDwEsqfI9',
    isLocked: true,
    isSecret: false,
    dc: 20,
    skillRequirements: [],
    skills: ['perception'],
    criticalSuccess: {
        message: 'You learn the companion’s special activity. Any PC who meets that activity’s requirements (see table above) can now perform that activity even when the companion isn’t in the camp.',
    },
    success: {
        message: 'You make progress in learning the special activity but require at least one more day to master it. If you attempt to Learn from this Companion the next time you camp, the result of that check is improved by one degree of success from the result rolled.',
    },
    failure: {
        message: 'You fail to learn anything from the companion.',
    },
    criticalFailure: {
        message: 'You fail to learn from the companion, who grows frustrated with the party. No further attempts to Learn from this Companion can be attempted during this camping session.',
    },
}, {
    name: 'Organize Watch',
    journalUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-journals.JournalEntry.uSTTCqRYCWj7a38F.JournalEntryPage.wgyPZBRgPjTeK0Ch',
    isLocked: false,
    isSecret: false,
    dc: 'zone',
    skillRequirements: [{skill: 'perception', proficiency: 'expert'}],
    skills: ['perception'],
    criticalSuccess: {
        message: 'The camp’s watch is efficient. Treat the total time required for rest as if the party size were 1 more, and all characters gain a +2 status bonus to Perception checks made during their shift on watch.',
        effectUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-camping-effects.Item.010XlkzzjX38BHsO',
    },
    success: {
        message: 'Characters gain a +1 status bonus to Perception checks made during their shift on watch.',
        effectUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-camping-effects.Item.MOXWga7l8dsypUPy',
    },
    failure: {
        message: 'Your attempt to organize the watch doesn’t grant any additional benefits.',
    },
    criticalFailure: {
        message: 'As failure, but you may have attracted unwanted attention. Attempt a flat check against the zone’s Encounter DC to determine if a random encounter occurs.',
        checkRandomEncounter: true,
    },
}, {
    name: 'Relax',
    journalUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-journals.JournalEntry.uSTTCqRYCWj7a38F.JournalEntryPage.J2SaSNjxAKy9IhzI',
    isLocked: false,
    isSecret: false,
    skillRequirements: [],
    skills: [],
}, {
    name: 'Tell Campfire Story',
    journalUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-journals.JournalEntry.uSTTCqRYCWj7a38F.JournalEntryPage.XaKD1oGTAgZUjlQ5',
    isLocked: false,
    isSecret: false,
    dc: 'actorLevel',
    skillRequirements: [],
    skills: [],
    criticalSuccess: {
        message: 'You inspire your allies dramatically. For the remainder of the camping session, your allies gain a +2 status bonus to attack rolls, saving throws, and skill checks during combat at the campsite. The bonuses end as soon as daily preparations begin after resting is concluded. If an ally spent the hour Relaxing, they can also choose to reroll a failed roll at any time once during the remainder of the camping session while the status bonus persists; this is a fortune effect.',
        effectUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-camping-effects.Item.2vdskbqd0VrWKR9Y',
    },
    success: {
        message: 'You inspire your allies dramatically. For the remainder of the camping session, your allies gain a +1 status bonus to attack rolls, saving throws, and skill checks during combat at the campsite. The bonuses end as soon as daily preparations begin after resting is concluded. An ally who spent the hour Relaxing receives a +2 status bonus.',
        effectUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-camping-effects.Item.wT2NzrfgmWmCMRtv',
    },
    failure: {
        message: 'Your allies are unmoved and receive no benefits.',
    },
    criticalFailure: {
        message: 'Your story distracts or unsettles your allies. They each take a –1 status penalty to skill checks until they Relax or until they begin daily preparations.',
        effectUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-camping-effects.Item.y5Jqw40SWNOgcxvC',
    },
}, ...influenceCompanions(), {
    name: 'Blend Into The Night',
    journalUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-journals.JournalEntry.uSTTCqRYCWj7a38F.JournalEntryPage.jz1FI7zSoPLR8iBL',
    isLocked: true,
    isSecret: false,
    skillRequirements: [],
    skills: [],
    modifyRandomEncounterDc: {
        camping: 0,
        watch: 2,
    },
}, {
    name: 'Bolster Confidence',
    journalUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-journals.JournalEntry.uSTTCqRYCWj7a38F.JournalEntryPage.pxHYFLK7VYGppCzS',
    isLocked: true,
    isSecret: false,
    skillRequirements: [],
    skills: [],
    effectUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-camping-effects.Item.mAEvnTqFuLIASQLB',
}, {
    name: 'Camp Management',
    journalUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-journals.JournalEntry.uSTTCqRYCWj7a38F.JournalEntryPage.JRScwsFTXTpTwWYA',
    isLocked: true,
    isSecret: false,
    dc: 'zone',
    skillRequirements: [],
    skills: [],
    criticalSuccess: {
        message: 'Jubilost’s advice speeds things along significantly. During the hour immediately following this critical success, each PC may attempt two Camping activities instead of one. This success does not increase the number of activities companions may attempt.',
    },
    success: {
        message: 'Jubilost’s advice speeds things along significantly. During the hour immediately following this critical success, one PC may attempt two Camping activities instead of one. This success does not increase the number of activities companions may attempt.',
    },
    criticalFailure: {
        message: 'Jubilost’s advice backfires, resulting in inefficiencies during the rest of the camping session. All checks made to resolve Camping activities take a –2 circumstance penalty for the remainder of this camping session.',
        effectUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-camping-effects.Item.vpH13xgAqX4zsU6o',
    },
}, {
    name: 'Dawnflower\'s Blessing',
    journalUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-journals.JournalEntry.uSTTCqRYCWj7a38F.JournalEntryPage.X4ggcXUe0wPiW4jt',
    isLocked: true,
    isSecret: false,
    skillRequirements: [],
    skills: [],
    effectUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-camping-effects.Item.eaWmjDOIvUF9aDbq',
}, {
    name: 'Enhance Campfire',
    journalUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-journals.JournalEntry.uSTTCqRYCWj7a38F.JournalEntryPage.ytyW9F39m7xf0gx5',
    isLocked: true,
    isSecret: false,
    skillRequirements: [],
    skills: [],
    effectUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-camping-effects.Item.NFPQHxvpJd2vsKMe',
}, {
    name: 'Enhance Weapons',
    journalUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-journals.JournalEntry.uSTTCqRYCWj7a38F.JournalEntryPage.2Dn89HrY7gyvQiOH',
    isLocked: true,
    isSecret: false,
    skillRequirements: [],
    skills: [],
}, {
    name: 'Intimidating Posture',
    journalUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-journals.JournalEntry.uSTTCqRYCWj7a38F.JournalEntryPage.LhhERalHv4QA14fQ',
    isLocked: true,
    isSecret: false,
    skillRequirements: [],
    skills: [],
}, {
    name: 'Maintain Armor',
    journalUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-journals.JournalEntry.uSTTCqRYCWj7a38F.JournalEntryPage.zUaeA8Ud9dv3hhnc',
    isLocked: true,
    isSecret: false,
    skillRequirements: [],
    skills: [],
}, {
    name: 'Set Alarms',
    journalUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-journals.JournalEntry.uSTTCqRYCWj7a38F.JournalEntryPage.vWSQmYLKlrk3rLDE',
    isLocked: true,
    isSecret: false,
    skillRequirements: [],
    skills: [],
    effectUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-camping-effects.Item.ptjs54eoEX8EAQNq',
}, {
    name: 'Set Traps',
    journalUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-journals.JournalEntry.uSTTCqRYCWj7a38F.JournalEntryPage.5ynOh085kwNp75t4',
    isLocked: true,
    isSecret: false,
    skillRequirements: [],
    skills: [],
}, {
    name: 'Undead Guardians',
    journalUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-journals.JournalEntry.uSTTCqRYCWj7a38F.JournalEntryPage.YzOixXzCwfXOBjtx',
    isLocked: true,
    isSecret: false,
    skillRequirements: [],
    skills: [],
}, {
    name: 'Water Hazards',
    journalUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-journals.JournalEntry.uSTTCqRYCWj7a38F.JournalEntryPage.HGcwmsfjVqfLeYhu',
    isLocked: true,
    isSecret: false,
    skillRequirements: [],
    skills: [],
}, {
    name: 'Wilderness Survival',
    journalUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-journals.JournalEntry.uSTTCqRYCWj7a38F.JournalEntryPage.8PNH77YHVkw9KoAv',
    isLocked: true,
    isSecret: false,
    dc: 'zone',
    skillRequirements: [],
    skills: [],
    effectUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-camping-effects.Item.v9i9W49PeJ9NkfXX',
}, {
    name: 'Prepare Campsite',
    dc: 'zone',
    skills: ['survival'],
    skillRequirements: [],
    isSecret: false,
    journalUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-journals.JournalEntry.uSTTCqRYCWj7a38F.JournalEntryPage.Iuen7iSvZAlnAJFB',
    isLocked: false,
    criticalSuccess: {
        message: 'Prepare Campsite: You find the perfect spot for a camp. Flat checks to determine encounters at the campsite for the next 24 hours have a DC 2 higher than normal, and the first 2 hours spent performing Camping activities does not incur the usual flat check for random encounters.',
        modifyRandomEncounterDc: {
            camping: 2,
            watch: 2,
        },
    },
    success: {
        message: 'Prepare Campsite: You find a serviceable spot for a camp and for Camping activities.',
    },
    failure: {
        message: 'Prepare Campsite: Your campsite will work, but it’s not the best. Campsite activities that require checks take a –2 penalty.',
        effectUuid: 'Compendium.pf2e-kingmaker-tools.kingmaker-tools-camping-effects.Item.X1OvR5j1cAXZ4Lbp',
    },
    criticalFailure: {
        message: 'Prepare Campsite: Your campsite is a mess. You can use it to rest and to perform daily preparations, but it isn’t good enough to allow for Campsite activities at all. Worse, your attempt to secure a campsite has possibly attracted unwanted attention—attempt a flat check against the zone’s Encounter DC. If successful, a random encounter automatically occurs.',
        checkRandomEncounter: true,
    },
}];

export function getCampingActivityData(): CampingActivityData[] {
    return allCampingActivities;
}

interface Ingredients {
    basic: number;
    special: number;
}

export async function getHuntAndGatherQuantities(
    degreeOfSuccess: DegreeOfSuccess,
    zoneDc: number,
    zoneLevel: number,
): Promise<Ingredients> {
    if (degreeOfSuccess === DegreeOfSuccess.CRITICAL_SUCCESS) {
        return {
            basic: 2 * zoneDc,
            special: zoneLevel >= 14 ? 12 : (zoneLevel >= 7 ? 8 : 4),
        };
    } else if (degreeOfSuccess === DegreeOfSuccess.SUCCESS) {
        return {
            basic: zoneDc,
            special: await roll((zoneLevel >= 14 ? 3 : (zoneLevel >= 7 ? 2 : 1)) + 'd4', 'Special Ingredients'),
        };
    } else if (degreeOfSuccess === DegreeOfSuccess.FAILURE) {
        return {
            basic: zoneDc,
            special: 0,
        };
    } else {
        return {
            basic: await roll('1d4', 'Basic Ingredients'),
            special: 0,
        };
    }
}

export async function addIngredientsToActor(actor: Actor, ingredients: Ingredients): Promise<void> {
    const basicIngredient = (await fromUuid(basicIngredientUuid))?.toObject();
    const specialIngredient = (await fromUuid(specialIngredientUuid))?.toObject();
    if (ingredients.basic > 0) {
        basicIngredient.system.quantity = ingredients.basic;
        /* eslint-disable @typescript-eslint/no-explicit-any */
        await (actor as any).addToInventory(basicIngredient, undefined, false);
    }
    if (ingredients.special > 0) {
        specialIngredient.system.quantity = ingredients.special;
        /* eslint-disable @typescript-eslint/no-explicit-any */
        await (actor as any).addToInventory(specialIngredient, undefined, false);
    }
}

export async function huntAndGather(game: Game, actor: Actor, degreeOfSuccess: DegreeOfSuccess): Promise<void> {
    const {zoneDC, zoneLevel} = getRegionInfo(game);
    const quantities = await getHuntAndGatherQuantities(degreeOfSuccess, zoneDC, zoneLevel);
    await addIngredientsToActor(actor, quantities);
}

export const campingEffectUuids = new Set(allCampingActivities.flatMap(a => {
    return [a.criticalSuccess?.effectUuid, a.criticalFailure?.effectUuid, a.failure?.effectUuid, a.success?.effectUuid]
        .filter(a => a!== undefined) as string[];
}));