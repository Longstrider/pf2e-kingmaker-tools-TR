import {calculateArmyData, CalculatedArmy} from './utils';
import {
    allAlignmentLabels,
    allAlignments,
    allArmySaves,
    allArmyTypes,
    allLevels,
    allRarities,
    armiesByName,
} from './data';
import {capitalize} from '../utils';

interface ArmyOptions {
    game: Game;
    actor: Actor;
    token: Token;
}

interface SelectValue {
    label: string;
    value: string;
}

interface ArmyData extends CalculatedArmy {
    rarities: SelectValue[];
    saves: SelectValue[];
    alignments: SelectValue[];
    types: SelectValue[];
    levels: SelectValue[];
    tabs: Record<string, boolean>;
}

type ArmyTab = 'status' | 'gear' | 'conditions' | 'tactics' | 'actions';


class ArmySheet extends FormApplication<FormApplicationOptions & ArmyOptions, object, null> {
    static override get defaultOptions(): FormApplicationOptions {
        const options = super.defaultOptions;
        options.id = 'army-app';
        options.title = 'Army';
        options.template = 'modules/pf2e-kingmaker-tools/templates/army/sheet.hbs';
        options.submitOnChange = true;
        options.closeOnSubmit = false;
        options.classes = ['kingmaker-tools-app', 'army-app'];
        options.width = 850;
        options.height = 'auto';
        options.scrollY = ['.km-content', '.km-sidebar'];
        return options;
    }

    private token: Token;

    private actor: Actor;
    private readonly game: Game;
    private nav: ArmyTab = 'status';


    constructor(object: null, options: Partial<FormApplicationOptions> & ArmyOptions) {
        super(object, options);
        this.game = options.game;
        this.actor = options.actor;
        this.token = options.token;
        this.actor.apps[this.appId] = this;
    }

    override async getData(): Promise<ArmyData> {
        const name = 'First World Army';
        const data = armiesByName.get(name)!;
        const army = calculateArmyData(data);
        console.log(army);
        return {
            ...army,
            alignments: allAlignments.map((alignment, index) => {
                return {value: alignment, label: allAlignmentLabels[index]};
            }),
            rarities: allRarities.map(rarity => {
                return {value: rarity, label: capitalize(rarity)};
            }),
            types: allArmyTypes.map(type => {
                return {value: type, label: capitalize(type)};
            }),
            saves: allArmySaves.map(save => {
                return {value: save, label: capitalize(save)};
            }),
            levels: allLevels.map(level => {
                return {value: `${level}`, label: `${level}`};
            }),
            tabs: this.getActiveTabs(),
        };
    }

    private getActiveTabs(): Record<string, boolean> {
        return {
            statusTab: this.nav === 'status',
            actionsTab: this.nav === 'actions',
            gearTab: this.nav === 'gear',
            tacticsTab: this.nav === 'tactics',
            conditionsTab: this.nav === 'conditions',
        };
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    override async _updateObject(event: Event, formData: any): Promise<void> {
        console.log(formData);
        return;
    }

    override activateListeners(html: JQuery): void {
        super.activateListeners(html);
        const $html = html[0];
        $html.querySelectorAll('.km-nav a')?.forEach(el => {
            el.addEventListener('click', (event) => {
                const tab = event.currentTarget as HTMLAnchorElement;
                this.nav = tab.dataset.tab as ArmyTab;
                this.render();
            });
        });
    }
}


export async function showArmy(game: Game, actor: Actor, token: Token): Promise<void> {
    if (actor) {
        new ArmySheet(null, {game, actor, token}).render(true);
    } else {
        ui.notifications?.error('Please select a token');
    }
}
