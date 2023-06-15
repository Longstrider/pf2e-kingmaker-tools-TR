import {DateTime} from 'luxon';
import {RollTableDraw} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/data/documents/table';

declare global {
    interface Game {
        pf2eKingmakerTools: {
            macros: {
                toggleWeatherMacro: () => void,
                toTimeOfDayMacro: () => void,
                randomEncounterMacro: () => void,
                kingdomEventsMacro: () => void,
                postCompanionEffectsMacro: () => void,
                rollKingmakerWeatherMacro: () => void,
                stopWatchMacro: () => void,
                viewKingdomMacro: () => void,
                openCampingSheet: () => void,
                viewArmyMacro: (actor: Actor, token: Token) => void,
                /* eslint-disable @typescript-eslint/no-explicit-any */
                subsistMacro: (actor: any) => void,
                /* eslint-disable @typescript-eslint/no-explicit-any */
                huntAndGatherMacro: (actor: any) => Promise<void>,
                /* eslint-disable @typescript-eslint/no-explicit-any */
                camouflageCampsiteMacro: (actor: any) => Promise<void>,
                /* eslint-disable @typescript-eslint/no-explicit-any */
                organizeWatchMacro: (actor: any) => Promise<void>,
                /* eslint-disable @typescript-eslint/no-explicit-any */
                tellCampfireStoryMacro: (actor: any) => Promise<void>,
                /* eslint-disable @typescript-eslint/no-explicit-any */
                prepareCampsiteMacro: (actor: any) => Promise<void>,
                /* eslint-disable @typescript-eslint/no-explicit-any */
                cookRecipeMacro: (actor: any) => Promise<void>,
                /* eslint-disable @typescript-eslint/no-explicit-any */
                discoverSpecialMealMacro: (actor: any) => Promise<void>,
                /* eslint-disable @typescript-eslint/no-explicit-any */
                learnFromCompanionMacro: (actor: any) => Promise<void>,
                /* eslint-disable @typescript-eslint/no-explicit-any */
                campManagementMacro: (actor: any) => Promise<void>,
                /* eslint-disable @typescript-eslint/no-explicit-any */
                editStructureMacro: (actor: any) => Promise<void>,
                rollExplorationSkillCheck: (skill: string, effect: string) => Promise<void>,
                rollSkillDialog: () => Promise<void>,
            };
        };
        pf2e: {
            worldClock: {
                worldTime: DateTime;
                month: string;
            }
        }
    }

    // fix roll table types
    interface RollTable {
        draw(options?: Partial<RollTable.DrawOptions>): Promise<RollTableDraw>;
    }
}
