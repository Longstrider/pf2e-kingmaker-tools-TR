import {CheckDialog} from './check-dialog';
import {DegreeOfSuccess} from '../../degree-of-success';
import {isPlayerArmyActor, isSpecialArmy} from '../../armies/utils';
import {capitalize, createUUIDLink} from '../../utils';
import {Kingdom} from '../data/kingdom';

interface ArmyTacticsBrowserOptions {
    game: Game;
    armies: (Actor & ArmyActor)[];
    kingdom: Kingdom;
    sheetActor: Actor;
    onRoll: (consumeModifiers: Set<string>) => Promise<void>;
}

interface ArmyView {
    link: string;
    name: string | null;
    dc: number;
    special: boolean;
    uuid: string;
    type: string;
}

interface ArmyBrowserData {
    armies: ArmyView[];
}

class ArmyBrowserApp extends FormApplication<
    FormApplicationOptions & ArmyTacticsBrowserOptions,
    object,
    null
> {
    private game: Game;
    private kingdom: Kingdom;
    private sheetActor: Actor;
    private onRoll: (consumeModifiers: Set<string>) => Promise<void>;
    private armies: (Actor & ArmyActor)[];

    static override get defaultOptions(): FormApplicationOptions {
        const options = super.defaultOptions;
        options.id = 'army-browser-app';
        options.title = 'Army Browser';
        options.template = 'modules/pf2e-kingmaker-tools/templates/kingdom/army-browser.hbs';
        options.classes = ['kingmaker-tools-app', 'army-browser-app'];
        options.height = 'auto';
        options.submitOnChange = true;
        options.closeOnSubmit = false;
        return options;
    }

    constructor(options: Partial<ApplicationOptions> & ArmyTacticsBrowserOptions) {
        super(null, options);
        this.game = options.game;
        this.armies = options.armies;
        this.kingdom = options.kingdom;
        this.sheetActor = options.sheetActor;
        this.onRoll = options.onRoll;
    }

    override async getData(): Promise<ArmyBrowserData> {
        return {
            armies: await this.toView(this.armies),
        };
    }

    override activateListeners(html: JQuery): void {
        super.activateListeners(html);
        const $html = html[0];
        $html.querySelectorAll('.km-tactic-link')
            .forEach(el => el.addEventListener('click', async (ev): Promise<void> => {
                ev.preventDefault();
                ev.stopPropagation();
                const target = ev.currentTarget as HTMLElement;
                const uuid = target.dataset.uuid!;
                const item = await fromUuid(uuid) as Item | null;
                item?.sheet?.render(true);
            }));
        $html.querySelectorAll('.km-recruit-army')
            .forEach(el => el.addEventListener('click', (ev) => this.trainTactic(ev)));
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    protected async _updateObject(event: Event, formData: any): Promise<void> {
        console.log(formData);
        this.render();
    }

    private async trainTactic(ev: Event): Promise<void> {
        const button = ev.currentTarget as HTMLElement;
        const id = button.dataset.id!;
        const actor: Actor | null = await fromUuid(id) as Actor | null;
        if (actor !== null && isPlayerArmyActor(actor)) {
            const tacticLink = await TextEditor.enrichHTML(createUUIDLink(actor.uuid));
            new CheckDialog(null, {
                activity: 'recruit-army',
                kingdom: this.kingdom,
                overrideSkills: isSpecialArmy(actor) ? {statecraft: 0} : {warfare: 0},
                dc: actor.system.recruitmentDC,
                game: this.game,
                type: 'activity',
                onRoll: this.onRoll,
                actor: this.sheetActor,
                afterRoll: async (): Promise<void> => {
                    await this.close();
                },
                additionalChatMessages: [{
                    [DegreeOfSuccess.CRITICAL_SUCCESS]: tacticLink,
                    [DegreeOfSuccess.SUCCESS]: tacticLink,
                }],
            }).render(true);
        }
    }

    private async toView(actors: (Actor & ArmyActor)[]): Promise<ArmyView[]> {
        return await Promise.all(actors
            .filter(a => a.name !== null)
            .sort((a, b) => a.name!.localeCompare(b.name!))
            .map(async (actor) => {
                return {
                    link: await TextEditor.enrichHTML(createUUIDLink(actor.uuid)),
                    dc: actor.system.recruitmentDC,
                    name: actor.name,
                    uuid: actor.uuid,
                    special: isSpecialArmy(actor),
                    type: capitalize(actor.system.traits.type),
                };
            }));
    }
}

export async function showArmyBrowser(options: ArmyTacticsBrowserOptions): Promise<void> {
    new ArmyBrowserApp(options).render(true);
}
